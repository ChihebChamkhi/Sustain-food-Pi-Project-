import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  PlusIcon,
  MagnifyingGlassIcon,
  ListBulletIcon, InboxIcon,
  FunnelIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RecommendedSection from './RecommendedSection';
import AnnouncementCardAssoc from './AnnouncementCardAssoc';



const AssociationAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    foodType: 'all',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation , setUserLocation] = useState();

  // Fetch announcements from API
  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.foodType !== 'all') params.append('foodType', filters.foodType);
      if (filters.sortBy !== 'newest') params.append('sortBy', filters.sortBy);

      const response = await fetch(
        `http://localhost:5000/api/announcements/association-announcements?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    document.title = "Announcements";
  }, []);

  // Apply filters and search
  useEffect(() => {
    const filtered = announcements.filter(announcement => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) 
      
      // Category filter
      const matchesCategory = filters.category === 'all' || 
        announcement.category === filters.category;
      
      // Food type filter
      const matchesFoodType = filters.foodType === 'all' || 
        announcement.foodType === filters.foodType;
      
      
      return matchesSearch && matchesCategory && matchesFoodType ;
    });

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      if (filters.sortBy === 'expiry') {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredAnnouncements(sorted);
  }, [announcements, searchTerm, filters]);

  // Initial data and location fetch
  useEffect(() => {
    fetchAnnouncements();
  
  }, [fetchAnnouncements]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering happens automatically in the useEffect
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'all',
      foodType: 'all',
      sortBy: 'newest'
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      {/* Hero Header */}
      <div 
        className="relative px-4 py-16 overflow-hidden sm:px-6 lg:px-8"
        style={{
          backgroundImage: "linear-gradient(rgba(249, 115, 22, 0.85), rgba(234, 88, 12, 0.85)), url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-white drop-shadow-md">
                Surplus Food Announcements
              </h1>
              <p className="max-w-2xl mt-3 text-lg text-orange-100 drop-shadow-md">
                Find and reserve surplus food from local businesses and individuals
              </p>
            </div>
            
            {user && (
              <Link
                to="/add-announcement"
                className="inline-flex items-center px-6 py-3 mt-6 text-base font-medium text-white transition-colors duration-200 bg-orange-700 border border-transparent rounded-md shadow-sm md:mt-0 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                Add New Announcement
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

      {/* Section Recommandations */}
      <RecommendedSection />

        {/* Filters and Search */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 text-gray-900 border border-orange-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange"
                />
              </form>
            </div>

            {/* View Toggle and Filter Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
                aria-label="List view"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
              >
                <FunnelIcon className="w-4 h-4 mr-1" />
                Filters
              </button>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Category Filter */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="food">Food</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>

                {/* Food Type Filter (shown only when category is food) */}
                {filters.category === 'food' && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Food Type</label>
                    <select
                      value={filters.foodType}
                      onChange={(e) => setFilters({...filters, foodType: e.target.value})}
                      className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="all">All Types</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="meat">Meat</option>
                      <option value="bakery">Bakery</option>
                      <option value="dairy">Dairy</option>
                    </select>
                  </div>
                )}

             
              </div>

              {/* Sort and Reset */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="expiry">Expiry Date</option>
              
                  </select>
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
            {loading && (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="overflow-hidden bg-white rounded-xl shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <div className="flex items-center justify-between">
              <p>{error}</p>
              <button 
                onClick={fetchAnnouncements}
                className="flex items-center text-sm font-medium text-red-800 hover:text-red-900"
              >
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'result' : 'results'} found
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <InboxIcon className="w-4 h-4 mr-1" />
              <span>Sorted by: {filters.sortBy === 'distance' ? 'Distance' : filters.sortBy === 'expiry' ? 'Expiry Date' : 'Newest'}</span>
            </div>
          </div>
        )}

        {/* Map View */}
        {!loading && !error && viewMode === 'map' && userLocation && (
          <div className="h-[500px] mb-8 rounded-lg overflow-hidden shadow-md">
            <MapContainer 
              center={[userLocation.lat, userLocation.lng]} 
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* User Location Marker */}
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
              
              {/* Announcement Markers */}
              {filteredAnnouncements.map(announcement => (
                <Marker 
                  key={announcement._id} 
                  position={[
                    announcement.coordinates.coordinates[1],
                    announcement.coordinates.coordinates[0]
                  ]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{announcement.title}</h3>
                      <p className="text-sm">{announcement.foodType}</p>
                      <p className="text-sm">{announcement.distance?.toFixed(1)} km away</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map(announcement => (
              <AnnouncementCardAssoc
                key={announcement._id} 
                announcement={announcement} 
                
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAnnouncements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <InboxIcon className="w-12 h-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No announcements found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filters
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociationAnnouncements;