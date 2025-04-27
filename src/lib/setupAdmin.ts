import { supabase } from './supabase';

export async function setupAdminUser() {
  try {
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError) {
      console.log('Not authenticated');
      return false;
    }

    if (!user) {
      console.log('No user found');
      return false;
    }

    // Simple check if user is admin
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in setupAdminUser:', error);
    return false;
  }
} 