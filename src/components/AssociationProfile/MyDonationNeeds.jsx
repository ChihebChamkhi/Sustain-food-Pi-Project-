import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiMapPin, FiTag, FiBox } from "react-icons/fi";
import { FaFire, FaExclamationTriangle, FaLeaf } from "react-icons/fa";

const MyDonationNeeds = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [currentNeed, setCurrentNeed] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMyNeeds();
  }, []);

  const fetchMyNeeds = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5000/api/donation-needs/myneeds",
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch your donation needs");
      }

      const data = await response.json();
      setNeeds(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching needs:", error);
      setError("Failed to load your donation needs. Please try again later.");
      setLoading(false);
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "critical":
        return <FaFire className="text-red-500" />;
      case "urgent":
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaLeaf className="text-green-500" />;
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-100";
      case "urgent":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      default:
        return "bg-green-50 text-green-700 border-green-100";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/donation-needs/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete donation need");
      }

      setSuccessMessage('Need deleted successfully!');
  
      setNeeds(needs.filter((need) => need._id !== id));
    } catch (error) {
      console.error("Error deleting need:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!currentNeed?.title?.trim()) {
      errors.title = "Title is required";
    } else if (currentNeed.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters";
    }
  
    // Description validation
    if (!currentNeed?.description?.trim()) {
      errors.description = "Description is required";
    } else if (currentNeed.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
  
    // Need type validation
    if (!currentNeed?.needType) {
      errors.needType = "Need type is required";
    }
  
    // Quantity validation
    if (!currentNeed?.quantity) {
      errors.quantity = "Quantity is required";
    } else if (currentNeed.quantity < 1) {
      errors.quantity = "Quantity must be positive";
    }
  
    // Unit validation
    if (!currentNeed?.unit) {
      errors.unit = "Unit is required";
    }
  
    // Urgency validation
    if (!currentNeed?.urgency) {
      errors.urgency = "Urgency is required";
    }
  
    // Deadline validation
    if (!currentNeed?.deadline) {
      errors.deadline = "Deadline is required";
    } else if (new Date(currentNeed.deadline) < new Date()) {
      errors.deadline = "Deadline must be in the future";
    }
  
    // Location validation
    if (!currentNeed?.location?.trim()) {
      errors.location = "Location is required";
    } else if (currentNeed.location.trim().length < 5) {
      errors.location = "Location must be at least 5 characters";
    }
  
    // Pickup window validation
    if (!currentNeed?.pickupWindow?.start) {
      errors.pickupWindowStart = "Pickup start time is required";
    }
    if (!currentNeed?.pickupWindow?.end) {
      errors.pickupWindowEnd = "Pickup end time is required";
    } else if (currentNeed.pickupWindow.start && currentNeed.pickupWindow.end && 
               currentNeed.pickupWindow.start >= currentNeed.pickupWindow.end) {
      errors.pickupWindowEnd = "End time must be after start time";
    }
  
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSaveEdit = async () => {
    const formErrors = validateForm();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }
    
    setIsUpdating(true);
    setErrors({});
    setIsDeleting(true);
    
    try {
      const updateData = {
        title: currentNeed.title,
        description: currentNeed.description,
        needType: currentNeed.needType,
        quantity: currentNeed.quantity,
        unit: currentNeed.unit,
        urgency: currentNeed.urgency,
        deadline: currentNeed.deadline,
        location: currentNeed.location,
        pickupWindow: currentNeed.pickupWindow,
        tags: currentNeed.tags || [],
      };

      const response = await fetch(
        `http://localhost:5000/api/donation-needs/${currentNeed._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          throw new Error(data.message || "Failed to update donation need");
        }
        return;
      }

      setNeeds(needs.map(need => 
        need._id === data._id ? data : need
      ));

      setEditModalOpen(false);
      setSuccessMessage('Need updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating need:", error);
      setErrors({ server: error.message || "Failed to update. Please try again." });
    } finally {
      setIsUpdating(false);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-5 z-50 p-4 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Donation Needs</h1>
              <p className="mt-2 text-gray-600">
                Manage all your posted donation needs in one place
              </p>
            </div>
            <Link
              to="/add-donation-need"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              <FiPlus className="mr-2" />
              Add New Need
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {needs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
                  <FiBox className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">No needs posted yet</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  You haven't created any donation needs yet. Click the button below to post your first need.
                </p>
                <div className="mt-6">
                  <Link
                    to="/add-donation-need"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <FiPlus className="mr-2" />
                    Post Your First Need
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {needs.map((need) => (
                  <div
                    key={need._id}
                    className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Urgency Indicator */}
                    <div className={`px-4 py-2 border-b ${getUrgencyClass(need.urgency)}`}>
                      <div className="flex items-center">
                        {getUrgencyIcon(need.urgency)}
                        <span className="ml-2 text-sm font-medium">
                          {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">{need.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {need.needType.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-600 line-clamp-2">{need.description}</p>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                            <FiBox />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="text-sm font-medium text-gray-900">
                              {need.quantity} {need.unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                            <FiClock />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(need.deadline)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                            <FiClock />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Pickup Window</p>
                            <p className="text-sm font-medium text-gray-900">
                              {need.pickupWindow.start} - {need.pickupWindow.end}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                            <FiMapPin />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">
                              {need.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {need.tags && need.tags.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center">
                            <FiTag className="flex-shrink-0 h-4 w-4 text-gray-400" />
                            <div className="ml-2 flex flex-wrap gap-2">
                              {need.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Posted: {formatDate(need.createdAt)}
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setCurrentNeed(need);
                              setViewModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <FiEye className="mr-1.5 h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setCurrentNeed(need);
                              setEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <FiEdit2 className="mr-1.5 h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCurrentNeed(need);
                              setDeleteModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiTrash2 className="mr-1.5 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* View Need Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-900">{currentNeed?.title}</h3>
                <button 
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyClass(currentNeed?.urgency)}`}>
                    {currentNeed?.urgency?.charAt(0).toUpperCase() + currentNeed?.urgency?.slice(1)}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    Posted: {formatDate(currentNeed?.createdAt)}
                  </span>
                </div>

                <p className="text-gray-700">{currentNeed?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Need Type</h4>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {currentNeed?.needType?.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Quantity Needed</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentNeed?.quantity} {currentNeed?.unit}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(currentNeed?.deadline)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Pickup Window</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentNeed?.pickupWindow?.start} - {currentNeed?.pickupWindow?.end}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentNeed?.location}
                    </p>
                  </div>
                </div>

                {currentNeed?.tags?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentNeed?.tags?.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Need Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-900">Edit Need</h3>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Server Error */}
              {errors.server && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {errors.server}
                </div>
              )}

              <div className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentNeed?.title || ''}
                    onChange={(e) => setCurrentNeed({...currentNeed, title: e.target.value})}
                    className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={currentNeed?.description || ''}
                    onChange={(e) => setCurrentNeed({...currentNeed, description: e.target.value})}
                    className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Need Type */}
                <div>
                  <label htmlFor="needType" className="block text-sm font-medium text-gray-700">
                    Need Type *
                  </label>
                  <select
                    id="needType"
                    name="needType"
                    value={currentNeed?.needType || ''}
                    onChange={(e) => setCurrentNeed({...currentNeed, needType: e.target.value})}
                    className={`mt-1 block w-full border ${errors.needType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                    required
                  >
                    <option value="">Select a type</option>
                    <option value="bakery">Bakery</option>
                    <option value="dairy">Dairy</option>
                    <option value="fresh-produce">Fresh Produce</option>
                    <option value="cooked-meals">Cooked Meals</option>
                    <option value="packaged-goods">Packaged Goods</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.needType && (
                    <p className="mt-1 text-sm text-red-500">{errors.needType}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={currentNeed?.quantity || ''}
                        onChange={(e) => setCurrentNeed({...currentNeed, quantity: e.target.value})}
                        className={`block w-full border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                        required
                      />
                    </div>
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Unit */}
                  <div>
  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
    Unit *
  </label>
  <select
    id="unit"
    name="unit"
    value={currentNeed?.unit || ''}
    onChange={(e) => setCurrentNeed({...currentNeed, unit: e.target.value})}
    className={`mt-1 block w-full border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
    required
  >
    <option value="">Select unit</option>
    <option value="kg">Kilograms (kg)</option>
    <option value="g">Grams (g)</option>
    <option value="liters">Liters (L)</option>
    <option value="portions">Portions</option>
    <option value="units">Units</option>
  </select>
  {errors.unit && (
    <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
  )}
</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Urgency */}
                  <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                      Urgency Level *
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={currentNeed?.urgency || ''}
                      onChange={(e) => setCurrentNeed({...currentNeed, urgency: e.target.value})}
                      className={`mt-1 block w-full border ${errors.urgency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                      required
                    >
                      <option value="">Select urgency</option>
                      <option value="critical">Critical (within 24h)</option>
                      <option value="urgent">Urgent (within 3 days)</option>
                      <option value="flexible">Flexible (1 week+)</option>
                    </select>
                    {errors.urgency && (
                      <p className="mt-1 text-sm text-red-500">{errors.urgency}</p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div>
  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
    Deadline *
  </label>
  <input
    type="datetime-local"
    id="deadline"
    name="deadline"
    value={currentNeed?.deadline ? new Date(currentNeed.deadline).toISOString().slice(0, 16) : ''}
    onChange={(e) => setCurrentNeed({...currentNeed, deadline: e.target.value})}
    min={new Date().toISOString().slice(0, 16)}
    className={`mt-1 block w-full border ${errors.deadline ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
    required
  />
  {errors.deadline && (
    <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
  )}
</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Pickup Window Start */}
  <div>
    <label htmlFor="pickupWindowStart" className="block text-sm font-medium text-gray-700">
      Pickup Window Start *
    </label>
    <input
      type="time"
      id="pickupWindowStart"
      name="pickupWindowStart"
      value={currentNeed?.pickupWindow?.start || ''}
      onChange={(e) => setCurrentNeed({
        ...currentNeed, 
        pickupWindow: {
          ...currentNeed.pickupWindow,
          start: e.target.value
        }
      })}
      className={`mt-1 block w-full border ${errors.pickupWindowStart ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
      required
    />
    {errors.pickupWindowStart && (
      <p className="mt-1 text-sm text-red-500">{errors.pickupWindowStart}</p>
    )}
  </div>

  {/* Pickup Window End */}
  <div>
    <label htmlFor="pickupWindowEnd" className="block text-sm font-medium text-gray-700">
      Pickup Window End *
    </label>
    <input
      type="time"
      id="pickupWindowEnd"
      name="pickupWindowEnd"
      value={currentNeed?.pickupWindow?.end || ''}
      onChange={(e) => setCurrentNeed({
        ...currentNeed, 
        pickupWindow: {
          ...currentNeed.pickupWindow,
          end: e.target.value
        }
      })}
      className={`mt-1 block w-full border ${errors.pickupWindowEnd ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
      required
    />
    {errors.pickupWindowEnd && (
      <p className="mt-1 text-sm text-red-500">{errors.pickupWindowEnd}</p>
    )}
  </div>
</div>

                {/* Location */}
                <div>
  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
    Location *
  </label>
  <input
    type="text"
    id="location"
    name="location"
    value={currentNeed?.location || ''}
    onChange={(e) => setCurrentNeed({...currentNeed, location: e.target.value})}
    className={`mt-1 block w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
    required
  />
  {errors.location && (
    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
  )}
</div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={currentNeed?.tags?.join(', ') || ''}
                    onChange={(e) => setCurrentNeed({
                      ...currentNeed, 
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="vegetarian, gluten-free, etc."
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Need</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Are you sure you want to delete "{currentNeed?.title}"? This action cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setDeleteModalOpen(false)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={async () => {
            await handleDelete(currentNeed?._id);
            setDeleteModalOpen(false);
          }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MyDonationNeeds;