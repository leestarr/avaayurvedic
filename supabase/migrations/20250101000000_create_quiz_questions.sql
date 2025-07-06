-- Create quiz_questions table for admin management
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  vata_option TEXT NOT NULL,
  pitta_option TEXT NOT NULL,
  kapha_option TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS quiz_questions_order_idx ON quiz_questions(question_order);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Admin users can manage quiz questions"
  ON quiz_questions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid()
  ));

-- Insert default questions from the existing quiz
INSERT INTO quiz_questions (question, vata_option, pitta_option, kapha_option, question_order) VALUES
('What is your body frame like?', 'I am thin and my bones are prominent. I find it difficult to gain weight.', 'I have a medium build with moderate muscle development.', 'I have a solid, heavy build and tend to gain weight easily.', 1),
('How is your skin typically?', 'My skin is dry, thin, or rough. It tends to crack easily.', 'My skin is warm, fair or reddish, with freckles or acne. It''s sensitive to the sun.', 'My skin is thick, oily, cool, and smooth with good hydration.', 2),
('How would you describe your hair?', 'My hair is dry, frizzy, or brittle and breaks easily.', 'My hair is fine, light, or prematurely gray/balding. It can be oily.', 'My hair is thick, heavy, wavy, and oily. It tends to be very lustrous.', 3),
('How would you describe your appetite?', 'Variable and irregular. I can forget to eat or skip meals.', 'Strong and predictable. I get irritable if I miss meals.', 'Steady but can be slow. I can easily skip meals without much discomfort.', 4),
('How would you describe your digestion?', 'Irregular with bloating and gas. I can experience constipation.', 'Quick and efficient, but I may experience heartburn or acid reflux.', 'Slow but steady. I may feel heavy after eating.', 5),
('How do you generally respond to weather?', 'I dislike cold, windy weather and prefer warmth.', 'I dislike hot weather and prefer cool environments.', 'I dislike cold, damp weather but can tolerate other conditions well.', 6),
('How would you describe your sleep patterns?', 'Light and interrupted. I may have trouble falling asleep.', 'Moderate and regular, but I can wake up if too hot.', 'Deep and long. I may find it difficult to wake up in the morning.', 7),
('How would you describe your natural energy level throughout the day?', 'Variable with bursts of energy followed by fatigue.', 'Strong and purposeful. I''m goal-oriented with good endurance.', 'Steady and sustained, but it takes me time to get going.', 8),
('How do you typically respond to stress?', 'I get anxious, worried, or overwhelmed easily.', 'I become irritable, angry, or overly critical.', 'I withdraw or become stubborn, preferring to avoid conflict.', 9),
('How would you describe your temperament?', 'Creative, enthusiastic, and quick, but I can be indecisive.', 'Focused, intelligent, and decisive, but I can be judgmental.', 'Calm, steady, and compassionate, but I can be resistant to change.', 10),
('How is your memory?', 'I learn quickly but forget quickly too.', 'I have a sharp, focused memory for details that matter to me.', 'I learn slowly but retain information for a long time once learned.', 11),
('How do you manage finances?', 'Impulsive spending, often on multiple small purchases.', 'Strategic spending on quality items, good at saving for goals.', 'Cautious spender who saves consistently and dislikes financial risk.', 12),
('How do you approach physical activity?', 'I enjoy light activities like walking, dancing, or yoga.', 'I enjoy challenging sports and competitive activities.', 'I prefer gentle, steady exercise and need motivation to start.', 13),
('How would you describe your communication style?', 'Fast-paced, enthusiastic, sometimes jumping between topics.', 'Direct, clear, and persuasive, sometimes confrontational.', 'Thoughtful, supportive, and methodical, sometimes reserved.', 14),
('What describes your work style best?', 'Multi-tasker who enjoys variety and creativity but may leave tasks unfinished.', 'Focused and efficient, goal-oriented with leadership qualities.', 'Methodical, reliable, and patient, preferring routine and stability.', 15);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 