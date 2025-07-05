import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Calendar, FileText, Clock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

export default function Assessments() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user, supabase]);

  const loadBookings = async () => {
    try {
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
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false });

      if (bookingsError) {
        console.error('Bookings error:', bookingsError);
        throw bookingsError;
      }

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
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load appointment notes');
      toast.error('Failed to load appointment notes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your appointment notes.</p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointment notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadBookings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Appointment Notes</h1>
          <p className="text-lg text-gray-600">
            Review your consultation notes, next steps, and follow-up appointments
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              You haven't had any appointments yet, or no notes have been added to your appointments.
            </p>
            <a
              href="/appointments"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Book an Appointment
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.service?.name || 'Appointment'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(booking.booking_date)} at {formatTime(booking.booking_date)}
                          </span>
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
                    {booking.follow_up_date && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600">Follow-up</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.follow_up_date)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                  {/* Doctor's Notes */}
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-emerald-600 mr-2" />
                      <h4 className="text-md font-medium text-gray-900">Doctor's Notes</h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {booking.doctor_notes ? (
                        <p className="text-gray-700 whitespace-pre-wrap">{booking.doctor_notes}</p>
                      ) : (
                        <p className="text-gray-500 italic">No notes available for this appointment.</p>
                      )}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <div className="flex items-center mb-2">
                      <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                      <h4 className="text-md font-medium text-gray-900">Next Steps</h4>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                      {booking.next_steps ? (
                        <p className="text-gray-700 whitespace-pre-wrap">{booking.next_steps}</p>
                      ) : (
                        <p className="text-gray-500 italic">No next steps documented for this appointment.</p>
                      )}
                    </div>
                  </div>

                  {/* Follow-up Information */}
                  {booking.follow_up_date && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Follow-up Appointment</h4>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-700">
                          <strong>Date:</strong> {formatDate(booking.follow_up_date)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Please ensure you attend this follow-up appointment to track your progress.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need to book a new appointment?{' '}
            <a href="/appointments" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Schedule here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 