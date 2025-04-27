import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Calendar, Package, LogOut, Edit2, X, Check, Leaf } from 'lucide-react';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  dosha_type: string | null;
}

interface DoshaQuizResult {
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  primary_dosha: string;
  secondary_dosha: string | null;
  quiz_answers: Record<string, string>;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Booking {
  id: string;
  service_id: string;
  booking_date: string;
  status: string;
  service: Service;
}

interface Product {
  name: string;
  price: number;
}

interface Purchase {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
  products: Product;
}

interface SupabaseBooking {
  id: string;
  service_id: string;
  booking_date: string;
  status: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
}

export default function Account() {
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [doshaResults, setDoshaResults] = useState<DoshaQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const supabase = useSupabaseClient();

  useEffect(() => {
    loadUserData();
  }, [supabase, user]);

  async function loadUserData() {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, user_id, first_name, last_name, phone, email, address, dosha_type')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile doesn't exist, we'll create one
        if (profileError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: user.id,
                email: user.email,
              }
            ])
            .select()
            .single();
          if (createError) throw createError;
        } else {
          throw profileError;
        }
      } else {
        setProfile(profileData);
      }

      // Get dosha quiz results
      const { data: doshaData, error: doshaError } = await supabase
        .from('dosha_quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (doshaError) {
        if (doshaError.code !== 'PGRST116') { // Not found error
          console.error('Dosha quiz error:', doshaError);
        }
      } else {
        setDoshaResults(doshaData);
      }

      // Get bookings with service details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          booking_date,
          status,
          service:service_id (
            id,
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true });

      if (bookingsError) {
        console.error('Bookings error:', bookingsError);
        throw bookingsError;
      }
      
      // Transform bookings data to match the Booking type
      const transformedBookings = (bookingsData || []).map(rawBooking => {
        // Type assertion for the raw booking data
        const booking = rawBooking as unknown as SupabaseBooking;
        
        const serviceData = booking.service && {
          id: booking.service.id,
          name: booking.service.name,
          duration: booking.service.duration,
          price: booking.service.price
        };

        return {
          id: booking.id,
          service_id: booking.service_id,
          booking_date: booking.booking_date,
          status: booking.status,
          service: serviceData || {
            id: booking.service_id,
            name: 'Service Unavailable',
            duration: 0,
            price: 0
          }
        } as Booking;
      });
      setBookings(transformedBookings);

      // Get purchases with product details
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          id,
          product_id,
          quantity,
          total_price,
          created_at,
          products (
            name,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (purchasesError) {
        console.error('Purchases error:', purchasesError);
        throw purchasesError;
      }

      // Transform purchases data to match the Purchase type
      const transformedPurchases = (purchasesData || []).map(purchase => ({
        ...purchase,
        products: purchase.products[0] || null
      }));
      setPurchases(transformedPurchases);

    } catch (error) {
      console.error('Error loading user data:', error);
      const errorMessage = error instanceof PostgrestError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Failed to load user data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking.id);
    const date = new Date(booking.booking_date);
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  const handleSaveBooking = async (booking: Booking) => {
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          booking_date: bookingDate.toISOString(),
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      toast.success('Booking updated successfully');
      setEditingBooking(null);
      loadUserData();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error: cancelError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (cancelError) throw cancelError;

      toast.success('Booking cancelled successfully');
      loadUserData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">Please sign in to view your account.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const isBookingEditable = (booking: Booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    return bookingDate > now && booking.status === 'pending';
  };

  const isBookingCancellable = (booking: Booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    return bookingDate > now && booking.status !== 'cancelled';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Profile Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                  </div>
                  {profile && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-sm text-gray-900">
                          {profile.first_name} {profile.last_name}
                        </div>
                      </div>
                      {profile.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <div className="mt-1 text-sm text-gray-900">{profile.phone}</div>
                        </div>
                      )}
                      {profile.address && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          <div className="mt-1 text-sm text-gray-900">{profile.address}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Dosha Quiz Results */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  Your Dosha Profile
                </h3>
                <div className="mt-4">
                  {!doshaResults ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-4">You haven't taken the dosha quiz yet</p>
                      <a 
                        href="/dosha-quiz" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Take the Quiz
                      </a>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-emerald-900">
                            Primary Dosha: {doshaResults.primary_dosha.charAt(0).toUpperCase() + doshaResults.primary_dosha.slice(1)}
                          </h4>
                          {doshaResults.secondary_dosha && (
                            <p className="text-sm text-emerald-700 mt-1">
                              Secondary Dosha: {doshaResults.secondary_dosha.charAt(0).toUpperCase() + doshaResults.secondary_dosha.slice(1)}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-emerald-600">
                          {new Date(doshaResults.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="text-sm font-medium text-emerald-800">Vata</div>
                          <div className="mt-1 relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                              <div
                                style={{ width: `${doshaResults.vata_score}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                              ></div>
                            </div>
                            <div className="text-xs text-emerald-600 mt-1">{doshaResults.vata_score}%</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-emerald-800">Pitta</div>
                          <div className="mt-1 relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                              <div
                                style={{ width: `${doshaResults.pitta_score}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                              ></div>
                            </div>
                            <div className="text-xs text-emerald-600 mt-1">{doshaResults.pitta_score}%</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-emerald-800">Kapha</div>
                          <div className="mt-1 relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                              <div
                                style={{ width: `${doshaResults.kapha_score}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                              ></div>
                            </div>
                            <div className="text-xs text-emerald-600 mt-1">{doshaResults.kapha_score}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <a 
                          href="/dosha-quiz" 
                          className="text-sm text-emerald-600 hover:text-emerald-500"
                        >
                          Retake Quiz
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bookings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Your Bookings
                </h3>
                <div className="mt-4">
                  {bookings.length === 0 ? (
                    <p className="text-sm text-gray-500">No bookings found</p>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{booking.service?.name || 'Unknown Service'}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Price: ${booking.service?.price || 0}
                              </p>
                              <p className="text-sm text-gray-500">
                                Duration: {booking.service?.duration || 0} minutes
                              </p>
                              {editingBooking === booking.id ? (
                                <div className="mt-2 space-y-2">
                                  <input
                                    type="date"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                  <select
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                  >
                                    {['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                                      <option key={time} value={time}>{time}</option>
                                    ))}
                                  </select>
                                  <div className="flex space-x-2 mt-2">
                                    <button
                                      onClick={() => handleSaveBooking(booking)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingBooking(null)}
                                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.booking_date).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {isBookingEditable(booking) && !editingBooking && (
                                <button
                                  onClick={() => handleEditBooking(booking)}
                                  className="inline-flex items-center p-1 border border-transparent rounded-md text-blue-600 hover:bg-blue-50"
                                  title="Edit booking"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                              )}
                              {isBookingCancellable(booking) && !editingBooking && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="inline-flex items-center p-1 border border-transparent rounded-md text-red-600 hover:bg-red-50"
                                  title="Cancel booking"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchases */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Your Purchases
                </h3>
                <div className="mt-4">
                  {purchases.length === 0 ? (
                    <p className="text-sm text-gray-500">No purchases found</p>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="border rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{purchase.products?.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(purchase.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${purchase.total_price}</p>
                              <p className="text-sm text-gray-500">Qty: {purchase.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 