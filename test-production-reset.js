// Test script to verify production password reset functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etqxalqsopyvkvolyhnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cXhhbHFzb3B5dmt2b2x5aG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjE4NzksImV4cCI6MjA2MTIzNzg3OX0.HHJ567sKuC2DCBLEpEo0bqG89VQDhlx_bl_2wpamlSY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProductionPasswordReset(email) {
  console.log('Testing PRODUCTION password reset for:', email);
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://avaayurvedic.netlify.app/auth/callback/reset-password'
    });

    if (error) {
      console.error('Password reset error:', error);
    } else {
      console.log('✅ Production password reset email sent successfully!');
      console.log('📧 Check the email for the reset link.');
      console.log('🔗 The link should be: https://avaayurvedic.netlify.app/auth/callback/reset-password#...');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test with a real email address - replace with the actual email you want to test
testProductionPasswordReset('test@example.com');

console.log('Production password reset test ready.');
console.log('To test, uncomment the last line and replace with a real email address.'); 