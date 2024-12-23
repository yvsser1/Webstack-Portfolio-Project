/*
  # Fix recursive RLS policies

  1. Changes
    - Simplify profile policies to avoid recursion
    - Update cars and bookings policies to use direct admin check
    - Add admin check function for reusability

  2. Security
    - Maintain same security rules but with better implementation
    - Prevent infinite recursion
*/

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT is_admin FROM profiles WHERE id = user_id;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create new profile policies
CREATE POLICY "Profiles are viewable by owner and admins"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    is_admin(auth.uid())
  );

CREATE POLICY "Profiles are updatable by owner"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update cars policies
DROP POLICY IF EXISTS "Only admins can modify cars" ON cars;

CREATE POLICY "Admins can modify cars"
  ON cars FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Update bookings policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;

CREATE POLICY "Bookings are viewable by owner and admins"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    is_admin(auth.uid())
  );