export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  type: 'SUV' | 'Sedan' | 'Sports' | 'Luxury';
  seats: number;
  transmission: 'Automatic' | 'Manual';
  available: boolean;
}

export interface Profile {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';