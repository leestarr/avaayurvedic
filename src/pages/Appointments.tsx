import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { PostgrestError } from '@supabase/supabase-js';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Hardcoded services with actual database UUIDs
const services = [
  {
    id: '6cd51290-77f3-4c5c-b2f3-ca9d1db31e4b', // Actual UUID from database
    name: 'Ayurvedic Consultation - Virtual',
    description: 'Comprehensive initial consultation to assess your dosha balance and create a personalized wellness plan.',
    duration: 60,
    price: 120
  },
  {
    id: 'f7d42728-d2ff-4ba6-8d93-ca15713e1d60', // Another consultation service from database
    name: 'Ayurvedic Consultation Follow-up - Virtual',
    description: 'Follow-up consultation to review progress and adjust your wellness plan as needed.',
    duration: 60,
    price: 150
  }
];

export default function Appointments() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        
        // Pre-fill form with user data if available
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, email, phone')
          .eq('user_id', user.id)
          .single();
          
        if (profile) {
          setFormData({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
          });
        } else {
          setFormData({
            first_name: '',
            last_name: '',
            email: user.email || '',
            phone: '',
          });
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isAuthenticated || !user) {
        throw new Error('Please log in to book an appointment');
      }

      if (!selectedService || !selectedDate || !selectedTime) {
        throw new Error('Please select a service, date, and time');
      }

      // Combine date and time into a single timestamp
      const [hours, minutes] = selectedTime.split(':');
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Create the booking
      const { error: bookingError } = await supabase.from('bookings').insert([
        {
          user_id: user.id,
          service_id: selectedService.id,
          booking_date: bookingDate.toISOString(),
          status: 'pending'
        }
      ]);

      if (bookingError) throw bookingError;

      // Update or create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile update fails, we still want to show success for the booking
        toast.error('Booking confirmed but failed to update profile information');
      } else {
        toast.success('Booking confirmed!');
      }

      navigate('/account');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof PostgrestError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to book an appointment.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border p-6 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleServiceSelect(service)}
              >
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Duration: {service.duration} minutes</span>
                  <span className="text-xl font-bold text-emerald-600">${service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date and Time Selection */}
      {step === 2 && selectedService && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Date and Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Select Date</h3>
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <h3 className="font-bold mb-2">Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                  <button
                    key={time}
                    className={`p-2 border rounded ${
                      selectedTime === time ? 'bg-blue-500 text-white' : ''
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: User Information */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">Your Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}