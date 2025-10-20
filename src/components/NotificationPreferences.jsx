// NotificationPreferences.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NotificationPreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState({
    sms: false,
    email: true,
    push: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences(user.notificationPreferences);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await api.put(`/users/${user._id}`, {
        notificationPreferences: preferences
      });
      updateUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-6 mx-auto bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-bold">Notification Preferences</h2>
      
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={preferences.sms}
            onChange={() => setPreferences(p => ({...p, sms: !p.sms}))}
            className="mr-2"
          />
          SMS Notifications
        </label>
        <p className="ml-6 text-sm text-gray-500">
          Receive text messages about new announcements
        </p>
      </div>

      {/* Similar fields for email and push */}

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
};

export default NotificationPreferences;