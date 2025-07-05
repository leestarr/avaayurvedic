-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial services
INSERT INTO services (name, description, duration, price) VALUES
  ('Ayurvedic Consultation', 'A comprehensive assessment of your constitution and personalized health recommendations.', 60, 120.00),
  ('Dosha Balancing Massage', 'A therapeutic massage using dosha-specific oils to restore balance and promote wellbeing.', 90, 150.00),
  ('Shirodhara Treatment', 'A deeply relaxing treatment where warm oil is poured in a continuous stream on the forehead.', 45, 95.00),
  ('Ayurvedic Skincare Facial', 'A customized facial using Ayurvedic herbs and oils suited to your skin type and dosha.', 60, 110.00),
  ('Panchakarma Consultation', 'Initial consultation for Panchakarma detoxification program.', 60, 150.00),
  ('Abhyanga Massage', 'Traditional Ayurvedic full-body massage with warm herbal oils.', 60, 130.00);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for services
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 