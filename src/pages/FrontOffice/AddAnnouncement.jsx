import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../../layouts/Button";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { createAnnouncement } from '../../services/api_announcements';
import Swal from 'sweetalert2';
import AnnouncementMapPicker from '../../components/AnnouncementMapPicker';
import AIFoodDetectionWrapper from '../../components/AIFoodDetectionWrapper';

const AddAnnouncement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "food",
    foodType: "vegetarian",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    price: "",
    isFree: false,
    location: "",
    coordinates: null,
    pickupTime: {
      start: "",
      end: ""
    },
    images: [],
    tags: [],
    userType: user?.role || "individual"
  });

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setFormData(prev => ({
            ...prev,
            coordinates: {
              type: "Point",
              coordinates: [position.coords.longitude, position.coords.latitude]
            },
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          // Set default coordinates if geolocation fails
          const defaultCoords = {
            latitude: 51.505,
            longitude: -0.09
          };
          setUserLocation(defaultCoords);
          setFormData(prev => ({
            ...prev,
            coordinates: {
              type: "Point",
              coordinates: [defaultCoords.longitude, defaultCoords.latitude]
            },
            location: `${defaultCoords.latitude.toFixed(4)}, ${defaultCoords.longitude.toFixed(4)}`
          }));
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Handle browsers that don't support geolocation
      const defaultCoords = {
        latitude: 51.505,
        longitude: -0.09
      };
      setUserLocation(defaultCoords);
      setFormData(prev => ({
        ...prev,
        coordinates: {
          type: "Point",
          coordinates: [defaultCoords.longitude, defaultCoords.latitude]
        },
        location: `${defaultCoords.latitude.toFixed(4)}, ${defaultCoords.longitude.toFixed(4)}`
      }));
    }
  }, []);

  useEffect(() => {
    document.title = "Add Announcement";
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('pickupTime.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pickupTime: {
          ...prev.pickupTime,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);

    // Add to form data
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove an image
  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Handle tag input
  const handleTags = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value.trim()],
      });
      e.target.value = "";
    }
  };

  // Remove a tag
  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.category === "food") {
      if (!formData.quantity) newErrors.quantity = "Quantity is required";
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    }
    if (!formData.price && !formData.isFree) newErrors.price = "Price is required or mark as free";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.pickupTime.start) newErrors.pickupStart = "Pickup start time is required";
    if (!formData.pickupTime.end) newErrors.pickupEnd = "Pickup end time is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Append all basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.isFree ? '0' : formData.price.toString());
      formDataToSend.append('isFree', formData.isFree.toString());
      formDataToSend.append('location', formData.location);
      formDataToSend.append('userType', formData.userType);

      // Append coordinates as separate fields (not as JSON string)
      formDataToSend.append('coordinates[type]', 'Point');
      formDataToSend.append('coordinates[coordinates][0]', formData.coordinates.coordinates[0].toString());
      formDataToSend.append('coordinates[coordinates][1]', formData.coordinates.coordinates[1].toString());

      // Append pickup time
      formDataToSend.append('pickupTime[start]', formData.pickupTime.start);
      formDataToSend.append('pickupTime[end]', formData.pickupTime.end);

      // Append food-specific fields if needed
      if (formData.category === 'food') {
        formDataToSend.append('foodType', formData.foodType);
        formDataToSend.append('quantity', formData.quantity.toString());
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('expiryDate', formData.expiryDate);
      }

      // Append tags
      formData.tags.forEach(tag => {
        formDataToSend.append('tags', tag);
      });

      // Append images
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const createdAnnouncement = await createAnnouncement(formDataToSend);
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Your announcement has been created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff7043',
      }).then(() => {
        navigate('/'); // Redirect to home page
      });
    } catch (error) {
      console.error("Detailed error:", error);
      Swal.fire({
        title: 'Error',
        text: error.message || "Failed to create announcement. Please check the data and try again.",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff7043',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate sustainability impact
  const calculateImpact = () => {
    const foodWasteSaved = formData.category === 'food' ? parseFloat(formData.quantity) || 0 : 0;
    const co2Reduced = foodWasteSaved * 2.5;
    return { foodWasteSaved, co2Reduced };
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;

    // Try to parse coordinates from input
    const coords = value.split(',').map(coord => parseFloat(coord.trim()));

    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      setFormData(prev => ({
        ...prev,
        location: value,
        coordinates: {
          type: "Point",
          coordinates: [coords[1], coords[0]]  // Note: longitude first
        }
      }));
      setMapKey(prev => prev + 1);
    } else {
      // Just update the location text if we can't parse coordinates
      setFormData(prev => ({
        ...prev,
        location: value
      }));
    }
  };

  return (
    <div className="min-h-screen px-5 py-10 bg-gray-50 sm:px-10">
      {/* Page Title */}
      <h1 className="mb-10 text-4xl font-bold text-center text-gray-800">
        Add New Announcement
      </h1>

      <AIFoodDetectionWrapper
        onApplyGeneratedData={(data) => {
          setFormData(prev => ({
            ...prev,
            title: data.title || prev.title,
            description: data.description || prev.description,
            foodType: data.foodType || prev.foodType,
            tags: [...new Set([...prev.tags, ...(data.tags || [])])]
          }));
        }}
      />

      {/* Multi-step Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div>
            <h2 className="mb-5 text-2xl font-semibold">Step 1: Basic Information</h2>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                rows="4"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="food">Food</option>
                <option value="event">Event</option>
                <option value="donation">Donation</option>
                <option value="workshop">Workshop</option>
                <option value="community-drive">Community Drive</option>
              </select>
            </div>

            {/* Food-specific fields */}
            {formData.category === 'food' && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Food Type *</label>
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="meat">Meat</option>
                    <option value="bakery">Bakery</option>
                    <option value="dairy">Dairy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      step="0.1"
                      min="0.1"
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Unit *</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="pieces">Pieces</option>
                      <option value="liters">Liters</option>
                      <option value="portions">Portions</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Expiry Date *</label>
                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-2 border rounded-lg"
                  />
                  {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="px-3 py-2 text-white bg-orange-600 hover:bg-orange-700"
                title="Next"
              />
            </div>
          </div>
        )}

        {/* Step 2: Additional Details */}
        {step === 2 && (
          <div>
            <h2 className="mb-5 text-2xl font-semibold">Step 2: Additional Details</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={formData.isFree}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="font-semibold text-gray-700">Is this free?</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Pickup Start *</label>
                <input
                  type="datetime-local"
                  name="pickupTime.start"
                  value={formatDateForInput(formData.pickupTime.start)}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.pickupStart && <p className="text-sm text-red-500">{errors.pickupStart}</p>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Pickup End *</label>
                <input
                  type="datetime-local"
                  name="pickupTime.end"
                  value={formatDateForInput(formData.pickupTime.end)}
                  onChange={handleChange}
                  min={formData.pickupTime.start || new Date().toISOString().slice(0, 16)}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.pickupEnd && <p className="text-sm text-red-500">{errors.pickupEnd}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Images *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-lg"
              />
              {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

              {/* Image previews */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-24 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Tags</label>
              <input
                type="text"
                onKeyDown={handleTags}
                placeholder="Press Enter to add tags"
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex flex-wrap mt-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center px-2 py-1 mb-2 mr-2 bg-gray-200 rounded-lg"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Business-specific fields */}
            {user?.role === 'business' && (
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-semibold">Business Details</h3>
                <p className="text-gray-600">
                  Your business information will be automatically included from your profile.
                </p>
              </div>
            )}

            {/* Individual-specific fields */}
            {user?.role === 'individual' && (
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-semibold">Your Preferences</h3>
                <p className="text-gray-600">
                  Your dietary preferences will be automatically included from your profile.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Select Location on Map</label>
              <AnnouncementMapPicker
                initialPosition={
                  formData.coordinates ? {
                    lat: formData.coordinates.coordinates[1],
                    lng: formData.coordinates.coordinates[0]
                  } : null
                }
                onLocationSelect={(locationData) => {
                  setFormData({
                    ...formData,
                    location: locationData.location,
                    coordinates: {
                      type: "Point",
                      coordinates: locationData.coordinates
                    }
                  });
                  setMapKey(prev => prev + 1);
                }}
                height="300px"
              />
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-xl font-semibold">Sustainability Impact</h3>
              <p className="text-gray-600">
                By adding this announcement, you will save approximately{" "}
                <strong>{calculateImpact().foodWasteSaved} kg</strong> of food waste and reduce{" "}
                <strong>{calculateImpact().co2Reduced} kg</strong> of CO2 emissions.
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                className="px-3 py-2 text-white bg-gray-500 border-none hover:bg-gray-600"
                title="Back"
              />
              <Button
                type="submit"
                className="px-3 py-2 text-white transition duration-300 bg-orange-600 hover:bg-orange-700"
                title={loading ? <LoadingSpinner /> : "Submit"}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddAnnouncement;
