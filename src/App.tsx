import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CarCard } from './components/CarCard';
import { AuthModal } from './components/auth/AuthModal';
import { BookingModal } from './components/booking/BookingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import { Car } from './types';

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user, isAdmin, loadProfile } = useAuthStore();

  useEffect(() => {
    loadProfile();
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
    if (!user) {
      setShowAuthModal(true);
    } else {
      setSelectedCar(car);
      setShowBookingModal(true);
    }
  };

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignInClick={() => setShowAuthModal(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Available Cars</h2>
            <p className="mt-2 text-gray-600">Choose from our selection of premium vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onRent={handleRent}
              />
            ))}
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
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

export default App;