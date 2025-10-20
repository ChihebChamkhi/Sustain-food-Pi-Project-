import { useState, useEffect } from "react";
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateProfile, changePassword, uploadAvatar } from "../../services/api_auth";
import { getReservations, getReservationStats } from "../../services/api_reservations";
import BarChart from "../../components/Charts/BarChart";
import PieChart from "../../components/Charts/PieChart";
import ReservationsList from "../../components/ReservationsList";
import { businessSchema, individualSchema, associationSchema, passwordSchema } from "../../validators/validationSchemas";
import ReservationStats from '../../components/ReservationStats';
import LoadingSpinner from "../../components/LoadingSpinner";
//import ReservationCalendar from '../../components/ReservationCalendar';

// // Import FullCalendar and its plugins
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom';

const Profile = ({ initialTab = 'profile' }) => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);
  const [reservationStats, setReservationStats] = useState(null);

  const handleGoogleCalendarConnect = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Pass the token as a query parameter
    window.location.href = `http://localhost:5000/api/auth/google?token=${token}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const profile = await getUserProfile(token);
        setProfileData(profile);
        setFormData(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    useEffect(() => {
    document.title = "Profile";
  }, []);


    const fetchReservationStats = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          const stats = await getReservationStats();
          setReservationStats(stats);
        }
      } catch (error) {
        console.error("Error fetching reservation stats:", error);
      }
    };

    fetchProfile();
    fetchReservationStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateProfileData = () => {
    let validationSchema;
    if (user?.role === 'business') {
      validationSchema = businessSchema.pick({
        name: true,
        email: true,
        phone: true,
        companyName: true,
        matricule: true,
        address: true,
        description: true,
        businessType: true
      });
    } else if (user?.role === 'individual') {
      validationSchema = individualSchema.pick({
        name: true,
        email: true,
        phoneNumber: true,
        address: true
      });
    } else if (user?.role === 'association') {
      validationSchema = associationSchema.pick({
        name: true,
        email: true,
        organizationName: true,
        address: true,
        matricule: true
      });
    }

    const result = validationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = {};
      result.error.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateProfileData()) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const updatedProfile = await updateProfile(token, formData);
      setProfileData(updatedProfile);
      setEditMode(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setEditMode(false);
    setErrors({});
  };

  const handleScroll = (e) => {
    const reachedTop = e.target.scrollTop === 0;
    setIsContentScrolled(!reachedTop);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const result = passwordSchema.safeParse(passwordForm.newPassword);
    if (!result.success) {
      const newErrors = {};
      result.error.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
      setPasswordErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await changePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password changed successfully");
      setIsChangePasswordOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.message.includes("Current password is incorrect")) {
        setPasswordErrors({ currentPassword: "Current password is incorrect" });
      } else {
        alert("Failed to change password");
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await uploadAvatar(token, formData);

      setFormData(prev => ({
        ...prev,
        avatar: response.avatar
      }));

      setProfileData(prev => ({
        ...prev,
        avatar: response.avatar
      }));

    } catch (error) {
      console.error('Avatar upload error:', error);
      alert(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const statisticsData = {
    totalDonations: 120,
    completedDonations: 80,
    ongoingDonations: 40,
    foodSaved: 500,
    co2Saved: 1200,
  };

  const chartData = {
    donationsByCategory: {
      labels: ["Fruits", "Vegetables", "Bakery", "Dairy", "Meat"],
      data: [30, 25, 20, 15, 10],
    },
    donationsOverTime: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [10, 20, 30, 40, 50, 60],
    },
  };

  return (
    <div className="min-h-screen p-5 mt-20 bg-gray-100">
      <div className={`sticky top-0 z-10 bg-white shadow-md p-4 ${isContentScrolled ? "shadow-lg" : ""}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">User Profile</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              disabled={!editMode}
              className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editMode}
              className="px-4 py-2 text-white rounded bg-brightColor disabled:opacity-50 hover:bg-brightColor/90"
            >
              Save
            </button>
      <Link 
          to="/messages"
          className="px-4 py-2 text-white rounded bg-brightColor disabled:opacity-50 hover:bg-brightColor/90"
            >
          View Your Messages
        </Link>
      </div>
          </div>
        </div>
      

    
      <div className="mt-5 space-y-6" onScroll={handleScroll}>
        {/* Profile Header Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {isUploading ? (
                  <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full">
                    <span className="text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <img
                    src={formData.avatar || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                  />
                )}
                {editMode && (
                  <label className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-pointer group-hover:bg-gray-100">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-brightColor"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">{formData.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">ID: {formData.id}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(formData.id)}
                    className="text-brightColor hover:text-brightColor/80"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-4 py-2 mt-2 text-white rounded bg-brightColor hover:bg-brightColor/90"
                >
                  Change Password
                </button>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 text-white rounded bg-brightColor hover:bg-brightColor/90"
            >
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>


        {/* Tab Navigation */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-brightColor border-b-2 border-brightColor' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'reservations' ? 'text-brightColor border-b-2 border-brightColor' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reservations')}
            >
              My Reservations
            </button>
            {(user?.role === 'business' || user?.role === 'individual') && (
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'requests' ? 'text-brightColor border-b-2 border-brightColor' : 'text-gray-600'}`}
                onClick={() => setActiveTab('requests')}
              >
                Reservation Requests
              </button>
            )}
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-brightColor border-b-2 border-brightColor' : 'text-gray-600'}`}
              onClick={() => setActiveTab('stats')}
            >
              My Impact
            </button>
            {/* Add to your tab navigation */}
            {/*(user?.role === 'business' || user?.role === 'individual') && (
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'calendar' ? 'text-brightColor border-b-2 border-brightColor' : 'text-gray-600'}`}
                onClick={() => setActiveTab('calendar')}
              >
                Reservation Calendar
              </button>
            )*/}
          </div>

          <div className="mt-4">
            {activeTab === 'profile' && (
              <div>
                {/* Contact Information */}
                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-black">Contacts</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      {editMode ? (
                        <div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <p>{formData.email}</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(formData.email)}
                            className="text-brightColor hover:text-brightColor/80"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role-Specific Information */}
                {user?.role === "business" && (
                  <div className="mb-6">
                    <h2 className="mb-4 text-xl font-bold text-black">Business Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                          </div>
                        ) : (
                          <p>{formData.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
                          </div>
                        ) : (
                          <p>{formData.companyName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Matricule</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="matricule"
                              value={formData.matricule || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.matricule && <p className="mt-1 text-sm text-red-500">{errors.matricule}</p>}
                          </div>
                        ) : (
                          <p>{formData.matricule}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Type</label>
                        {editMode ? (
                          <select
                            name="businessType"
                            value={formData.businessType || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                          >
                            <option value="bakery-pastry-shop">Bakery/Pastry Shop</option>
                            <option value="dairy-supermarket">Dairy/Supermarket</option>
                            <option value="grocery-market">Grocery/Market</option>
                            <option value="restaurant-hotel-catering">Restaurant/Hotel/Catering</option>
                            <option value="convenience-store">Convenience Store</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p>
                            {formData.businessType
                              ? formData.businessType.split('-').join(' / ')
                              : 'Not specified'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                          </div>
                        ) : (
                          <p>{formData.address}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="description"
                              value={formData.description || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                          </div>
                        ) : (
                          <p>{formData.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === "individual" && (
                  <div className="mb-6">
                    <h2 className="mb-4 text-xl font-bold text-black">Individual Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="phoneNumber"
                              value={formData.phoneNumber || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                          </div>
                        ) : (
                          <p>{formData.phoneNumber}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                          </div>
                        ) : (
                          <p>{formData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === "association" && (
                  <div className="mb-6">
                    <h2 className="mb-4 text-xl font-bold text-black">Association Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="organizationName"
                              value={formData.organizationName || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.organizationName && <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>}
                          </div>
                        ) : (
                          <p>{formData.organizationName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Matricule</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="matricule"
                              value={formData.matricule || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.matricule && <p className="mt-1 text-sm text-red-500">{errors.matricule}</p>}
                          </div>
                        ) : (
                          <p>{formData.matricule}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        {editMode ? (
                          <div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address || ""}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                          </div>
                        ) : (
                          <p>{formData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics Section */}
                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-black">Statistics</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
                      <p className="text-2xl font-bold text-brightColor">{statisticsData.totalDonations}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Completed Donations</h3>
                      <p className="text-2xl font-bold text-brightColor">{statisticsData.completedDonations}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Ongoing Donations</h3>
                      <p className="text-2xl font-bold text-brightColor">{statisticsData.ongoingDonations}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Food Saved (kg)</h3>
                      <p className="text-2xl font-bold text-brightColor">{statisticsData.foodSaved}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">CO2 Saved (kg)</h3>
                      <p className="text-2xl font-bold text-brightColor">{statisticsData.co2Saved}</p>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-black">Charts</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Donations by Category</h3>
                      <PieChart data={chartData.donationsByCategory} />
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-700">Donations Over Time</h3>
                      <BarChart data={chartData.donationsOverTime} />
                    </div>
                  </div>
                </div>
              </div>
            )}

{activeTab === 'reservations' && (
  <div>
    <h3 className="mb-4 text-xl font-bold">My Reservations</h3>
    <ReservationsList
      type="reservations"
      statusFilter={activeStatusFilter}
      showActions={true}
    />
  </div>
)}

{activeTab === 'requests' && (
  <div>
    <h3 className="mb-4 text-xl font-bold">Reservation Requests</h3>
    <ReservationsList
      type="requests"
      statusFilter={activeStatusFilter}
      showApproveReject={true}
    />
  </div>
)}

{activeTab === 'stats' && (
  <div>
    <h3 className="mb-4 text-xl font-bold">My Food Rescue Impact</h3>
    {reservationStats ? (
      <>
        <ReservationStats stats={reservationStats} />
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h4 className="mb-4 text-lg font-semibold">Calendar Integration</h4>
          <p className="mb-4">
            Connect your Google Calendar to automatically add approved reservations.
          </p>
          <button
            onClick={handleGoogleCalendarConnect}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {user?.googleCalendarTokens ? 'Reconnect Google Calendar' : 'Connect Google Calendar'}
          </button>
          {user?.googleCalendarTokens && (
            <p className="mt-2 text-sm text-green-600">
              Google Calendar is connected!
            </p>
          )}
        </div>
      </>
    ) : (
      <LoadingSpinner />
    )}
  </div>
)}

            {/* Add the calendar tab content */}
            { /* activeTab === 'calendar' && (
              <div>
              <h3 className="mb-4 text-xl font-bold">Reservation Calendar</h3>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialEvents={[]} // Add your events here if any
                nowIndicator={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
              />
            </div>
            )*/}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-md w-96">
            <h2 className="mb-4 text-xl font-bold text-black">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                    required
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                    required
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded bg-brightColor hover:bg-brightColor/90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
