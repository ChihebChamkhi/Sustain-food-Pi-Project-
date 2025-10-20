import React, { useEffect, useState } from "react";
import { fetchBusinesses } from "../../services/reviewService";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaBusinessTime } from "react-icons/fa";
import { BsFillStarFill } from "react-icons/bs";

export default function BusinessReviews() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBusinesses();
        setBusinesses(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please login to view businesses");
        } else {
          setError(err.message || "Failed to load business listings");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error)
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const sortedBusinesses = [...businesses].sort((a, b) => b.score - a.score);

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
      {/* Business Listings */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Business Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <section className="w-full lg:w-1/3 lg:sticky top-20 z-10">
        {/* Leaderboard Title with Stars */}
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-yellow-600 flex items-center gap-2">
            ⭐ Best Businesses ⭐
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <ul>
            {sortedBusinesses.slice(0, 5).map((business, index) => {
              const rankStyles = [
                "bg-yellow-100 text-yellow-700", // Gold
                "bg-gray-200 text-gray-600", // Silver
                "bg-orange-100 text-orange-600", // Bronze
                "", // 4th
                "", // 5th
              ];
              return (
                <li
                  key={business._id}
                  className={`flex justify-between items-center py-3 px-2 rounded mb-2 ${rankStyles[index] || "hover:bg-gray-50 transition"}`}
                >
                  <div className="flex items-center gap-2">
                    <FaBusinessTime className="text-blue-500" />
                    <span className="font-medium">{index + 1}. {business.name}</span>
                  </div>
                  <div className="flex items-center">
                    <BsFillStarFill className="text-yellow-500 mr-1" />
                    <span className="font-semibold">{business.score?.toFixed(1) || "N/A"}/10</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

const BusinessCard = ({ business }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
    <h2 className="text-xl font-semibold">{business.name}</h2>
    <div className="flex items-center my-2">
      <span className="text-2xl mr-2">{business.emoji || "🏢"}</span>
      <span className="text-yellow-500 font-medium">
        {business.score?.toFixed(1) || "N/A"}/10
      </span>
    </div>
    <Link
      to={`/business/${business._id}`}
      className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Write Review
    </Link>
  </div>
);
