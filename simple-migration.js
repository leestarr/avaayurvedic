console.log(`
🚀 MIGRATION INSTRUCTIONS
========================

Since we can't install the Supabase CLI automatically, please run this migration manually:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: etqxalqsopyvkvolyhnh
3. Go to "SQL Editor" in the left sidebar
4. Copy and paste this SQL:

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS doctor_notes text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS next_steps text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS follow_up_date date;

5. Click "Run" to execute the migration

✅ After running this, let me know and I'll update the Assessments page!
`); 