import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../../layouts/Button";
import { useAuth } from "../../context/AuthContext";
import { getAnnouncements } from '../../services/api_announcements';
import { startConversation, sendMessage, getMessages } from '../../services/api_chat';
import { useSocket } from '../../context/SocketContext';

// ChatModal component
const ChatModal = ({
  isOpen,
  onClose,
  conversationId,
  announcement,
  otherUser
}) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !conversationId) return;

    console.log("Socket connected:", socket);

    const loadMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getMessages(conversationId, user.token);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    if (socket) {
      socket.emit('joinConversation', conversationId);
      console.log(`Joined conversation: ${conversationId}`);

      const handleNewMessage = (message) => {
        console.log('Received new message:', message);
        if (message.conversationId === conversationId) {
          setMessages(prev => [...prev, message]);
        }
      };

      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.emit('leaveConversation', conversationId);
        console.log(`Left conversation: ${conversationId}`);
      };
    }
  }, [isOpen, conversationId, socket, user.token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(conversationId, newMessage, user.token);
      socket.emit('sendMessage', { conversationId, content: newMessage, senderId: user._id });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src={otherUser.avatar || otherUser.profilePicture || '/images/default-avatar.png'} 
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">{announcement.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 rounded-full border-brightColor border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages?.map((message) => {
                const isCurrentUser = message.senderId === user._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-sm p-2 px-4 rounded-lg shadow ${
                        isCurrentUser
                          ? 'bg-brightColor text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brightColor"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 text-white rounded-full bg-brightColor hover:bg-brightColorDark focus:outline-none disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Announcements = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    foodType: "all",
    priceRange: "all",
    distance: "5",
    sortBy: "newest"
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  
  // Chat related state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  useEffect(() => {
    document.title = "Announcements";
  });

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);

        const filtersParams = {
          category: filters.category !== 'all' ? filters.category : undefined,
          foodType: filters.foodType !== 'all' ? filters.foodType : undefined,
          minPrice: filters.priceRange !== 'all' ? filters.priceRange.split('-')[0] : undefined,
          maxPrice: filters.priceRange !== 'all' ? (filters.priceRange.includes('-') ? filters.priceRange.split('-')[1] : undefined) : undefined,
          distance: filters.distance !== 'all' ? filters.distance : undefined,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          search: searchTerm,
          sortBy: filters.sortBy
        };

        const data = await getAnnouncements(filtersParams);
        setAnnouncements(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [searchTerm, filters, user]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "all",
      foodType: "all",
      priceRange: "all",
      distance: "5",
      sortBy: "newest"
    });
  };

  // Calculate sustainability impact
  const calculateImpact = () => {
    const foodWasteSaved = announcements.reduce((sum, ann) => {
      return sum + (ann.category === 'food' ? ann.quantity || 0 : 0);
    }, 0);

    const co2Reduced = foodWasteSaved * 2.5;
    return { foodWasteSaved, co2Reduced };
  };

  // Format helpers
  const formatDistance = (distance) => distance < 1 ? `${(distance * 1000).toFixed(0)} m away` : `${distance.toFixed(1)} km away`;
  const formatPrice = (price, isFree) => isFree ? "Free" : `$${price.toFixed(2)}`;
  const formatPickupTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return `${start.toLocaleString(undefined, options)} - ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Categorize announcements
  const categorizedAnnouncements = announcements.reduce((acc, announcement) => {
    const category = announcement.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(announcement);
    return acc;
  }, {});

  // Get recommended announcements (based on user preferences if available)
  const recommendedAnnouncements = announcements.slice(0, 3);

  // Get urgent announcements (food items expiring soon)
  const urgentAnnouncements = announcements
    .filter(ann => ann.category === 'food' && new Date(ann.pickupTime.end) - Date.now() < 86400000)
    .slice(0, 3);

  // Function to open chat
  const handleOpenChat = async (announcement) => {
    try {
      console.log("Full announcement object:", announcement);

      if (!user?._id) {
        console.error("User not authenticated");
        return;
      }

      if (!announcement.createdBy) {
        console.error("Announcement owner not found");
      }

      const data = await startConversation(announcement._id, user.token);
      setCurrentConversation(data._id);
      setCurrentAnnouncement(announcement);
      setChatModalOpen(true);
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 text-center text-white bg-gradient-to-br from-orange-500 to-amber-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container relative px-5 mx-auto">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Reduce Waste, <span className="text-yellow-200">Share Resources</span>
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-orange-100 md:text-2xl">
            Connect with your community to save food and reduce environmental impact
          </p>
          <Link to="/add-announcement">
            <Button
              className="px-8 py-4 text-lg font-semibold text-orange-600 transition-all transform bg-white shadow-lg hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-xl"
              title="Add New Announcement"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-5 py-12 mx-auto sm:px-6">
        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for food, events, donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 pl-16 pr-6 text-lg border-0 shadow-lg rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:ring-opacity-50"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5">
              <button className="px-4 py-2 text-sm font-semibold text-white transition-all bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <FilterSection
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />

        {/* Sustainability Impact */}
        <ImpactSection impact={calculateImpact()} />

        {/* Urgent Announcements Section */}
        {urgentAnnouncements.length > 0 && (
          <AnnouncementSection
            title="Urgent - Expiring Soon!"
            description="These food items need to be claimed quickly"
            announcements={urgentAnnouncements}
            formatDistance={formatDistance}
            formatPrice={formatPrice}
            formatPickupTime={formatPickupTime}
            onOpenChat={handleOpenChat}
            highlightColor="bg-red-50 border-l-4 border-red-500"
          />
        )}

        {/* Recommended Section */}
        {recommendedAnnouncements.length > 0 && (
          <AnnouncementSection
            title="Recommended For You"
            description="Based on your preferences and location"
            announcements={recommendedAnnouncements}
            formatDistance={formatDistance}
            formatPrice={formatPrice}
            formatPickupTime={formatPickupTime}
            onOpenChat={handleOpenChat}
            highlightColor="bg-blue-50 border-l-4 border-blue-500"
          />
        )}

        {/* Categorized Announcements */}
        {Object.entries(categorizedAnnouncements).map(([category, items]) => (
          <AnnouncementSection
            key={category}
            title={`${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Offers`}
            announcements={items}
            formatDistance={formatDistance}
            formatPrice={formatPrice}
            formatPickupTime={formatPickupTime}
            onOpenChat={handleOpenChat}
            highlightColor="bg-white border-l-4 border-orange-500"
          />
        ))}

        {/* Map Integration */}
        {userLocation && (
          <MapSection
            userLocation={userLocation}
            announcements={announcements}
            formatPrice={formatPrice}
            formatPickupTime={formatPickupTime}
          />
        )}

        {/* Empty State */}
        {!loading && announcements.length === 0 && (
          <EmptyState clearFilters={clearFilters} />
        )}
      </div>

      {/* Chat Modal */}
      {chatModalOpen && currentAnnouncement && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          conversationId={currentConversation}
          announcement={currentAnnouncement}
          otherUser={currentAnnouncement.createdBy}
        />
      )}
    </div>
  );
};

// Sub-components

const FilterSection = ({ filters, handleFilterChange, clearFilters }) => (
  <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
    <FilterSelect
      value={filters.category}
      onChange={(e) => handleFilterChange("category", e.target.value)}
      options={[
        { value: "all", label: "All Categories" },
        { value: "food", label: "Food" },
        { value: "event", label: "Event" },
        { value: "donation", label: "Donation" },
        { value: "workshop", label: "Workshop" },
        { value: "community-drive", label: "Community Drive" }
      ]}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      }
    />

    {filters.category === 'food' && (
      <FilterSelect
        value={filters.foodType}
        onChange={(e) => handleFilterChange("foodType", e.target.value)}
        options={[
          { value: "all", label: "All Food Types" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "meat", label: "Meat" },
          { value: "bakery", label: "Bakery" },
          { value: "dairy", label: "Dairy" },
          { value: "other", label: "Other" }
        ]}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
      />
    )}

    <FilterSelect
      value={filters.priceRange}
      onChange={(e) => handleFilterChange("priceRange", e.target.value)}
      options={[
        { value: "all", label: "All Prices" },
        { value: "0-5", label: "$0 - $5" },
        { value: "5-10", label: "$5 - $10" },
        { value: "10-20", label: "$10 - $20" },
        { value: "20-", label: "$20+" }
      ]}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />

    <FilterSelect
      value={filters.distance}
      onChange={(e) => handleFilterChange("distance", e.target.value)}
      options={[
        { value: "1", label: "Within 1 km" },
        { value: "5", label: "Within 5 km" },
        { value: "10", label: "Within 10 km" },
        { value: "20", label: "Within 20 km" },
        { value: "all", label: "Any distance" }
      ]}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }
    />

    <FilterSelect
      value={filters.sortBy}
      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
      options={[
        { value: "newest", label: "Newest" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "distance", label: "Nearest" }
      ]}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      }
    />

    <button
      onClick={clearFilters}
      className="flex items-center px-6 py-3 font-medium text-white transition-all duration-300 bg-gray-600 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Clear Filters
    </button>
  </div>
);

const FilterSelect = ({ value, onChange, options, icon }) => (
  <div className="relative flex-1 min-w-[200px]">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {icon}
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full py-3 pl-10 pr-8 text-gray-700 bg-white border-0 rounded-lg shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

const ImpactSection = ({ impact }) => (
  <div className="p-8 mb-12 text-center bg-white shadow-lg rounded-xl">
    <h2 className="mb-6 text-3xl font-bold text-gray-800">Your Community Impact</h2>
    <p className="max-w-2xl mx-auto mb-8 text-gray-600">
      Together, we're making a real difference in reducing waste and helping our planet
    </p>
    <div className="flex flex-wrap justify-center gap-8 mt-6">
      <div className="p-6 rounded-lg shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-4xl font-bold text-orange-600">{impact.foodWasteSaved} kg</p>
        <p className="text-gray-600">Food Waste Saved</p>
      </div>
      <div className="p-6 rounded-lg shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-4xl font-bold text-amber-600">{impact.co2Reduced} kg</p>
        <p className="text-gray-600">CO₂ Emissions Reduced</p>
      </div>
      <div className="p-6 rounded-lg shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="text-4xl font-bold text-yellow-600">{impact.foodWasteSaved * 3}</p>
        <p className="text-gray-600">Meals Provided</p>
      </div>
    </div>
  </div>
);

const AnnouncementSection = ({
  title,
  description,
  announcements,
  formatDistance,
  formatPrice,
  formatPickupTime,
  onOpenChat,
  highlightColor = "bg-white border-l-4 border-orange-500"
}) => (
  <section className={`mb-12 p-8 rounded-xl shadow-sm ${highlightColor}`}>
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement._id}
          announcement={announcement}
          formatDistance={formatDistance}
          formatPrice={formatPrice}
          formatPickupTime={formatPickupTime}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  </section>
);

const AnnouncementCard = ({ announcement, formatDistance, formatPrice, formatPickupTime, onOpenChat }) => {
  const getCategoryColor = () => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      event: 'bg-blue-100 text-blue-800',
      donation: 'bg-purple-100 text-purple-800',
      workshop: 'bg-orange-100 text-orange-800',
      'community-drive': 'bg-teal-100 text-teal-800'
    };
    return colors[announcement.category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl group">
      {/* Image with category badge */}
      <div className="relative h-56 overflow-hidden">
        {announcement.images && announcement.images.length > 0 ? (
          <img
            src={announcement.images[0]}
            alt={announcement.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getCategoryColor()}`}>
          {announcement.category.replace('-', ' ')}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{announcement.title}</h3>
          <div className="flex-shrink-0 ml-3">
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${
              announcement.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {formatPrice(announcement.price, announcement.isFree)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-gray-600 line-clamp-3">{announcement.description}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatPickupTime(announcement.pickupTime.start, announcement.pickupTime.end)}</span>
          </div>

          {announcement.distance && (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{formatDistance(announcement.distance)}</span>
            </div>
          )}

          {announcement.category === 'food' && announcement.foodType && (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="capitalize">{announcement.foodType}</span>
            </div>
          )}

          {announcement.quantity && (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{announcement.quantity} {announcement.unit || 'units'}</span>
            </div>
          )}
        </div>

        {/* User info and action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <img 
              src={announcement.createdBy?.avatar || 
                   announcement.createdBy?.profilePicture || 
                   'https://ui-avatars.com/api/?name=' + encodeURIComponent(announcement.createdBy?.name || 'User') + '&background=random'} 
              alt={announcement.createdBy?.name || 'User'}
              className="w-10 h-10 mr-3 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{announcement.createdBy?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link 
              to={`/announcements/${announcement._id}/reserve`}
              className="px-4 py-2 font-medium text-white transition-colors duration-300 rounded-lg bg-brightColor hover:bg-brightColorDark focus:outline-none focus:ring-2 focus:ring-brightColor focus:ring-offset-2"
            >
              Reserve
            </Link>
            <button
              onClick={() => onOpenChat(announcement)}
              className="p-2 text-gray-700 transition-colors duration-300 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              title="Message seller"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapSection = ({ userLocation, announcements, formatPrice, formatPickupTime }) => (
  <section className="mt-16">
    <h2 className="mb-6 text-3xl font-bold text-gray-800">Announcement Locations</h2>
    <div className="w-full overflow-hidden shadow-xl rounded-xl h-96">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {announcements.map((announcement) => (
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
                <p className="text-sm text-gray-600">{formatPrice(announcement.price, announcement.isFree)}</p>
                <p className="text-sm text-gray-600">{formatPickupTime(announcement.pickupTime.start, announcement.pickupTime.end)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </section>
);

const EmptyState = ({ clearFilters }) => (
  <div className="py-20 text-center">
    <div className="relative w-32 h-32 mx-auto mb-6">
      <div className="absolute inset-0 bg-orange-100 rounded-full opacity-20 animate-pulse"></div>
      <svg xmlns="http://www.w3.org/2000/svg" className="relative w-32 h-32 mx-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="mt-4 text-2xl font-medium text-gray-900">No announcements found</h3>
    <p className="mt-3 text-gray-600">Try adjusting your search or filter criteria</p>
    <button
      onClick={clearFilters}
      className="inline-flex items-center px-6 py-3 mt-6 font-medium text-white transition-colors duration-300 bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reset All Filters
    </button>
  </div>
);

export default Announcements;