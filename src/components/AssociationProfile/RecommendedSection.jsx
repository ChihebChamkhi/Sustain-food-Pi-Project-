import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementCardAssoc from './AnnouncementCardAssoc';
import {
    SparklesIcon,
    Cog6ToothIcon,
    ArrowPathIcon,
    ClockIcon,
    MapPinIcon,
    FireIcon,
    StarIcon
} from '@heroicons/react/24/outline';

const RecommendedSection = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [activeTab, setActiveTab] = useState('bestMatches'); // 'bestMatches', 'urgent', 'nearby'

    useEffect(() => {
      if (recommendations.length > 0) {
        console.log("=== RECOMMENDATION DETAILS ===");
        recommendations.forEach((rec, index) => {
          console.group(`Recommendation #${index + 1}: ${rec.title}`);
          console.log("Total score:", rec.recommendationScore + "%");
          console.log("Details:", {
            "Food type": rec.scoreDetails?.foodTypeMatch + "%",
            "Urgency": rec.scoreDetails?.urgencyScore + "%",
            "Quantity": rec.scoreDetails?.quantityMatch + "%",
            "Distance": rec.distance ? rec.distance.toFixed(1) + "km (" + rec.scoreDetails?.distanceScore + "%)" : "N/A",
            "Bonus": rec.scoreDetails?.perfectMatchBonus + "%"
          });
          console.groupEnd();
        });
      }
    }, [recommendations]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            console.log("Tentative de récupération des recommandations...");

            const response = await fetch('http://localhost:5000/api/announcements/recommended-association-announcements', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Réponse reçue, status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP! Statut: ${response.status}`);
    }

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            setRecommendations(data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const filteredRecommendations = recommendations.filter(announcement => {
      switch (activeTab) {
        case 'urgent':
          // Items expiring in next 24 hours
          const hoursUntilExpiry = (new Date(announcement.expiryDate) - new Date()) / (1000 * 60 * 60);
          return hoursUntilExpiry <= 24;
        case 'nearby':
          // Items within 5km
          return announcement.distance <= 5;
        default:
          // All recommendations for 'bestMatches'
          return true;
      }
    });

    if (loading) return (
        <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full animate-pulse">
                <SparklesIcon className="w-6 h-6 text-orange-500" />
            </div>
            <p className="mt-2 text-orange-600">Finding the best matches for you...</p>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-red-600">⚠️ Error loading recommendations: {error}</p>
            <button 
                onClick={fetchRecommendations}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
            >
                Try again
            </button>
        </div>
    );

    return (
        <section className="px-4 py-8 mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">
              <SparklesIcon className="inline w-6 h-6 mr-2 text-orange-500" />
              Smart Picks For You
            </h2>
                    <div className=" mt-2 flex space-x-2 mb-2">
                        <button
                            onClick={() => setActiveTab('bestMatches')}
                            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
                                activeTab === 'bestMatches' 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <StarIcon className="w-4 h-4 mr-1" />
                            Best Matches
                        </button>
                        <button
                            onClick={() => setActiveTab('urgent')}
                            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
                                activeTab === 'urgent' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <FireIcon className="w-4 h-4 mr-1" />
                            Urgent
                        </button>
                        <button
                            onClick={() => setActiveTab('nearby')}
                            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
                                activeTab === 'nearby' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            Nearby
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        {activeTab === 'bestMatches' && "Top recommendations based on all criteria"}
                        {activeTab === 'urgent' && "Items expiring soonest (within 24 hours)"}
                        {activeTab === 'nearby' && "Closest available surplus (within 5km)"}
                        {lastUpdated && (
                            <span className="flex items-center mt-1 text-xs text-gray-400">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={fetchRecommendations}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <Link 
                        to="/association/preferences" 
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all bg-orange-600 rounded-lg hover:bg-orange-700"
                    >
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        Preferences
                    </Link>
                </div>
            </div>
            
            {filteredRecommendations.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredRecommendations.map(announcement => (
                            <AnnouncementCardAssoc
                                key={announcement._id} 
                                announcement={announcement} 
                                showScore={activeTab === 'bestMatches'}
                                showUrgency={activeTab !== 'nearby'}
                                showDistance={activeTab !== 'urgent'}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 mt-6 text-sm text-center text-gray-500 sm:flex-row">
                        <p>Showing {filteredRecommendations.length} {activeTab} matches</p>
                        <span className="hidden sm:block">•</span>
                        <p>Sorted by {activeTab === 'bestMatches' ? 'relevance' : activeTab === 'urgent' ? 'expiry date' : 'distance'}</p>
                    </div>
                </>
            ) : (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm">
                    <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-10 h-10 text-orange-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No {activeTab === 'bestMatches' ? 'priority' : activeTab} matches found
                    </h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        {activeTab === 'bestMatches' && "Try adjusting your preferences or search criteria"}
                        {activeTab === 'urgent' && "No urgent surplus expiring within 24 hours"}
                        {activeTab === 'nearby' && "No available surplus within 5km"}
                    </p>
                    <div className="mt-6 space-x-3">
                        <button
                            onClick={fetchRecommendations}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Refresh
                        </button>
                        <Link 
                            to="/association/preferences" 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <Cog6ToothIcon className="w-5 h-5 mr-2" />
                            Adjust Preferences
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RecommendedSection;