import React, { useEffect, useState, useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  booking_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  services?: { name: string };
  user_profiles?: { first_name: string; last_name: string; email: string };
}

const AdminCalendar: React.FC = () => {
  const supabase = useSupabaseClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(name), user_profiles(first_name, last_name, email)');
    if (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
      return;
    }
    setBookings(data || []);
    setLoading(false);
  };

  // Map bookings to calendar events
  const events = useMemo(() =>
    bookings.map((b) => ({
      id: b.id,
      title: `${b.services?.name || 'Service'} with ${b.user_profiles?.first_name || ''} ${b.user_profiles?.last_name || ''}`.trim(),
      start: new Date(b.booking_date),
      end: new Date(moment(b.booking_date).add(1, 'hour').toISOString()), // Default 1 hour
      resource: b,
      status: b.status,
    })),
    [bookings]
  );

  const eventStyleGetter = (event: { status: string }) => {
    let backgroundColor = '#10B981'; // emerald
    if (event.status === 'pending') backgroundColor = '#F59E0B'; // amber
    if (event.status === 'cancelled') backgroundColor = '#EF4444'; // red
    if (event.status === 'confirmed') backgroundColor = '#3B82F6'; // blue
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Bookings Calendar</h1>
        <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">
          View all bookings and appointments in a calendar view. (User calendar sync coming soon!)
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-2 lg:p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="h-[500px] lg:h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              eventPropGetter={eventStyleGetter}
              popup
              tooltipAccessor={(event: { title: string }) => event.title}
              components={{
                event: ({ event }: { event: { title: string; status: string } }) => (
                  <div className="text-xs lg:text-sm">
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-xs opacity-90">{event.status}</div>
                  </div>
                ),
              }}
              messages={{
                next: "Next",
                previous: "Previous",
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                noEventsInRange: "No events in this range.",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCalendar; 