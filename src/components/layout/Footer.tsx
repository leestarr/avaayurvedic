import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube 
} from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-2xl font-serif font-medium text-white">
                Avaayurvedic
              </span>
            </div>
            <p className="mb-6 text-emerald-100">
              Restoring balance to your life through ancient Ayurvedic wisdom and modern practices.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-amber-400" />
                <p className="text-emerald-100">123 Wellness Street, Harmony City, HC 10001</p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-amber-400" />
                <p className="text-emerald-100">(555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-amber-400" />
                <p className="text-emerald-100">info@avaayurvedic.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-medium mb-6 text-amber-400">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/shop" label="Shop" />
              <FooterLink to="/appointments" label="Book Appointment" />
              <FooterLink to="/dosha-quiz" label="Dosha Quiz" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/blog" label="Blog" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-serif font-medium mb-6 text-amber-400">Categories</h3>
            <ul className="space-y-3">
              <FooterLink to="/shop/herbs" label="Herbs & Spices" />
              <FooterLink to="/shop/oils" label="Essential Oils" />
              <FooterLink to="/shop/teas" label="Herbal Teas" />
              <FooterLink to="/shop/supplements" label="Supplements" />
              <FooterLink to="/shop/skincare" label="Skincare" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-serif font-medium mb-6 text-amber-400">Newsletter</h3>
            <p className="mb-4 text-emerald-100">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md bg-emerald-800 border border-emerald-700 text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="flex space-x-4">
              <SocialLink icon={<Instagram size={20} />} href="https://instagram.com" />
              <SocialLink icon={<Facebook size={20} />} href="https://facebook.com" />
              <SocialLink icon={<Twitter size={20} />} href="https://twitter.com" />
              <SocialLink icon={<Youtube size={20} />} href="https://youtube.com" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-800 text-center text-emerald-200">
          <p className="mb-4">&copy; {new Date().getFullYear()} Avaayurvedic. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/shipping-policy" className="hover:text-amber-400 transition-colors">
              Shipping Policy
            </Link>
            <Link to="/refund-policy" className="hover:text-amber-400 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, label }) => {
  return (
    <li>
      <Link to={to} className="text-emerald-100 hover:text-amber-400 transition-colors">
        {label}
      </Link>
    </li>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-emerald-800 hover:bg-amber-500 text-white p-2 rounded-full transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

export default Footer;