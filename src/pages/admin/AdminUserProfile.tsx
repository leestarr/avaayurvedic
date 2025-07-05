import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { User, Calendar, Mail, Phone, MapPin, ArrowLeft, Edit2, Save, X, FileText, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  doctor_notes: string | null;
  next_steps: string | null;
  follow_up_date: string | null;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
}

export default function AdminUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingEditForm, setBookingEditForm] = useState({
    doctor_notes: '',
    next_steps: '',
    follow_up_date: ''
  });
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  async function fetchUserData() {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Failed to load user profile');
        return;
      }

      setUserProfile(profileData);
      setEditForm({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      });

      // Fetch user's bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          status,
          doctor_notes,
          next_steps,
          follow_up_date,
          service:service_id (
            id,
            name,
            duration,
            price
          )
        `)
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else {
        // Transform the data to match our Booking interface
        const transformedBookings = (bookingsData || []).map((booking: any) => ({
          id: booking.id,
          booking_date: booking.booking_date,
          status: booking.status,
          doctor_notes: booking.doctor_notes,
          next_steps: booking.next_steps,
          follow_up_date: booking.follow_up_date,
          service: booking.service ? {
            id: booking.service.id,
            name: booking.service.name,
            duration: booking.service.duration,
            price: booking.service.price
          } : null
        }));
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: editForm.first_name || null,
          last_name: editForm.last_name || null,
          email: editForm.email || null,
          phone: editForm.phone || null,
          address: editForm.address || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (userProfile) {
      setEditForm({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }
    setEditing(false);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setBookingEditForm({
      doctor_notes: booking.doctor_notes || '',
      next_steps: booking.next_steps || '',
      follow_up_date: booking.follow_up_date ? booking.follow_up_date.slice(0, 10) : ''
    });
  };

  const handleCancelEditBooking = () => {
    setEditingBookingId(null);
    setBookingEditForm({ doctor_notes: '', next_steps: '', follow_up_date: '' });
  };

  const handleSaveBookingNotes = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          doctor_notes: bookingEditForm.doctor_notes,
          next_steps: bookingEditForm.next_steps,
          follow_up_date: bookingEditForm.follow_up_date || null
        })
        .eq('id', bookingId);
      if (error) throw error;
      toast.success('Booking notes updated');
      setEditingBookingId(null);
      setBookingEditForm({ doctor_notes: '', next_steps: '', follow_up_date: '' });
      fetchUserData();
    } catch (error) {
      console.error('Error updating booking notes:', error);
      toast.error('Failed to update booking notes');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (profile: UserProfile) => {
    const firstName = profile.first_name?.trim() || '';
    const lastName = profile.last_name?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <Link to="/admin/users" className="text-emerald-600 hover:text-emerald-500">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/admin/users"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {getUserName(userProfile)}
            </h1>
            <p className="text-sm text-gray-500">User Profile & Booking History</p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {getUserName(userProfile)}
                </h2>
                <p className="text-sm text-gray-500">Member since {formatDate(userProfile.created_at)}</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{userProfile.email || 'No email'}</span>
                </div>
                {userProfile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{userProfile.phone}</span>
                  </div>
                )}
                {userProfile.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-900">{userProfile.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking History */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
              <p className="text-sm text-gray-500">{bookings.length} total bookings</p>
            </div>
            
            {bookings.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {booking.service?.name || 'Unknown Service'}
                          </h4>
                          <span
                            className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(booking.booking_date)} at {formatTime(booking.booking_date)}
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-2" />
                          {booking.service?.duration || 0} minutes
                          <span className="mx-2">•</span>
                          ${booking.service?.price || 0}
                        </div>

                        {editingBookingId === booking.id ? (
                          <div className="bg-gray-50 rounded-md p-4 mb-2">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Edit Notes & Follow-up</h5>
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Doctor's Notes</label>
                              <textarea
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                rows={2}
                                value={bookingEditForm.doctor_notes}
                                onChange={e => setBookingEditForm(f => ({ ...f, doctor_notes: e.target.value }))}
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Next Steps</label>
                              <textarea
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                rows={2}
                                value={bookingEditForm.next_steps}
                                onChange={e => setBookingEditForm(f => ({ ...f, next_steps: e.target.value }))}
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Follow-up Date</label>
                              <input
                                type="date"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                value={bookingEditForm.follow_up_date}
                                onChange={e => setBookingEditForm(f => ({ ...f, follow_up_date: e.target.value }))}
                              />
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => handleSaveBookingNotes(booking.id)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Save className="h-4 w-4 mr-1" /> Save
                              </button>
                              <button
                                onClick={handleCancelEditBooking}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <X className="h-4 w-4 mr-1" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {(booking.doctor_notes || booking.next_steps || booking.follow_up_date) && (
                              <div className="bg-gray-50 rounded-md p-4 mb-2">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Notes & Follow-up</h5>
                                {booking.doctor_notes && (
                                  <div className="mb-2">
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Doctor's Notes:
                                    </div>
                                    <p className="text-sm text-gray-700 ml-4">{booking.doctor_notes}</p>
                                  </div>
                                )}
                                {booking.next_steps && (
                                  <div className="mb-2">
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Next Steps:
                                    </div>
                                    <p className="text-sm text-gray-700 ml-4">{booking.next_steps}</p>
                                  </div>
                                )}
                                {booking.follow_up_date && (
                                  <div>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Follow-up Date:
                                    </div>
                                    <p className="text-sm text-gray-700 ml-4">{formatDate(booking.follow_up_date)}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 mt-2"
                            >
                              <Edit2 className="h-4 w-4 mr-1" /> Edit Notes
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This user hasn't made any appointments yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 