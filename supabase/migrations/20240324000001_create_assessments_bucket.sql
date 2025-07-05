-- Create the assessments bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessments', 'assessments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the assessments bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'assessments');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assessments'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assessments'
  AND auth.uid() = owner
);

CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assessments'
  AND auth.uid() = owner
); 