import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthModal } from './auth/AuthModal';
import { useState } from 'react';

export function Layout() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSignInClick={() => setShowAuthModal(true)} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}