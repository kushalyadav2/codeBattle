import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Profile: {user?.username}</h1>
        <p className="text-gray-400">Profile functionality will be implemented in the next tasks</p>
      </div>
    </div>
  );
};

export default Profile;
