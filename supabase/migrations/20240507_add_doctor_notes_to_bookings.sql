-- Add doctor_notes, next_steps, and follow_up_date to bookings
ALTER TABLE bookings ADD COLUMN doctor_notes text;
ALTER TABLE bookings ADD COLUMN next_steps text;
ALTER TABLE bookings ADD COLUMN follow_up_date date; 