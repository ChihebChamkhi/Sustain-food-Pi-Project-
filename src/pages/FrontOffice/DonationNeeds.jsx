import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HelpOfferModal from "../../components/HelpOfferModal";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  MapPinIcon,
  InboxIcon,
  ChevronRightIcon,
  ArrowRightCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TUNISIA_BOUNDS = [
  [30.230236, 7.521980],
  [37.761205, 11.880713]
];

const DonationNeeds = () => {
  const [searchLocation, setSearchLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [mapCenter, setMapCenter] = useState({
    lat: 48.856614,
    lng: 2.3522219,
  });
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); 
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const { user } = useAuth();
  const [selectedNeedId, setSelectedNeedId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleOpenModal = (needId) => {
    setSelectedNeedId(needId);
  };

  const handleCloseModal = () => {
    setSelectedNeedId(null);
  };

  useEffect(() => {
    document.title = "Needs";
  }, []);

  useEffect(() => {

    fetchNeeds();
    getUserLocation();
  }, [filter, urgencyFilter, searchTerm]); 

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userCoords);
          setMapCenter(userCoords);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };
  
  const fetchNeeds = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/donation-needs";
  
      const queryParams = [];
      
      if (filter !== "all") {
        queryParams.push(`needType=${filter}`);
      }
  
      if (urgencyFilter !== 'all') {
        queryParams.push(`urgency=${urgencyFilter}`);
      }
  
      if (searchTerm.trim()) {
        queryParams.push(`search=${searchTerm}`);
      }
  
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Failed to fetch donation needs");
      }
  
      const data = await response.json();
      
     
      const currentDate = new Date();
      const activeNeeds = data.filter(need => new Date(need.deadline) > currentDate);
      
      setNeeds(activeNeeds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching needs:", error);
      setLoading(false);
    }
  };

  const isExpiringSoon = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 24 && hoursDiff > 0;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNeeds();
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

  const filteredNeeds = needs.filter(need => {
    const matchesCategory = filter === 'all' || need.needType === filter;
    const matchesUrgency = urgencyFilter === 'all' || need.urgency === urgencyFilter;
    const matchesSearch = searchTerm === '' || 
      need.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      need.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesUrgency && matchesSearch;
  });

  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      {/* Hero Header */}
      <div 
        className="relative px-4 py-16 overflow-hidden sm:px-6 lg:px-8"
        style={{
          backgroundImage: "linear-gradient(rgba(249, 115, 22, 0.85), rgba(234, 88, 12, 0.85)), url('https://plus.unsplash.com/premium_photo-1683141173692-aba4763bce41?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
                Food Donation Needs
              </h1>
              <p className="max-w-2xl mt-3 text-lg text-orange-100 drop-shadow-md">
                Connect with organizations fighting hunger in our community
              </p>
            </div>
            
            {user && (
              <Link
                to="/add-donation-need"
                className="inline-flex items-center px-6 py-3 mt-6 text-base font-medium text-white transition-colors duration-200 bg-orange-700 border border-transparent rounded-md shadow-sm md:mt-0 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                Post New Need
              </Link>
            )}
          </div>
        </div>
        
      </div>

      {/* Your Needs Section - Only for Associations */}
{user?.role === "association" && (
  <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center text-xl font-bold text-gray-900">
        Your needs
      </h2>
      <Link 
        to="/my-donation-needs" 
        className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-500"
      >
        Manage All <ChevronRightIcon className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {loading ? (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {needs
          .filter(n => n.associationId?._id === user?._id)
          .slice(0, 3) // Limite à 3 besoins
          .map((need) => (
            <div key={need._id} className="p-4 transition-colors bg-white border border-gray-100 rounded-lg shadow hover:border-orange-200">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900 line-clamp-1">{need.title}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  need.urgency === "critical" ? "bg-red-100 text-red-800" :
                  need.urgency === "urgent" ? "bg-orange-100 text-orange-800" : 
                  "bg-green-100 text-green-800"
                }`}>
                  {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                </span>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{need.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">
                  {formatDate(need.deadline)}
                </span>
                
              </div>
            </div>
          ))
        }

        {/* Carte "Voir plus"  */}
        {needs.filter(n => n.associationId?._id === user?._id).length > 3 && (
          <Link 
            to="/my-donation-needs" 
            className="flex flex-col items-center justify-center p-4 transition-colors border border-orange-100 rounded-lg shadow bg-orange-50 hover:border-orange-300 group"
          >
            <div className="mb-2 text-orange-600 group-hover:text-orange-700">
              <ArrowRightCircleIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
              See all your needs
            </span>
            <span className="mt-1 text-xs text-orange-500">
              ({needs.filter(n => n.associationId?._id === user?._id).length} au total)
            </span>
          </Link>
        )}
      </div>
    )}
  </div>
)}
      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

        
        {/* Filters and Search */}
        <div className="p-6 mb-8 bg-white shadow-sm rounded-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Filter Chips */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-sm font-medium text-gray-500">FILTER BY CATEGORY</h2>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'bakery', 'dairy', 'fresh-produce', 'cooked-meals', 'packaged-goods', 'other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filter === type
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === 'all' ? 'All' : type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="mb-2 text-sm font-medium text-gray-500">FILTER BY URGENCY</h2>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'critical', 'urgent', 'flexible'].map((urgency) => (
                      <button
                        key={urgency}
                        onClick={() => setUrgencyFilter(urgency)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          urgencyFilter === urgency
                            ? urgency === 'critical' ? 'bg-red-500 text-white' :
                              urgency === 'urgent' ? 'bg-orange-500 text-white' :
                              'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {urgency === 'all' ? 'All' : urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search and View Toggle */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search needs..."
                  className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
                <button type="submit" className="sr-only">Search</button>
              </form>
              
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    viewMode === "list" 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4 mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    viewMode === "map" 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredNeeds.length === 0 ? (
              <div className="p-12 text-center bg-white shadow-sm rounded-xl">
                <InboxIcon className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No donation needs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or create a new donation need
                </p>
                {user && (
                  <div className="mt-6">
                    <Link
                      to="/add-donation-need"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                      Post New Need
                    </Link>
                  </div>
                )}
              </div>
            ) : viewMode === "list" ? (
              /* List View */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNeeds.map((need) => (
                  <div
                    key={need._id}
                    className="overflow-hidden transition-shadow duration-200 bg-white shadow-sm rounded-xl hover:shadow-md"
                  >
                    {/* Urgency Indicator */}
                    <div className={`h-2 ${
                      need.urgency === "critical" ? "bg-red-500" :
                      need.urgency === "urgent" ? "bg-orange-500" : "bg-green-500"
                    }`}></div>
                    
                    {/* Inside the need card component */}
                    <div className="p-6">
  <div className="flex items-start justify-between">
    <h3 className="text-lg font-bold text-gray-900">{need.title}</h3>
    <div className="flex flex-col items-end">
      {isExpiringSoon(need.deadline) && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
          Expiring Soon!
        </span>
      )}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        need.urgency === "critical" ? "bg-red-100 text-red-800" :
        need.urgency === "urgent" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
      }`}>
        {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
      </span>
    </div>
  </div>

  <p className="mt-2 text-gray-600 line-clamp-3">{need.description}</p>

  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <p className="text-xs text-gray-500">Type</p>
      <p className="text-sm font-medium capitalize">
        {need.needType.replace(/-/g, ' ')}
      </p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Quantity</p>
      <p className="text-sm font-medium">
        {need.quantity} {need.unit}
      </p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Deadline</p>
      <p className="text-sm font-medium">
        {formatDate(need.deadline)}
      </p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Pickup Window</p>
      <p className="text-sm font-medium">
        {need.pickupWindow.start} - {need.pickupWindow.end}
      </p>
    </div>
  </div>

  <div className="mt-4">
    <p className="text-xs text-gray-500">Location</p>
    <p className="text-sm font-medium">{need.location}</p>
  </div>

  {need.tags && need.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-4">
      {need.tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}

  <div className="flex items-center justify-between mt-6">
    <div className="flex items-center">
      {need.associationId?.logo || need.associationId?.avatar ? (
        <img 
          src={need.associationId.logo || need.associationId.avatar} 
          alt={need.associationId.organizationName || need.associationId.name || "Association"} 
          className="object-cover w-8 h-8 rounded-full"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "/default-association.png";
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <UserCircleIcon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <span className="ml-2 text-sm text-gray-500">
        {need.associationId?.organizationName || 
         need.associationId?.name || 
         "Association"}
      </span>
    </div>
    
    {/* Moved the "Offer Help" button to the right corner */}
    <div className="flex items-center">
      {user?.role !== "association" && (
        <button
          onClick={() => handleOpenModal(need._id)}
          className="text-sm font-medium text-orange-600 hover:text-orange-500"
        >
          Offer Help →
        </button>
      )}
    </div>
  </div>
</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
  <div className="h-[600px] relative">
    <MapContainer 
      center={[34, 9]} 
      zoom={7}
      minZoom={7}
      maxBounds={TUNISIA_BOUNDS}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />


    {searchLocation && (
        <Circle
          center={[searchLocation.lat, searchLocation.lng]}
          radius={radius * 1000} // Convert km to meters
          color="blue"
          fillColor="blue"
          fillOpacity={0.1}
        />
      )}

      {/* Add markers for each need */}
      {filteredNeeds.map((need) => {
        if (!need.location?.coordinates) return null;
      
      
        return (
          <Marker 
            key={need._id} 
            position={[need.location.coordinates.lat, need.location.coordinates.lng]}
            icon={L.icon({
              iconUrl: need.urgency === "critical" ? 
                'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png' :
                need.urgency === "urgent" ? 
                'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png' :
                'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="max-w-xs">
                <h4 className="font-bold">{need.title}</h4>
                <p className="text-sm">{need.description}</p>
                <p className="mt-1 text-xs">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    need.urgency === "critical" ? "bg-red-500" :
                    need.urgency === "urgent" ? "bg-orange-500" : "bg-green-500"
                  }`}></span>
                  {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                </p>
                <button
                  onClick={() => handleOpenModal(need._id)}
                  className="mt-2 text-xs text-orange-600 hover:text-orange-500"
                >
                  Offer Help →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>

    <div className="absolute z-10 p-4 bg-white rounded-lg shadow-md top-4 right-4">
      <h3 className="mb-2 text-sm font-medium text-gray-900">Map Legend</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
          <span className="text-xs">Critical (24h)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
          <span className="text-xs">Urgent (3 days)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
          <span className="text-xs">Flexible (1 week+)</span>
        </div>
      </div>
    </div>
  </div>

  <div className="p-6 border-t border-gray-200">
    <h3 className="mb-4 text-lg font-medium text-gray-900">Nearby Donation Needs</h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filteredNeeds.slice(0, 4).map((need) => (
        <Link
          key={need._id}
          to={`/donation-needs/${need._id}`}
          className="block p-4 transition-colors rounded-lg group bg-gray-50 hover:bg-orange-50"
        >
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
              {need.title}
            </h4>
            <span
              className={`w-2 h-2 rounded-full mt-1 ${
                need.urgency === "critical" ? "bg-red-500" :
                need.urgency === "urgent" ? "bg-orange-500" : "bg-green-500"
              }`}
            ></span>
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {need.description}
          </p>
          <p className="mt-2 text-xs text-gray-400">{need.location}</p>
        </Link>
      ))}
    </div>
  </div>
</div>
            )}
          </>
        )}
      </div>

      {/* Help Offer Modal */}
      {selectedNeedId && (
        <HelpOfferModal needId={selectedNeedId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default DonationNeeds;
