import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, FileText, LogOut, Users, CalendarDays, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-emerald-800 p-4 flex items-center justify-between">
        <div className="text-white font-serif text-xl font-bold">
          Avaayurvedic Admin
        </div>
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-emerald-800 min-h-screen p-4">
          <div className="text-white font-serif text-xl font-bold mb-8">
            Avaayurvedic Admin
          </div>
          <nav className="space-y-2">
            <NavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/admin/products" icon={<Package size={20} />} label="Products" />
            <NavLink to="/admin/appointments" icon={<Calendar size={20} />} label="Appointments" />
            <NavLink to="/admin/calendar" icon={<CalendarDays size={20} />} label="Calendar" />
            <NavLink to="/admin/quiz" icon={<FileText size={20} />} label="Dosha Quiz" />
            <NavLink to="/admin/users" icon={<Users size={20} />} label="Users" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-emerald-700 rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-emerald-800 p-4 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between mb-8">
            <div className="text-white font-serif text-xl font-bold">
              Avaayurvedic Admin
            </div>
            <button
              onClick={closeSidebar}
              className="text-white p-2 rounded-md hover:bg-emerald-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            <MobileNavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={closeSidebar} />
            <MobileNavLink to="/admin/products" icon={<Package size={20} />} label="Products" onClick={closeSidebar} />
            <MobileNavLink to="/admin/appointments" icon={<Calendar size={20} />} label="Appointments" onClick={closeSidebar} />
            <MobileNavLink to="/admin/calendar" icon={<CalendarDays size={20} />} label="Calendar" onClick={closeSidebar} />
            <MobileNavLink to="/admin/quiz" icon={<FileText size={20} />} label="Dosha Quiz" onClick={closeSidebar} />
            <MobileNavLink to="/admin/users" icon={<Users size={20} />} label="Users" onClick={closeSidebar} />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-emerald-700 rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:p-8 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-emerald-700 rounded-md transition-colors"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-emerald-700 rounded-md transition-colors"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default AdminDashboard;