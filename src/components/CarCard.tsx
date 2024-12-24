import React from 'react';
import { Car } from '../types';
import { Users, Gauge, Calendar } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onRent: (car: Car) => void;
}

export function CarCard({ car, onRent }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={car.image} 
        alt={`${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
            <p className="text-sm text-gray-500">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">${car.price}</p>
            <p className="text-sm text-gray-500">/day</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={16} />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{car.type}</span>
          </div>
        </div>
        
        <button
          onClick={() => onRent(car)}
          disabled={!car.available}
          className={`w-full py-2 px-4 rounded-lg text-center ${
            car.available
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } transition-colors`}
        >
          {car.available ? 'Rent Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
}