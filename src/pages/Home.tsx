import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500 opacity-10"></div>
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-950 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              <span className="text-amber-400">Ancient Wisdom</span> for 
              <span className="text-amber-400"> Modern Wellness</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl">
              Discover the transformative power of Ayurveda through our carefully crafted products, 
              personalized consultations, and balancing rituals designed to bring harmony to your body, mind, and spirit.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/shop" 
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                Shop Products <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link 
                to="/dosha-quiz" 
                className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-emerald-900 text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                Take Dosha Quiz <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-emerald-900">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard 
              title="Herbal Supplements" 
              image="https://images.pexels.com/photos/4021878/pexels-photo-4021878.jpeg"
              link="/shop/supplements"
            />
            <CategoryCard 
              title="Essential Oils" 
              image="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"
              link="/shop/oils"
            />
            <CategoryCard 
              title="Herbal Teas" 
              image="https://images.pexels.com/photos/227908/pexels-photo-227908.jpeg"
              link="/shop/teas"
            />
          </div>
        </div>
      </section>

      {/* Dosha Balancing */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-emerald-900">Discover Your Unique Dosha Balance</h2>
              <p className="text-lg text-gray-700 mb-8">
                Ayurveda recognizes that each of us has a unique mind-body constitution made up of three doshas: 
                Vata, Pitta, and Kapha. Understanding your dominant dosha is the first step toward restoring balance 
                and improving your overall wellbeing.
              </p>
              <div className="space-y-4 mb-8">
                <BenefitItem text="Personalized health recommendations based on your constitution" />
                <BenefitItem text="Discover dietary and lifestyle practices that support your balance" />
                <BenefitItem text="Learn which Ayurvedic remedies are most effective for you" />
                <BenefitItem text="Gain insights into your physical and emotional tendencies" />
              </div>
              <Link 
                to="/dosha-quiz" 
                className="inline-block px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition-colors duration-300"
              >
                Take the Dosha Quiz
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <DoshaCard 
                  name="Vata" 
                  description="Air & Space" 
                  color="bg-indigo-100 border-indigo-300"
                />
                <DoshaCard 
                  name="Pitta" 
                  description="Fire & Water" 
                  color="bg-amber-100 border-amber-300"
                />
              </div>
              <div className="mt-12 space-y-6">
                <DoshaCard 
                  name="Kapha" 
                  description="Earth & Water" 
                  color="bg-emerald-100 border-emerald-300"
                />
                <div className="relative p-6 bg-white rounded-lg shadow-lg border-2 border-teal-200 transform transition-transform hover:scale-105">
                  <h3 className="text-xl font-serif font-bold text-teal-900 mb-2">Your Balance</h3>
                  <p className="text-gray-700">Discover your unique combination of all three doshas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking CTA */}
      <section className="py-20 bg-emerald-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Book Your Ayurvedic Consultation</h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-3xl mx-auto">
            Experience a personalized Ayurvedic consultation with our expert practitioners. 
            Receive tailored guidance for your unique constitution and health goals.
          </p>
          <Link 
            to="/appointments" 
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors duration-300"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-emerald-900">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The dosha quiz was eye-opening. The personalized recommendations have made a tremendous difference in my energy levels and overall wellbeing."
              author="Sarah J."
              location="New York, NY"
            />
            <TestimonialCard 
              quote="I've been using the Tranquil Mind tea for a month now, and my anxiety has significantly reduced. The quality of their products is exceptional."
              author="Michael T."
              location="Austin, TX"
            />
            <TestimonialCard 
              quote="My consultation with Dr. Patel was transformative. She understood my concerns and provided practical solutions that fit my lifestyle."
              author="Emily R."
              location="Portland, OR"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-emerald-900">Join Our Ayurvedic Journey</h2>
          <p className="text-lg text-gray-700 mb-8">
            Subscribe to our newsletter for seasonal Ayurvedic tips, special offers, and wellness wisdom.
          </p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, link }) => {
  return (
    <Link to={link} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-transparent opacity-70 z-10"></div>
        <img src={image} alt={title} className="w-full h-80 object-cover object-center" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-2xl font-serif font-bold text-white">{title}</h3>
          <p className="text-amber-300 flex items-center mt-2 group-hover:translate-x-2 transition-transform">
            Shop Now <ArrowRight size={18} className="ml-2" />
          </p>
        </div>
      </div>
    </Link>
  );
};

interface BenefitItemProps {
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => {
  return (
    <div className="flex items-start">
      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
        <Check size={16} className="text-white" />
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

interface DoshaCardProps {
  name: string;
  description: string;
  color: string;
}

const DoshaCard: React.FC<DoshaCardProps> = ({ name, description, color }) => {
  return (
    <div className={`relative p-6 rounded-lg shadow-md border-2 ${color} transform transition-transform hover:scale-105`}>
      <h3 className="text-xl font-serif font-bold text-emerald-900 mb-2">{name}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, location }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="text-amber-500 mb-4">
        {/* Simple quote icon styling using CSS */}
        <div className="text-4xl font-serif leading-none">"</div>
      </div>
      <p className="text-gray-700 mb-6">{quote}</p>
      <div>
        <p className="font-medium text-emerald-900">{author}</p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>
    </div>
  );
};

export default Home;