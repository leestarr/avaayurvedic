import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;
let supabaseAdmin: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Some features may not work properly.');
  // Create a dummy client that will throw errors when used
  const dummyClient = {
    auth: {
      getUser: async () => { throw new Error('Supabase not configured'); },
      signIn: async () => { throw new Error('Supabase not configured'); },
      signOut: async () => { throw new Error('Supabase not configured'); },
    },
    from: () => { throw new Error('Supabase not configured'); },
  };
  
  supabase = dummyClient;
  supabaseAdmin = dummyClient;
} else {
  // Create regular client for normal operations
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  supabaseAdmin = supabase;
}

export { supabase, supabaseAdmin };

export const checkIsAdmin = async (): Promise<boolean> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured, admin check will return false');
    return false;
  }

  try {
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
  } catch (error) {
    console.warn('Supabase not available, admin check failed:', error);
    return false;
  }
};