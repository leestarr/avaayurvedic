// Temporary script to reset a user's password
// Run this with: node reset-user-password.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://etqxalqsopyvkvolyhnh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to get this from Supabase dashboard

async function resetUserPassword(email, newPassword) {
  if (!supabaseServiceKey) {
    console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('You can find this in your Supabase dashboard under Settings > API');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Update the user's password
    const { data, error } = await supabase.auth.admin.updateUserById(
      email, // This should be the user's ID, but we can also use email
      { password: newPassword }
    );

    if (error) {
      console.error('Error resetting password:', error);
    } else {
      console.log('Password reset successfully for user:', email);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Usage example:
// resetUserPassword('user@example.com', 'newpassword123');

module.exports = { resetUserPassword }; 