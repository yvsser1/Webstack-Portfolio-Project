import React, { useState, useEffect } from 'react';
import { CarCard } from '../components/CarCard';
import { BookingModal } from '../components/booking/BookingModal';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Car } from '../types';
import { Search, MapPin, Calendar } from 'lucide-react';

export function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user } = useAuthStore();

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

  const handleRent = (car: Car) => {
    if (!user) return;
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-gray-900">
                Find, book and rent a car <span className="text-blue-600">Easily</span>
              </h1>
              <p className="text-lg text-gray-600">
                Get a car whenever and wherever you need it with your iOS and Android devices.
              </p>
              
              {/* Search Form */}
              <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 border-b-2 pb-2">
                    <MapPin className="text-blue-600" />
                    <input 
                      type="text" 
                      placeholder="Location"
                      className="w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2 border-b-2 pb-2">
                    <Calendar className="text-blue-600" />
                    <input 
                      type="date" 
                      className="w-full focus:outline-none"
                    />
                  </div>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399"
                alt="Luxury car"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Rent with following 3 working steps</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📍',
              title: 'Choose location',
              description: 'Choose your rental location and find your car'
            },
            {
              icon: '📅',
              title: 'Pick-up date',
              description: 'Select your pick-up dates and book your car'
            },
            {
              icon: '🚗',
              title: 'Book your car',
              description: 'Book your car and we will deliver it directly to you'
            }
          ].map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-4xl">{step.icon}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="cars">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Most popular cars rental deals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car} 
              onRent={handleRent}
            />
          ))}
        </div>
      </section>

      <BookingModal
        car={selectedCar}
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedCar(null);
        }}
      />
    </div>
  );
}