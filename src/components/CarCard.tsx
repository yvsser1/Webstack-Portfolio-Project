import React from 'react';
import { Car } from '../types';
import { Users, Gauge, Calendar } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onRent: (car: Car) => void;
}

export function CarCard({ car, onRent }: CarCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={car.image} 
        alt={`${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
        <p className="text-gray-600">{car.year}</p>
        
        <div className="flex items-center gap-4 mt-3 text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={18} />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={18} />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={18} />
            <span>{car.type}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">${car.price}<span className="text-sm text-gray-600">/day</span></p>
          <button
            onClick={() => onRent(car)}
            disabled={!car.available}
            className={`px-4 py-2 rounded-md ${
              car.available
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {car.available ? 'Rent Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
}