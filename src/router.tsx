import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import DoshaQuiz from './pages/DoshaQuiz';
import Assessments from './pages/Assessments';
import Appointments from './pages/Appointments';
import About from './pages/About';
import Cart from './pages/Cart';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminQuiz from './pages/admin/Quiz';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import ResetPassword from './pages/ResetPassword';
import TestSupabase from './components/TestSupabase';
import { checkIsAdmin } from './lib/supabase';
import ProtectedRoute from './components/ProtectedRoute';

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-500">Go back home</a>
    </div>
  </div>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, []);

  if (isAdmin === null) return null;
  if (!isAdmin) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:category', element: <Shop /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'dosha-quiz', element: <DoshaQuiz /> },
      { path: 'assessments', element: <Assessments /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'about', element: <About /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'auth/callback/reset-password', element: <ResetPassword /> },
      { 
        path: 'account', 
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ) 
      },
      { path: 'test-supabase', element: <TestSupabase /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminProducts /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'appointments', element: <AdminAppointments /> },
      { path: 'quiz', element: <AdminQuiz /> }
    ]
  }
]);

export default router;