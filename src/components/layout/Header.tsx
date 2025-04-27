import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart, User, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
          <span className="ml-2 text-2xl font-serif font-medium text-emerald-800">
            Avaayurvedic
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/shop" label="Shop" />
          <NavLink to="/appointments" label="Appointments" />
          <NavLink to="/dosha-quiz" label="Dosha Quiz" />
          <NavLink to="/about" label="About Us" />
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link 
            to="/favorites" 
            className="text-gray-700 hover:text-amber-600 transition-colors"
            aria-label="Favorites"
          >
            <Heart size={22} />
          </Link>
          <Link 
            to="/account" 
            className="text-gray-700 hover:text-amber-600 transition-colors"
            aria-label="Account"
          >
            <User size={22} />
          </Link>
          <Link 
            to="/appointments" 
            className="text-gray-700 hover:text-amber-600 transition-colors"
            aria-label="Appointments"
          >
            <Calendar size={22} />
          </Link>
          <Link 
            to="/cart" 
            className="relative text-gray-700 hover:text-amber-600 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={22} />
            {cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Link 
            to="/cart" 
            className="relative text-gray-700"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={22} />
            {cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 lg:hidden">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/shop" label="Shop" />
              <MobileNavLink to="/appointments" label="Appointments" />
              <MobileNavLink to="/dosha-quiz" label="Dosha Quiz" />
              <MobileNavLink to="/about" label="About Us" />
              <MobileNavLink to="/favorites" label="Favorites" />
              <MobileNavLink to="/account" label="Account" />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-amber-600 border-b-2 border-amber-600' 
          : 'text-gray-700 hover:text-amber-600'
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`text-xl font-medium ${
        isActive ? 'text-amber-600' : 'text-gray-700'
      }`}
    >
      {label}
    </Link>
  );
};

export default Header;