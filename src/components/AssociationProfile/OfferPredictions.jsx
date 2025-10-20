// components/OfferPredictions.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaChartLine } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OfferPredictions = ({ associationId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState({
    labels: [],
    historicalCounts: [],
    predictedCount: 0,
    foodTypes: []
  });

  // Helper function to get week number
  const getWeekNumber = (d) => {
    d = new Date(d);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const processOfferData = (offers) => {
    if (!offers || !Array.isArray(offers) || offers.length === 0) {
      return {
        labels: [],
        historicalCounts: [],
        predictedCount: 0,
        foodTypes: []
      };
    }

    // Group offers by week
    const weeklyData = {};
    const foodTypeCounts = {};
    
    offers.forEach(offer => {
      try {
        const date = new Date(offer.createdAt);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        
        const weekNumber = getWeekNumber(date);
        const year = date.getFullYear();
        const weekKey = `${year}-W${weekNumber}`;
        
        // Count offers per week
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
        
        // Count food types
        const foodType = offer.type === 'donation' ? 'Donation' : 'Sale';
        foodTypeCounts[foodType] = (foodTypeCounts[foodType] || 0) + 1;
      } catch (err) {
        console.error('Error processing offer:', offer._id, err);
      }
    });

    // Prepare data for chart
    const weeks = Object.keys(weeklyData).sort();
    const counts = weeks.map(week => weeklyData[week]);
    
    // Simple prediction: average of last 4 weeks or all available weeks
    const weeksToConsider = Math.min(counts.length, 4);
    const recentWeeks = counts.slice(-weeksToConsider);
    const avg = recentWeeks.reduce((a, b) => a + b, 0) / recentWeeks.length;
    const predictedCount = Math.round(avg);

    // Get top food types
    const foodTypes = Object.entries(foodTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);

    return {
      labels: weeks.map(w => w.replace('-W', ' Week ')),
      historicalCounts: counts,
      predictedCount,
      foodTypes
    };
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOfferData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }
  
        const response = await fetch(
          `http://localhost:5000/api/help-offers/history?association=${associationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            signal: controller.signal
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (isMounted) {
          const processedData = processOfferData(data);
          setPredictionData(processedData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to load prediction data');
          setLoading(false);
          console.error('Fetch error:', err);
        }
      }
    };
  
    fetchOfferData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [associationId]);

  if (loading) return <div className="p-4 text-center">Loading predictions...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-teal-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-teal-100 text-teal-600">
          <FaChartLine className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Offer Predictions</h2>
          <p className="text-sm text-gray-600">Trends and future expectations</p>
        </div>
      </div>

      {predictionData.historicalCounts.length > 0 ? (
        <>
          <div className="h-64">
            <Line 
              data={{
                labels: [...predictionData.labels, 'Next Week'],
                datasets: [{
                  label: 'Offers Received',
                  data: [...predictionData.historicalCounts, predictionData.predictedCount],
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4,
                  borderWidth: 2,
                  pointBackgroundColor: (context) => 
                    context.dataIndex === predictionData.historicalCounts.length ? 
                    'rgb(239, 68, 68)' : 'rgb(16, 185, 129)',
                  pointRadius: (context) => 
                    context.dataIndex === predictionData.historicalCounts.length ? 5 : 3
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Offers'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Week'
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        if (context.dataIndex === predictionData.historicalCounts.length) {
                          return `Predicted: ${context.raw} offers`;
                        }
                        return `${context.raw} offers`;
                      }
                    }
                  },
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-4 p-4 bg-teal-50 rounded-lg">
            <h3 className="font-semibold text-teal-800 mb-2">Next Week Prediction</h3>
            <p className="text-gray-700">
              Expected <span className="font-bold">{predictionData.predictedCount}</span> offers, 
              mostly <span className="font-bold">{predictionData.foodTypes.join(' and ')}</span>.
            </p>
            {predictionData.historicalCounts.length < 4 && (
              <p className="text-xs text-gray-500 mt-2">
                Note: Predictions will become more accurate as more data is collected.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Not enough data yet to generate predictions. Check back after receiving some offers.
        </div>
      )}
    </div>
  );
};

export default OfferPredictions;