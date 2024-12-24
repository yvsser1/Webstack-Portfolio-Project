import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { BookingStatus } from '../../types';
import { BookingStatusBadge } from '../ui/BookingStatusBadge';

interface Booking {
  id: string;
  car: {
    make: string;
    model: string;
  };
  user: {
    email: string;
  };
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
}

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        id,
        start_date,
        end_date,
        total_price,
        status,
        car:cars(make, model),
        user_id
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Fetch user emails from auth.users table
      const userIds = [...new Set(data.map(booking => booking.user_id))];
      const { data: users } = await supabase.auth.admin.listUsers({
        userIds
      });

      const bookingsWithUserData = data.map(booking => ({
        ...booking,
        user: {
          email: users?.users.find(u => u.id === booking.user_id)?.email || 'Unknown'
        }
      }));

      setBookings(bookingsWithUserData);
    }
  };

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      loadBookings();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Car
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.car.make} {booking.car.model}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{booking.user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(booking.start_date), 'MMM d, yyyy')} -
                  {format(new Date(booking.end_date), 'MMM d, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ${booking.total_price}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {booking.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}