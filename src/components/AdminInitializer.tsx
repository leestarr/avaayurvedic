import React, { useEffect } from 'react';
import { setupAdminUser } from '../lib/setupAdmin';

const AdminInitializer: React.FC = () => {
  useEffect(() => {
    setupAdminUser().catch(console.error);
  }, []);

  return null; // This component doesn't render anything
};

export default AdminInitializer; 