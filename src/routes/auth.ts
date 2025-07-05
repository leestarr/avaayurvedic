import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { AsyncRequestHandler } from '../types/express';
import { SignupRequest, LoginRequest } from '../types/requests';

const router = Router();

// User signup
router.post('/signup', (async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, phone, address } = req.body as SignupRequest;

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Update the user profile with additional information
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name,
          last_name,
          phone,
          address,
          updated_at: new Date()
        })
        .eq('user_id', authData.user.id);

      if (profileError) throw profileError;
    }

    res.json({
      message: 'Signup successful',
      user: authData.user
    });
  } catch (error) {
    next(error);
  }
}) as AsyncRequestHandler);

// User login
router.post('/login', (async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginRequest;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      message: 'Login successful',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}) as AsyncRequestHandler);

// User logout
router.post('/logout', (async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}) as AsyncRequestHandler);

// Get current user
router.get('/me', (async (req, res, next) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    res.json({
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
}) as AsyncRequestHandler);

export default router; 