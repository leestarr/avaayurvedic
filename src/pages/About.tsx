import React from 'react';
import { MapPin, Mail, Phone, Leaf, Check } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Our Ayurvedic Journey
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed">
              Dedicated to bringing ancient Ayurvedic wisdom to modern wellness practices
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="lg:flex items-center gap-12">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <img
                  src="https://images.pexels.com/photos/5699431/pexels-photo-5699431.jpeg"
                  alt="Avaayurvedic botanicals"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Founded in 2015 by Dr. Meera Sharma, Avaayurvedic began as a small Ayurvedic clinic dedicated 
                  to holistic healing based on the ancient principles of Ayurveda. Dr. Sharma's vision was to bridge 
                  the gap between traditional Ayurvedic practices and modern wellness needs.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Over the years, we've grown into a comprehensive wellness center offering consultations, 
                  treatments, and carefully formulated products. Our team of certified Ayurvedic practitioners 
                  combines centuries-old wisdom with contemporary research to provide personalized solutions for 
                  modern health challenges.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our mission remains unchanged: to empower individuals to achieve optimal health by understanding 
                  their unique constitution and providing the tools to restore balance naturally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-4">
              Guiding Principles
            </h2>
            <p className="text-lg text-gray-700">
              The core philosophies that define our approach to Ayurvedic wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PrincipleCard 
              title="Holistic Balance" 
              description="We believe in treating the whole person—body, mind, and spirit—rather than isolated symptoms."
            />
            <PrincipleCard 
              title="Individual Constitution" 
              description="We recognize that each person has a unique doshic makeup that requires personalized care."
            />
            <PrincipleCard 
              title="Natural Solutions" 
              description="We prioritize natural, plant-based remedies that work in harmony with the body's own healing systems."
            />
            <PrincipleCard 
              title="Preventative Care" 
              description="We focus on daily routines and practices that prevent imbalance before illness manifests."
            />
            <PrincipleCard 
              title="Sustainable Sourcing" 
              description="We carefully select ingredients that are ethically harvested and environmentally responsible."
            />
            <PrincipleCard 
              title="Traditional Wisdom" 
              description="We honor the time-tested wisdom of Ayurveda while integrating modern scientific understanding."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-4">
              Our Practitioners
            </h2>
            <p className="text-lg text-gray-700">
              Meet our team of dedicated Ayurvedic experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TeamMember 
              name="Dr. Meera Sharma" 
              title="Founder & Chief Ayurvedic Physician"
              image="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
              bio="With over 25 years of experience in Ayurvedic medicine, Dr. Sharma holds a doctorate in Ayurveda from Gujarat Ayurved University and has studied with traditional practitioners across India."
            />
            <TeamMember 
              name="Dr. Aiden Patel" 
              title="Ayurvedic Practitioner"
              image="https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg"
              bio="Specializing in digestive health and stress management, Dr. Patel combines his Ayurvedic training with a background in Western nutrition to create integrative treatment plans."
            />
            <TeamMember 
              name="Maya Rodriguez" 
              title="Panchakarma Specialist"
              image="https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg"
              bio="Maya has dedicated her career to the art and science of detoxification through traditional Panchakarma treatments, trained in Kerala, India under master practitioners."
            />
            <TeamMember 
              name="Sarah Chen, LMT" 
              title="Ayurvedic Massage Therapist"
              image="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg"
              bio="Sarah specializes in Abhyanga and Marma therapy, with additional certifications in Western massage techniques that she integrates into her holistic bodywork approach."
            />
            <TeamMember 
              name="Dr. Raj Verma" 
              title="Ayurvedic Herbalist"
              image="https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg"
              bio="Dr. Verma oversees our herbal formulations, bringing his extensive knowledge of medicinal plants and traditional preparation methods to ensure optimal potency and purity."
            />
            <TeamMember 
              name="Leila Johnson" 
              title="Ayurvedic Nutrition Coach"
              image="https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg" 
              bio="Leila helps clients implement sustainable dietary changes based on their dosha type, specializing in making Ayurvedic nutrition accessible for modern busy lifestyles."
            />
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-4">
              Our Certifications
            </h2>
            <p className="text-lg text-gray-700">
              We maintain the highest standards in Ayurvedic practice and product quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <CertificateCard 
              title="NAMA Certified" 
              description="All our practitioners are certified by the National Ayurvedic Medical Association, ensuring adherence to professional standards."
            />
            <CertificateCard 
              title="GMP Compliant" 
              description="Our product facility follows Good Manufacturing Practices for consistently high quality and safety standards."
            />
            <CertificateCard 
              title="USDA Organic" 
              description="We use certified organic ingredients whenever possible to ensure purity and environmental responsibility."
            />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="lg:flex items-center gap-12">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Visit Our Center</h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Our peaceful wellness center is designed to be a sanctuary from the moment you step inside. 
                  From our consultation rooms to our treatment spaces, every detail has been thoughtfully 
                  created to support your healing journey.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-emerald-700 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600">123 Wellness Street, Harmony City, HC 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={20} className="text-emerald-700 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={20} className="text-emerald-700 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">info@avaayurvedic.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-2">Hours</h3>
                  <table className="w-full text-left text-gray-600">
                    <tbody>
                      <tr>
                        <td className="pr-4 py-1">Monday - Friday</td>
                        <td className="py-1">9:00 AM - 6:00 PM</td>
                      </tr>
                      <tr>
                        <td className="pr-4 py-1">Saturday</td>
                        <td className="py-1">10:00 AM - 4:00 PM</td>
                      </tr>
                      <tr>
                        <td className="pr-4 py-1">Sunday</td>
                        <td className="py-1">Closed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Map placeholder - In a real implementation, you would embed an actual map here */}
              <div className="lg:w-1/2 h-80 bg-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf size={48} className="text-emerald-700 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface PrincipleCardProps {
  title: string;
  description: string;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100 transform transition-transform hover:scale-105">
      <div className="mb-4 rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center">
        <Leaf size={20} className="text-emerald-700" />
      </div>
      <h3 className="text-lg font-medium text-emerald-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TeamMemberProps {
  name: string;
  title: string;
  image: string;
  bio: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, title, image, bio }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-64 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover object-center" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium text-emerald-900">{name}</h3>
        <p className="text-amber-600 mb-4">{title}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>
    </div>
  );
};

interface CertificateCardProps {
  title: string;
  description: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="mr-3 text-emerald-700">
          <Check size={22} className="p-1 rounded-full bg-emerald-100" />
        </div>
        <h3 className="text-lg font-medium text-emerald-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default About;