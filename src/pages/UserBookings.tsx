import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuthStore } from '../stores/authStore';

interface Booking {
  id: string;
  car: {
    make: string;
    model: string;
  };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

export function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        id,
        start_date,
        end_date,
        total_price,
        status,
        car:cars(make, model)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setBookings(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.car.make} {booking.car.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(booking.start_date), 'MMM d, yyyy')} -
                  {format(new Date(booking.end_date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${booking.total_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}