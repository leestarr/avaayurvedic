import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { User, Calendar, Mail, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  booking_count: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Fetch all user profiles
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (userProfilesError) {
        console.error('Error fetching user profiles:', userProfilesError);
        toast.error('Failed to load users');
        return;
      }

      // Get booking counts for each user
      const usersWithBookings = await Promise.all(
        (userProfiles || []).map(async (profile) => {
          const { count, error: bookingError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          if (bookingError) {
            console.error('Error fetching booking count:', bookingError);
          }

          return {
            ...profile,
            booking_count: count || 0
          };
        })
      );

      setUsers(usersWithBookings);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleSyncUsers = async () => {
    setSyncing(true);
    try {
      // Find users who have bookings but no profile
      const { data: bookingsWithoutProfiles, error: bookingsError } = await supabase
        .from('bookings')
        .select('user_id')
        .not('user_id', 'in', `(${users.map(u => `'${u.user_id}'`).join(',')})`);

      if (bookingsError) {
        console.error('Error finding bookings without profiles:', bookingsError);
        toast.error('Failed to sync users');
        return;
      }

      if (bookingsWithoutProfiles && bookingsWithoutProfiles.length > 0) {
        // Create profiles for users who have bookings but no profile
        const uniqueUserIds = [...new Set(bookingsWithoutProfiles.map(b => b.user_id))];
        
        const profilesToCreate = uniqueUserIds.map(userId => ({
          user_id: userId,
          email: null, // We don't have email from bookings
          first_name: null,
          last_name: null,
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(profilesToCreate);

        if (insertError) {
          console.error('Error creating missing profiles:', insertError);
          toast.error('Failed to create some user profiles');
        } else {
          toast.success(`Created ${uniqueUserIds.length} missing user profiles`);
          // Refresh the user list
          await fetchUsers();
        }
      } else {
        toast.success('All users are already synced!');
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      toast.error('Failed to sync users');
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase();
    const email = (user.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserName = (user: UserProfile) => {
    const firstName = user.first_name?.trim() || '';
    const lastName = user.last_name?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Users Management</h1>
        <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">
          Manage user profiles and view booking history
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-500">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </div>
        <button
          onClick={handleSyncUsers}
          disabled={syncing}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50"
        >
          {syncing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500 mr-2"></div>
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Sync Users
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 lg:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getUserName(user)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.user_id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email || 'No email'}
                      </div>
                      {user.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.booking_count} booking{user.booking_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/users/${user.user_id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserName(user)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {user.user_id.slice(0, 8)}...
                  </div>
                </div>
              </div>
              <Link
                to={`/admin/users/${user.user_id}`}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                View
              </Link>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900">{user.email || 'No email'}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-900">
                  {user.booking_count} booking{user.booking_count !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="text-xs text-gray-500">
                Member since {formatDate(user.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No users have been created yet.'}
          </p>
        </div>
      )}
    </div>
  );
} 