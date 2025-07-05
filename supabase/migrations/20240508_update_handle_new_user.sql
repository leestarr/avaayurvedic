-- Update handle_new_user trigger to insert first_name and last_name if available
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE((new.raw_user_meta_data->>'first_name'), NULL),
    COALESCE((new.raw_user_meta_data->>'last_name'), NULL)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- No need to recreate the trigger, just replace the function 