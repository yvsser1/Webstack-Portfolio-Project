import { Car } from '../types';

export const cars: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 150,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    type: 'Luxury',
    seats: 5,
    transmission: 'Automatic',
    available: true
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    price: 120,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    type: 'SUV',
    seats: 7,
    transmission: 'Automatic',
    available: true
  },
  {
    id: '3',
    make: 'Porsche',
    model: '911',
    year: 2023,
    price: 200,
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333',
    type: 'Sports',
    seats: 2,
    transmission: 'Automatic',
    available: true
  }
];