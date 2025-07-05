import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, FileText, LogOut, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-emerald-800 min-h-screen p-4">
          <div className="text-white font-serif text-xl font-bold mb-8">
            Avaayurvedic Admin
          </div>
          <nav className="space-y-2">
            <NavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/admin/products" icon={<Package size={20} />} label="Products" />
            <NavLink to="/admin/appointments" icon={<Calendar size={20} />} label="Appointments" />
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

        {/* Main Content */}
        <main className="flex-1 p-8">
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

export default AdminDashboard; 