import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { CartProvider } from './context/CartContext';
import AdminInitializer from './components/AdminInitializer';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const [supabaseClient] = React.useState(() => createClient(supabaseUrl, supabaseAnonKey));

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <CartProvider>
        <AdminInitializer />
        <RouterProvider router={router} />
      </CartProvider>
    </SessionContextProvider>
  );
}

export default App;