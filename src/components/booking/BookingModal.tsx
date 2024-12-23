import React, { useState } from 'react';
import { Car } from '../../types';
import { addDays, format } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

interface BookingModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ car, isOpen, onClose }: BookingModalProps) {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  if (!isOpen || !car) return null;

  const calculateTotalPrice = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to make a booking');
      return;
    }

    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          car_id: car.id,
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: calculateTotalPrice(),
          status: 'pending'
        }]);

      if (bookingError) throw bookingError;
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Book {car.make} {car.model}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              min={format(addDays(new Date(startDate), 1), 'yyyy-MM-dd')}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-lg font-semibold">
              Total Price: ${calculateTotalPrice()}
            </p>
            <p className="text-sm text-gray-600">
              ${car.price} × {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}