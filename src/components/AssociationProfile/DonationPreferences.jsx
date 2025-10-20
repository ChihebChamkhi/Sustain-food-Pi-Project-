import { FaCheckCircle, FaBreadSlice } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const DonationPreferences = () => {
  const [preferences, setPreferences] = useState({
    foodTypes: {
      vegetarian: true,
      vegan: false,
      meat: true,
      dairy: true,
      bakery: false,
      other : false
    },
    quantityPreferences: {  
      minQuantity: 1,      
      maxQuantity: 100   
    },
    lastUpdated: new Date().toISOString()
  });

  const [success, setSuccess] = useState({
    show: false,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' 
  });
  const notificationTimeout = useRef();


  const showNotification = (message, type = 'success') => {
    
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    setNotification({
      show: true,
      message,
      type
    });

    // Masquer automatiquement après 3 secondes
    notificationTimeout.current = setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 3000);
  };

  // Nettoyage du timeout quand le composant est démonté
  useEffect(() => {
    return () => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch('http://localhost:5000/api/auth/association-preferences', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        type: preferences  // Change donationPreferences to type
      })
    });

    if (!response.ok) throw new Error("Failed to fetch preferences");

    const data = await response.json();
    
    
    const loadedPreferences = data.donationPreferences || {
      foodTypes: {
        vegetarian: true,
        vegan: false,
        meat: true,
        dairy: true,
        bakery: false,
        other : false
      },
      quantityPreferences: {
        minQuantity: 1,
        maxQuantity: 100
      },
      lastUpdated: new Date().toISOString()
    };

    setPreferences(loadedPreferences);
  
    showNotification('Preferences loaded successfully');
    


  } catch (error) {
    console.error("Fetch error:", error.message);
    showNotification('Failed to load preferences', 'error');
  
    setPreferences({
      foodTypes: {
        vegetarian: true,
        vegan: false,
        meat: true,
        dairy: true,
        bakery: false,
        other : false
      },
      quantityPreferences: {
        minQuantity: 1,
        maxQuantity: 100
      },
      lastUpdated: new Date().toISOString()
    });
  } finally {
    setIsLoading(false);
  }
};

    fetchPreferences();
  }, []);

  const handleToggle = (category, field) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleQuantityChange = (field, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setPreferences(prev => ({
        ...prev,
        quantityPreferences: {  // Updated to match new structure
          ...prev.quantityPreferences,
          [field === 'min' ? 'minQuantity' : 'maxQuantity']: numValue
        }
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Ensure all required fields are included
      const requestBody = {
        foodTypes: preferences.foodTypes,
        quantityPreferences: preferences.quantityPreferences
      };
  
      const response = await fetch('http://localhost:5000/api/auth/association-preferences', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(requestBody)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences');
      }
  
      // Update state with the exact response from server
      setPreferences(data.donationPreferences);
      showNotification('Preferences updated successfully');
      
    } catch (error) {
      console.error("Update error:", error);
      showNotification(error.message || 'Failed to update preferences', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="mt-10 min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {notification.show && (
        <div className={`fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg animate-fade-in
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
          <button 
            onClick={() => setNotification(prev => ({...prev, show: false}))}
            className="ml-3 font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Donation Preferences</h1>
        
        
        {/* Food Types Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaBreadSlice className="text-orange-500" /> Food Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(preferences.foodTypes).map(([key, value]) => (
              <div 
                key={key} 
                onClick={() => handleToggle('foodTypes', key)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center 
                  ${value ? 'bg-orange-100 border-orange-400' : 'bg-gray-100'}`}
                >
                  {value && <FaCheckCircle className="text-orange-500" />}
                </div>
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Preferences */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Quantity Preferences (kg/liters)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
              <input
  type="number"
  value={preferences.quantityPreferences.minQuantity}  // Updated path
  onChange={(e) => handleQuantityChange('min', e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
  min="0"
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
              <input
  type="number"
  value={preferences.quantityPreferences.maxQuantity}  // Updated path
  onChange={(e) => handleQuantityChange('max', e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
  min="1"
/>
            </div>
          </div>
        </div>

     

        <button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-4 py-2 text-white bg-brightColor hover:bg-brightColor/90 rounded-lg mt-6"
>
  {isSubmitting ? 'Saving...' : 'Save Preferences'}
</button>

      </div>
    </div>
  );
};


export default DonationPreferences;