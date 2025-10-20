import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateProfile, uploadAvatar } from "../../services/api_auth";
import { associationSchema } from "../../validators/validationSchemas";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const AssociationAccount = () => {
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

  const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false
    });
    const togglePasswordVisibility = (field) => {
      setShowPasswords(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    };

  useEffect(() => {
    console.log("formData updated:", formData);
  const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          const profile = await getUserProfile(token);
          setProfileData(profile);
          setFormData({
           
              name: profile.name || "",
              email: profile.email || "",
              organizationName: profile.organizationName || "",
              address: profile.address || "",
              avatar: profile.avatar,
              matricule: profile.matricule || "", 
              ...profile
            });
            
          
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
  
      fetchProfile();
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
      if (user?.role === 'association') {
        validationSchema = associationSchema.pick({
          name: true,
          email: true,
          organizationName: true,
          address: true,
          matricule: true,
          phone: true 
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
      setErrors({});
      return true;
    };
  
    const handleSave = async () => {
      // Valide d'abord tous les champs
      const isValid = validateProfileData();
      if (!isValid) {
        return;
      }
    
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const updatedProfile = await updateProfile(token, formData);
        setProfileData(updatedProfile);
        setEditMode(false);
        setErrors({});
        showNotification(
          "Informations changed successfully"
        );
      } catch (error) {
        console.error("Error updating profile:", error);
        setErrors({ 
          server: error.message || "Failed to update profile" 
        });
      }
    };
    
    const handleBlur = (fieldName) => {
      if (!formData[fieldName]) {
        validateProfileData();
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
      
      // Clear previous errors
      setPasswordErrors({});
    
      // Validation
      if (!passwordForm.currentPassword) {
        setPasswordErrors({ currentPassword: "Current password is required" });
        return;
      }
    
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordErrors({ confirmPassword: "Passwords do not match" });
        return;
      }
    
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/auth/change-password`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
          })
        });
    
        const data = await response.json(); // Parse response first
    
        if (!response.ok) {
          throw new Error(data.message || "Failed to change password");
        }
    
        toast.success("Password changed successfully");
        showNotification(
          "Password changed successfully"
        );
        setIsChangePasswordOpen(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error changing password:", error);
        if (error.message.includes("Current password is incorrect")) {
          setPasswordErrors({ currentPassword: "Current password is incorrect" });
        } else {
          toast.error(error.message || "Failed to change password");
        }
      }
    };
  
    const handleAvatarUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        setIsUploading(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const uploadData = new FormData();

        uploadData.append('avatar', file);
  
        const response = await uploadAvatar(token, uploadData);
        
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
  
    
    
    return (
      <div className="mt-10 min-h-screen p-5 pt-16 bg-gray-100">
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
        {/* Sticky Header */}
        <div className={`top-0 z-10 bg-white shadow-md p-4 ${isContentScrolled ? "shadow-lg" : ""}`}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Association Profile</h1>
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
            </div>
          </div>
        </div>
    
        <div className="mt-5 space-y-6" onScroll={handleScroll}>
          {/* Profile Header with Avatar */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  {isUploading ? (
                    <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full">
                      <span className="text-gray-500">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
      <img
        src={formData.avatar || "https://via.placeholder.com/150"}
        alt="Association Logo"
        className="w-24 h-24 rounded-full"
      />
      <span className="text-sm font-medium mt-2">Your Logo</span>
    </div>
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
                      <FaEdit className="w-5 h-5 text-brightColor" />
                    </label>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{formData.organizationName || formData.name || "Association Name"}</h2>
                  
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
    
          {/* Association Information Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold text-black">Association Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('organizationName')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                        errors.organizationName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {errors.organizationName && (
                      <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{formData.organizationName || "Not provided"}</p>
                )}
              </div>
    
              {/* Registration Number */}
              <div>
              <label className="block text-sm font-medium text-gray-700">Matricule</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="matricule"
                      value={formData.matricule || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('matricule')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                        errors.matricule ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {errors.matricule && (
                      <p className="mt-1 text-sm text-red-500">{errors.matricule}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{formData.matricule || "Not provided"}</p>
                )}
              </div>
    
                
              <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{formData.email || "Not provided"}</p>
                )}
              </div>
              
              <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{formData.phone || "Not provided"}</p>
                )}
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('address')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                        errors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{formData.address || "Not provided"}</p>
                )}
              </div>
    
              
          </div>
          </div>
        </div>
    
        {/* Change Password Modal */}
        {isChangePasswordOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      
      <form onSubmit={handlePasswordSubmit}>
        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "password" : "text"}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "password" : "text"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "password" : "text"}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsChangePasswordOpen(false);
              setPasswordErrors({});
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brightColor text-white rounded hover:bg-brightColor/90"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    );}

export default AssociationAccount;