/*
  # Initial Schema Setup for Car Rental Application

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text)
      - is_admin (boolean)
      - created_at (timestamp)
    - cars
      - id (uuid)
      - make (text)
      - model (text)
      - year (integer)
      - price (numeric)
      - image (text)
      - type (text)
      - seats (integer)
      - transmission (text)
      - available (boolean)
      - created_at (timestamp)
    - bookings
      - id (uuid)
      - car_id (uuid, references cars)
      - user_id (uuid, references auth.users)
      - start_date (timestamp)
      - end_date (timestamp)
      - total_price (numeric)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  username text UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cars table
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  type text NOT NULL,
  seats integer NOT NULL,
  transmission text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Cars policies
CREATE POLICY "Anyone can view cars"
  ON cars FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can modify cars"
  ON cars FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = user_id AND status = 'pending') OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION check_car_availability(
  p_car_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE car_id = p_car_id
    AND status != 'cancelled'
    AND (
      (start_date, end_date) OVERLAPS (p_start_date, p_end_date)
    )
  );
END;
$$;