-- Create ayurvedic_assessments table
CREATE TABLE IF NOT EXISTS ayurvedic_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    body_part TEXT NOT NULL,
    image_url TEXT NOT NULL,
    analysis TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS ayurvedic_assessments_user_id_idx ON ayurvedic_assessments(user_id);

-- Create RLS policies
ALTER TABLE ayurvedic_assessments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own assessments
CREATE POLICY "Users can view their own assessments"
    ON ayurvedic_assessments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to insert their own assessments
CREATE POLICY "Users can insert their own assessments"
    ON ayurvedic_assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own assessments
CREATE POLICY "Users can update their own assessments"
    ON ayurvedic_assessments
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for users to delete their own assessments
CREATE POLICY "Users can delete their own assessments"
    ON ayurvedic_assessments
    FOR DELETE
    USING (auth.uid() = user_id); 