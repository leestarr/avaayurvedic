-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow service role to insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow service role to update admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow service role to delete admin users" ON admin_users;

-- Create a single policy that allows the service role to perform all operations
CREATE POLICY "Allow service role full access" ON admin_users
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Grant necessary permissions to the service role
GRANT ALL ON admin_users TO service_role; 