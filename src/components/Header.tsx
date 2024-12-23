import React from 'react';
import { Car } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface HeaderProps {
  onSignInClick: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
  const { user, signOut } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CarRental</h1>
          </div>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <button 
                  onClick={() => signOut()} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={onSignInClick}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}