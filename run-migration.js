// Script to run the migration directly using Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etqxalqsopyvkvolyhnh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
  if (!supabaseServiceKey) {
    console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('You can find this in your Supabase dashboard under Settings > API');
    console.log('Run: export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('Running migration: Adding doctor_notes, next_steps, and follow_up_date to bookings table...');
    
    // Run the migration SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS doctor_notes text;
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS next_steps text;
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS follow_up_date date;
      `
    });

    if (error) {
      console.error('Migration failed:', error);
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('Added columns: doctor_notes, next_steps, follow_up_date');
    }
  } catch (err) {
    console.error('Error running migration:', err);
  }
}

runMigration(); 