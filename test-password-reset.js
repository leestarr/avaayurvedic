// Test script to verify password reset functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etqxalqsopyvkvolyhnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cXhhbHFzb3B5dmt2b2x5aG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjE4NzksImV4cCI6MjA2MTIzNzg3OX0.HHJ567sKuC2DCBLEpEo0bqG89VQDhlx_bl_2wpamlSY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPasswordReset(email) {
  console.log('Testing password reset for:', email);
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5174/auth/callback/reset-password'
    });

    if (error) {
      console.error('Password reset error:', error);
    } else {
      console.log('Password reset email sent successfully!');
      console.log('Check the email for the reset link.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test with a specific email - replace with the actual email you want to test
testPasswordReset('test@example.com');

export { testPasswordReset }; 