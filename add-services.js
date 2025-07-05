// Script to add consultation services to the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etqxalqsopyvkvolyhnh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to get this from Supabase dashboard

async function addServices() {
  if (!supabaseServiceKey) {
    console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('You can find this in your Supabase dashboard under Settings > API');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const services = [
    {
      id: 'ayurvedic-consultation',
      name: 'Ayurvedic Consultation - Virtual',
      description: 'Comprehensive initial consultation to assess your dosha balance and create a personalized wellness plan.',
      duration: 60,
      price: 120
    },
    {
      id: 'ayurvedic-followup',
      name: 'Ayurvedic Consultation Follow-up - Virtual',
      description: 'Follow-up consultation to review progress and adjust your wellness plan as needed.',
      duration: 45,
      price: 80
    }
  ];

  try {
    for (const service of services) {
      const { data, error } = await supabase
        .from('services')
        .upsert(service, { onConflict: 'id' });

      if (error) {
        console.error(`Error adding service ${service.name}:`, error);
      } else {
        console.log(`✅ Added service: ${service.name}`);
      }
    }
    
    console.log('🎉 Services added successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

addServices(); 