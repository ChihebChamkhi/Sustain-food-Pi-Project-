import { Link } from "react-router-dom";
import {
  ClockIcon,
  MapPinIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const AnnouncementCardAssoc = ({ 
  announcement, 
  showScore = false,
  showUrgency = true,
  showDistance = true
}) => {
  const expiryDate = new Date(announcement.expiryDate);
  const hoursUntilExpiry = Math.round((expiryDate - new Date()) / (1000 * 60 * 60));
  const isUrgent = hoursUntilExpiry <= 24;

  return (
    <div className={`relative overflow-hidden transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-lg group border border-gray-200 ${
      showScore ? 'border-l-4 border-orange-500' : ''
    } ${
      isUrgent ? 'border-t-2 border-red-500' : ''
    }`}>
      
      

      {/* Urgent Badge (Top Left) */}
      {showUrgency && isUrgent && (
        <div className="absolute top-2 left-2 flex items-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full z-10">
          <FireIcon className="w-3 h-3 mr-1" />
          Urgent
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={announcement.images?.[0] || '/default-food.jpg'} 
          alt={announcement.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={(e) => e.target.src = '/default-food.jpg'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Category */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {announcement.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            announcement.category === 'food' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {announcement.category}
          </span>
        </div>

        {/* Food Type */}
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md capitalize">
            {announcement.foodType?.replace('_', ' ') || 'Generic'}
          </span>
        </div>

        {/* Distance and Urgency */}
        <div className="flex justify-between mt-3 space-x-2">
          {showDistance && announcement.distance && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
              <span>
                {announcement.distance < 1 
                  ? `${(announcement.distance * 1000).toFixed(0)}m` 
                  : `${announcement.distance.toFixed(1)}km`}
              </span>
            </div>
          )}
          
          {showUrgency && (
            <div className={`flex items-center text-sm ${
              isUrgent ? 'text-red-600' : 'text-gray-500'
            }`}>
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>
                {isUrgent 
                  ? `Expires in ${hoursUntilExpiry}h` 
                  : expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="font-medium text-gray-500">Quantity</p>
            <p className="font-semibold">
              {announcement.quantity} {announcement.unit}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-500">Price</p>
            <p className={`font-bold ${
              announcement.isFree ? 'text-green-600' : 'text-gray-900'
            }`}>
              {announcement.isFree ? 'FREE' : `${announcement.price} DT`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/announcements/${announcement._id}/reserve`}
          className="block mt-4 w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
        >
          Reserve Now
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementCardAssoc;