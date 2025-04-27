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
  name: string;
  email: string;
  phone: string;
}

export default function Appointments() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    }
  };

  const handleServiceSelect = (service: Service) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to book an appointment');
      }

      if (!selectedService || !selectedDate || !selectedTime) {
        throw new Error('Please select a service, date, and time');
      }

      // First, check if user profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        throw profileCheckError;
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
          first_name: formData.name.split(' ')[0],
          last_name: formData.name.split(' ').slice(1).join(' '),
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

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleServiceSelect(service)}
              >
                <h3 className="font-bold">{service.name}</h3>
                <p>{service.description}</p>
                <p>Duration: {service.duration} minutes</p>
                <p>Price: ${service.price}</p>
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
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder="John Doe"
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