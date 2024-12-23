import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Car } from '../../types';
import { CarForm } from './CarForm';
import { BookingsList } from './BookingsList';

export function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    const { data } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setCars(data);
  };

  const handleCarDelete = async (id: string) => {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setCars(cars.filter(car => car.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowBookings(!showBookings)}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            {showBookings ? 'Show Cars' : 'Show Bookings'}
          </button>
          {!showBookings && (
            <button
              onClick={() => setIsAddingCar(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Add New Car
            </button>
          )}
        </div>
      </div>

      {isAddingCar && (
        <CarForm
          onClose={() => setIsAddingCar(false)}
          onSave={() => {
            setIsAddingCar(false);
            loadCars();
          }}
        />
      )}

      {showBookings ? (
        <BookingsList />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.make} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{car.type}</div>
                    <div className="text-sm text-gray-500">
                      {car.seats} seats • {car.transmission}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${car.price}/day
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      car.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {car.available ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCarDelete(car.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}