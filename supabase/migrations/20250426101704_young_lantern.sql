/*
  # Admin System Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `is_super_admin` (boolean)
      - `created_at` (timestamp)
    - `appointment_slots`
      - `id` (uuid, primary key)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `service_id` (uuid, references services)
      - `is_available` (boolean)
      - `created_at` (timestamp)
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `vata_score` (integer)
      - `pitta_score` (integer)
      - `kapha_score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create appointment_slots table
CREATE TABLE IF NOT EXISTS appointment_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  service_id uuid REFERENCES services(id),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  vata_score integer NOT NULL,
  pitta_score integer NOT NULL,
  kapha_score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL,
  dosha_balancing text[] NOT NULL,
  benefits text[],
  ingredients text[],
  usage_instructions text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Admin users can read all admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
  ));

CREATE POLICY "Admin users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
  ));

CREATE POLICY "Admin users can manage appointment slots"
  ON appointment_slots
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
  ));

CREATE POLICY "Admin users can read quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
  ));

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;