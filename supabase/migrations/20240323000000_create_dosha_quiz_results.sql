-- Create dosha quiz results table
CREATE TABLE IF NOT EXISTS dosha_quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vata_score INTEGER NOT NULL,
    pitta_score INTEGER NOT NULL,
    kapha_score INTEGER NOT NULL,
    primary_dosha TEXT NOT NULL,
    secondary_dosha TEXT,
    quiz_answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE dosha_quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dosha quiz results"
    ON dosha_quiz_results
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dosha quiz results"
    ON dosha_quiz_results
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dosha quiz results"
    ON dosha_quiz_results
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add dosha_type to user_profiles table if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS dosha_type TEXT; 