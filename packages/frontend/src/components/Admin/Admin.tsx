// src/components/AdminPanel.tsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return null; // Or redirect, or show an error, etc.
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin-only content goes here */}
    </div>
  );
};

export default AdminPanel;
