import { useState } from 'react';
import { FaBell, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    newOffers: true,
    donationUpdates: true,
    urgentNeeds: false,
    newsletter: true
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { user, logout } = useAuth(); 
  


  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success(`Notifications ${!notifications[type] ? 'enabled' : 'disabled'}`);
  };

  const handleAccountDelete = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      toast.error("Please type the exact phrase to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

  
      logout();
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      toast.success("Account deleted successfully");
      navigate("/"); 
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-12">
        
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      
 
      
        <div className="flex items-center mb-6">
          <FaBell className="text-blue-500 mr-3 text-xl" />
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div>
                <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p className="text-sm text-gray-500">
                  {key === 'newOffers' && 'Get notified about new donation offers'}
                  {key === 'donationUpdates' && 'Updates on your donation status'}
                  {key === 'urgentNeeds' && 'Emergency food needs in your area'}
                  {key === 'newsletter' && 'Monthly platform updates'}
                </p>
              </div>
              <button 
                onClick={() => handleNotificationToggle(key)}
                className="text-2xl"
              >
                {value ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Account Deletion Section */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center mb-6">
            <FaTrashAlt className="text-red-500 mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Delete Account</h2>
          </div>

          <div className="space-y-4">
            <p className="text-red-600 font-medium">
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div>
              <label className="block mb-2">
                Type <span className="font-bold">"DELETE MY ACCOUNT"</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="DELETE MY ACCOUNT"
              />
            </div>

            <button
              onClick={handleAccountDelete}
              disabled={isDeleting || confirmText !== "DELETE MY ACCOUNT"}
              className={`px-6 py-2 rounded-md text-white ${
                confirmText === "DELETE MY ACCOUNT" 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
          </div>
      </section>
    </div>
  );
};


const deleteAccountAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1500);
  });
};

export default SettingsPage;