import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the same client as admin for now
export const supabaseAdmin = supabase;

export const checkIsAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return !!data;
};