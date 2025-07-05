import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Award,
  UserPlus,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  totalUsers: number;
  userGrowth: number;
  totalBookings: number;
  bookingGrowth: number;
  monthlyRevenue: number;
  productsSold: number;
  productGrowth: number;
  completionRate: number;
  popularServices: Array<{ name: string; count: number }>;
  monthlyBookings: Array<{ month: string; count: number }>;
  serviceRevenue: Array<{ service: string; revenue: number }>;
  doshaCompletions: Array<{ dosha: string; count: number }>;
  userRegistrations: Array<{ month: string; count: number }>;
  productSales: Array<{ month: string; count: number }>;
}

const DashboardOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data
      const [
        usersData,
        bookingsData,
        productsData,
        servicesData,
        quizData
      ] = await Promise.all([
        fetchUsersData(),
        fetchBookingsData(),
        fetchProductsData(),
        fetchServicesData(),
        fetchQuizData()
      ]);

      // Calculate KPIs
      const totalUsers = usersData.total;
      const userGrowth = calculateGrowth(usersData.monthlyData);
      const totalBookings = bookingsData.total;
      const bookingGrowth = calculateGrowth(bookingsData.monthlyData);
      const serviceRevenue = bookingsData.revenue;
      const productRevenue = productsData.revenue;
      const totalRevenue = serviceRevenue + productRevenue;
      const productsSold = productsData.sold;
      const productGrowth = calculateGrowth(productsData.monthlySales);
      const completionRate = calculateCompletionRate(bookingsData.bookings);
      const popularServices = getPopularServices(bookingsData.bookings);

      setData({
        totalUsers,
        userGrowth,
        totalBookings,
        bookingGrowth,
        monthlyRevenue: totalRevenue,
        productsSold,
        productGrowth,
        completionRate,
        popularServices,
        monthlyBookings: bookingsData.monthlyData,
        serviceRevenue: bookingsData.serviceRevenue,
        doshaCompletions: quizData.doshaData,
        userRegistrations: usersData.monthlyData,
        productSales: productsData.monthlySales
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('created_at');

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return { total: 0, monthlyData: [] };
      }

      const { data: monthlyUsers, error: monthlyError } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).toISOString());

      if (monthlyError) {
        console.error('Error fetching monthly users:', monthlyError);
        return { total: users?.length || 0, monthlyData: [] };
      }

      const monthlyData = processMonthlyData(monthlyUsers || [], 'created_at');
      
      return {
        total: users?.length || 0,
        monthlyData
      };
    } catch (error) {
      console.error('Error in fetchUsersData:', error);
      return { total: 0, monthlyData: [] };
    }
  };

  const fetchBookingsData = async () => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, price)
        `);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return {
          total: 0,
          bookings: [],
          monthlyData: [],
          revenue: 0,
          serviceRevenue: []
        };
      }

      const { data: monthlyBookings, error: monthlyError } = await supabase
        .from('bookings')
        .select('created_at, services(name, price)')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).toISOString());

      if (monthlyError) {
        console.error('Error fetching monthly bookings:', monthlyError);
        return {
          total: bookings?.length || 0,
          bookings: bookings || [],
          monthlyData: [],
          revenue: calculateRevenue(bookings || []),
          serviceRevenue: calculateServiceRevenue(bookings || [])
        };
      }

      const monthlyData = processMonthlyData(monthlyBookings || [], 'created_at');
      const revenue = calculateRevenue(bookings || []);
      const serviceRevenue = calculateServiceRevenue(bookings || []);

      return {
        total: bookings?.length || 0,
        bookings: bookings || [],
        monthlyData,
        revenue,
        serviceRevenue
      };
    } catch (error) {
      console.error('Error in fetchBookingsData:', error);
      return {
        total: 0,
        bookings: [],
        monthlyData: [],
        revenue: 0,
        serviceRevenue: []
      };
    }
  };

  const fetchProductsData = async () => {
    try {
      // Fetch real product sales data from purchases table
      const { data: purchases, error } = await supabase
        .from('purchases')
        .select(`
          quantity,
          total_price,
          created_at,
          products(name, price)
        `);

      if (error) {
        console.error('Error fetching purchases:', error);
        return { 
          sold: 0,
          revenue: 0,
          purchases: [],
          monthlySales: []
        };
      }

      // Calculate total products sold and revenue
      const totalSold = purchases?.reduce((sum, purchase) => sum + (purchase.quantity || 0), 0) || 0;
      const productRevenue = purchases?.reduce((sum, purchase) => sum + (purchase.total_price || 0), 0) || 0;

      // Calculate monthly product sales for trends
      const monthlyProductSales = processMonthlyData(purchases || [], 'created_at');

      return { 
        sold: totalSold,
        revenue: productRevenue,
        purchases: purchases || [],
        monthlySales: monthlyProductSales
      };
    } catch (error) {
      console.error('Error in fetchProductsData:', error);
      return { 
        sold: 0,
        revenue: 0,
        purchases: [],
        monthlySales: []
      };
    }
  };

  const fetchServicesData = async () => {
    const { data: services } = await supabase
      .from('services')
      .select('*');
    
    return services || [];
  };

  const fetchQuizData = async () => {
    try {
      const { data: quizResults, error } = await supabase
        .from('dosha_quiz_results')
        .select('primary_dosha');

      if (error) {
        console.error('Error fetching quiz results:', error);
        return { doshaData: [] };
      }

      const doshaData = processDoshaData(quizResults || []);
      
      return { doshaData };
    } catch (error) {
      console.error('Error in fetchQuizData:', error);
      return { doshaData: [] };
    }
  };

  const processMonthlyData = (data: any[], dateField: string) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const count = data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate.getMonth() === date.getMonth() && 
               itemDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({ month: monthName, count });
    }
    
    return months;
  };

  const calculateGrowth = (monthlyData: Array<{ month: string; count: number }>) => {
    if (monthlyData.length < 2) return 0;
    const current = monthlyData[monthlyData.length - 1].count;
    const previous = monthlyData[monthlyData.length - 2].count;
    return previous === 0 ? 100 : ((current - previous) / previous) * 100;
  };

  const calculateRevenue = (bookings: any[]) => {
    return bookings.reduce((total, booking) => {
      return total + (booking.services?.price || 0);
    }, 0);
  };

  const calculateServiceRevenue = (bookings: any[]) => {
    const serviceMap = new Map();
    
    bookings.forEach(booking => {
      const serviceName = booking.services?.name || 'Unknown';
      const price = booking.services?.price || 0;
      serviceMap.set(serviceName, (serviceMap.get(serviceName) || 0) + price);
    });
    
    return Array.from(serviceMap.entries()).map(([service, revenue]) => ({
      service,
      revenue: Number(revenue)
    }));
  };

  const calculateCompletionRate = (bookings: any[]) => {
    if (bookings.length === 0) return 0;
    const completed = bookings.filter(b => b.status === 'confirmed').length;
    return Math.round((completed / bookings.length) * 100);
  };

  const getPopularServices = (bookings: any[]) => {
    const serviceMap = new Map();
    
    bookings.forEach(booking => {
      const serviceName = booking.services?.name || 'Unknown';
      serviceMap.set(serviceName, (serviceMap.get(serviceName) || 0) + 1);
    });
    
    return Array.from(serviceMap.entries())
      .map(([name, count]) => ({ name, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const processDoshaData = (quizResults: any[]) => {
    const doshaMap = new Map();
    
    quizResults.forEach(result => {
      const dosha = result.primary_dosha || 'Unknown';
      doshaMap.set(dosha, (doshaMap.get(dosha) || 0) + 1);
    });
    
    return Array.from(doshaMap.entries()).map(([dosha, count]) => ({
      dosha: dosha.charAt(0).toUpperCase() + dosha.slice(1),
      count: Number(count)
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  // Chart configurations
  const bookingTrendsData = {
    labels: data.monthlyBookings.map(d => d.month),
    datasets: [{
      label: 'Bookings',
      data: data.monthlyBookings.map(d => d.count),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  };

  const servicePopularityData = {
    labels: data.popularServices.map(s => s.name),
    datasets: [{
      data: data.popularServices.map(s => s.count),
      backgroundColor: [
        '#10B981',
        '#3B82F6',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ]
    }]
  };

  const userGrowthData = {
    labels: data.userRegistrations.map(d => d.month),
    datasets: [{
      label: 'New Users',
      data: data.userRegistrations.map(d => d.count),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const revenueData = {
    labels: data.serviceRevenue.map(s => s.service),
    datasets: [{
      label: 'Revenue',
      data: data.serviceRevenue.map(s => s.revenue),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }]
  };

  const doshaData = {
    labels: data.doshaCompletions.map(d => d.dosha),
    datasets: [{
      data: data.doshaCompletions.map(d => d.count),
      backgroundColor: [
        '#10B981',
        '#F59E0B',
        '#3B82F6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your business performance and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <KPICard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          change={data.userGrowth}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <KPICard
          title="Total Bookings"
          value={data.totalBookings.toLocaleString()}
          change={data.bookingGrowth}
          icon={<Calendar className="h-6 w-6" />}
          color="green"
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${data.monthlyRevenue.toLocaleString()}`}
          change={0}
          icon={<DollarSign className="h-6 w-6" />}
          color="emerald"
        />
        <KPICard
          title="Products Sold"
          value={data.productsSold.toLocaleString()}
          change={data.productGrowth}
          icon={<Package className="h-6 w-6" />}
          color="purple"
        />
        <KPICard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          change={0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="orange"
        />
        <KPICard
          title="Active Services"
          value={data.popularServices.length.toString()}
          change={0}
          icon={<Award className="h-6 w-6" />}
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Booking Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Booking Trends</h3>
          <div className="h-64">
            <Line 
              data={bookingTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Service Popularity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Popularity</h3>
          <div className="h-64">
            <Pie 
              data={servicePopularityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* User Registration Growth */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Growth</h3>
          <div className="h-64">
            <Bar 
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
          <div className="h-64">
            <Bar 
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value: any) {
                        return '$' + value;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Dosha Quiz Completions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dosha Quiz Completions</h3>
          <div className="h-64">
            <Doughnut 
              data={doshaData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Product Sales Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Sales Trends</h3>
          <div className="h-64">
            <Line 
              data={{
                labels: data.productSales.map(d => d.month),
                datasets: [{
                  label: 'Products Sold',
                  data: data.productSales.map(d => d.count),
                  borderColor: 'rgb(147, 51, 234)',
                  backgroundColor: 'rgba(147, 51, 234, 0.1)',
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Users</div>
            <div className="text-gray-600">{data.totalUsers} total registered</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Bookings</div>
            <div className="text-gray-600">{data.totalBookings} total appointments</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Products</div>
            <div className="text-gray-600">{data.productsSold} total sold</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Revenue</div>
            <div className="text-gray-600">${data.monthlyRevenue.toLocaleString()} total</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Data Sources:</strong> All data is fetched in real-time from your Supabase database. 
            The dashboard shows actual user registrations, bookings, product sales, and quiz completions.
          </div>
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== 0 && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 