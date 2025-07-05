import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Calendar, User, Edit2, Save, X, Clock, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  doctor_notes: string | null;
  next_steps: string | null;
  follow_up_date: string | null;
  user_profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
}

export default function AdminAppointments() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    doctor_notes: '',
    next_steps: '',
    follow_up_date: ''
  });
  const [saving, setSaving] = useState(false);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  async function fetchBookings() {
    try {
      // Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`id, booking_date, status, doctor_notes, next_steps, follow_up_date, user_id, service_id`)
        .order('booking_date', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast.error('Failed to load appointments');
        return;
      }

      // Get unique user IDs and service IDs
      const userIds = [...new Set((bookingsData || []).map(b => b.user_id))];
      const serviceIds = [...new Set((bookingsData || []).map(b => b.service_id))];

      // Debug: Log userIds and bookingsData
      console.log('AdminAppointments DEBUG - userIds:', userIds);
      console.log('AdminAppointments DEBUG - bookingsData:', bookingsData);

      // Fetch user profiles - try a different approach
      let userProfilesData = null;
      let userProfilesError = null;
      
      if (userIds.length > 0) {
        // Try fetching all user profiles and filter in JS
        const { data, error } = await supabase
          .from('user_profiles')
          .select('user_id, first_name, last_name, email');
        
        if (error) {
          userProfilesError = error;
          console.error('Error fetching user profiles:', error);
        } else {
          // Filter to only include profiles for users who have bookings
          userProfilesData = data?.filter(profile => userIds.includes(profile.user_id)) || [];
        }
      }

      // Debug: Log userProfilesData
      console.log('AdminAppointments DEBUG - userProfilesData:', userProfilesData);

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, duration, price')
        .in('id', serviceIds);

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
      }

      // Create lookup maps
      const userProfilesMap = new Map();
      (userProfilesData || []).forEach(profile => {
        userProfilesMap.set(profile.user_id, profile);
      });

      const servicesMap = new Map();
      (servicesData || []).forEach(service => {
        servicesMap.set(service.id, service);
      });

      // Debug: Log the maps and matching
      console.log('AdminAppointments DEBUG - userProfilesMap:', userProfilesMap);
      console.log('AdminAppointments DEBUG - servicesMap:', servicesMap);

      // Transform the data to match our Booking interface
      const transformedBookings = (bookingsData || []).map((booking: any) => {
        const userProfile = userProfilesMap.get(booking.user_id);
        const service = servicesMap.get(booking.service_id);
        
        // Debug: Log each booking's user profile match
        console.log(`AdminAppointments DEBUG - Booking ${booking.id}:`, {
          booking_user_id: booking.user_id,
          found_user_profile: userProfile,
          first_name: userProfile?.first_name,
          last_name: userProfile?.last_name,
          email: userProfile?.email
        });
        
        return {
          id: booking.id,
          booking_date: booking.booking_date,
          status: booking.status,
          doctor_notes: booking.doctor_notes,
          next_steps: booking.next_steps,
          follow_up_date: booking.follow_up_date,
          user_profiles: userProfile || null,
          service: service || null
        };
      });

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking.id);
    setEditForm({
      doctor_notes: booking.doctor_notes || '',
      next_steps: booking.next_steps || '',
      follow_up_date: booking.follow_up_date ? new Date(booking.follow_up_date).toISOString().split('T')[0] : ''
    });
  };

  const handleSaveBooking = async (bookingId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          doctor_notes: editForm.doctor_notes || null,
          next_steps: editForm.next_steps || null,
          follow_up_date: editForm.follow_up_date || null
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Appointment notes updated successfully');
      setEditingBooking(null);
      fetchBookings(); // Refresh the data
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update appointment notes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditForm({
      doctor_notes: '',
      next_steps: '',
      follow_up_date: ''
    });
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

  const getClientName = (booking: Booking) => {
    if (booking.user_profiles) {
      const firstName = booking.user_profiles.first_name?.trim() || '';
      const lastName = booking.user_profiles.last_name?.trim() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
      if (booking.user_profiles.email) return booking.user_profiles.email;
    }
    return 'Unknown';
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments Management</h1>
        <div className="text-sm text-gray-500">
          Manage doctor's notes, next steps, and follow-up appointments
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(booking.user_profiles?.first_name || booking.user_profiles?.last_name) ? 
                        `${booking.user_profiles.first_name || ''} ${booking.user_profiles.last_name || ''}`.trim() : 
                        'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {booking.user_profiles?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.service?.name || 'Unknown Service'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${booking.service?.price || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.booking_date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(booking.booking_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center min-h-[32px] space-x-2">
                      {booking.doctor_notes && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FileText className="h-3 w-3 mr-1" />
                          Notes
                        </span>
                      )}
                      {booking.next_steps && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Next Steps
                        </span>
                      )}
                      {booking.follow_up_date && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Follow-up
                        </span>
                      )}
                      {!booking.doctor_notes && !booking.next_steps && !booking.follow_up_date && (
                        <span className="text-xs text-gray-500">No notes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingBooking === booking.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveBooking(booking.id)}
                          disabled={saving}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit Notes
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Appointment Notes</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor's Notes
                    </label>
                    <textarea
                      value={editForm.doctor_notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, doctor_notes: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter doctor's notes from the consultation..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Steps
                    </label>
                    <textarea
                      value={editForm.next_steps}
                      onChange={(e) => setEditForm(prev => ({ ...prev, next_steps: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter recommended next steps..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={editForm.follow_up_date}
                      onChange={(e) => setEditForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveBooking(editingBooking)}
                    disabled={saving}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 