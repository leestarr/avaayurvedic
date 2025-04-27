import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateUser } from '../middleware/auth';
import { PostgrestError } from '@supabase/supabase-js';
import { AsyncRequestHandler } from '../types/express';

const router = Router();

// Get user profile
router.get('/profile', authenticateUser, (async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user?.id)
      .single();

    if (error) throw error;
    res.json(profile);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Update user profile
router.put('/profile', authenticateUser, (async (req, res, next) => {
  try {
    const { first_name, last_name, phone, address } = req.body;
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ first_name, last_name, phone, address, updated_at: new Date() })
      .eq('user_id', req.user?.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Get user bookings
router.get('/bookings', authenticateUser, (async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services:service_id (*)
      `)
      .eq('user_id', req.user?.id)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Get user cart
router.get('/cart', authenticateUser, (async (req, res, next) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('user_id', req.user?.id);

    if (error) throw error;
    res.json(cartItems);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Add item to cart
router.post('/cart', authenticateUser, (async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: req.user?.id,
        product_id,
        quantity,
        updated_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Remove item from cart
router.delete('/cart/:productId', authenticateUser, (async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user?.id)
      .eq('product_id', req.params.productId);

    if (error) throw error;
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Get dosha quiz results
router.get('/dosha-quiz', authenticateUser, (async (req, res, next) => {
  try {
    const { data: results, error } = await supabase
      .from('dosha_quiz_results')
      .select('*')
      .eq('user_id', req.user?.id)
      .single();

    if (error) throw error;
    res.json(results);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

// Submit dosha quiz results
router.post('/dosha-quiz', authenticateUser, (async (req, res, next) => {
  try {
    const { vata_score, pitta_score, kapha_score, primary_dosha, secondary_dosha, quiz_answers } = req.body;
    const { data, error } = await supabase
      .from('dosha_quiz_results')
      .upsert({
        user_id: req.user?.id,
        vata_score,
        pitta_score,
        kapha_score,
        primary_dosha,
        secondary_dosha,
        quiz_answers,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error as PostgrestError);
  }
}) as AsyncRequestHandler);

export default router; 