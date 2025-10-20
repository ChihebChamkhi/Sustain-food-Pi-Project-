import { Link } from "react-router-dom";

const AnnouncementCard = ({ announcement }) => {
    const expiryDate = new Date(announcement.expiryDate);
    const isExpiringSoon = (expiryDate - new Date()) < 86400000 * 3; // 3 days
  
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image with status badge */}
        <div className="relative">
          <img 
            src={announcement.images[0] || '/default-food.jpg'} 
            alt={announcement.title}
            className="w-full h-48 object-cover"
            onError={(e) => e.target.src = '/default-food.jpg'}
          />
          {isExpiringSoon && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Expiring Soon!
            </span>
          )}
        </div>
  
        {/* Card Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
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
  
          {/* Food Type & Distance */}
          <div className="flex items-center mt-2 text-sm text-gray-600">
            {announcement.foodType && (
              <span className="capitalize">{announcement.foodType}</span>
            )}
            {announcement.distance && (
              <span className="ml-auto">
                {announcement.distance < 1 
                  ? `${(announcement.distance * 1000).toFixed(0)}m away` 
                  : `${announcement.distance.toFixed(1)}km away`}
              </span>
            )}
          </div>
  
          {/* Quantity & Price */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-500">Quantity</p>
              <p>{announcement.quantity} {announcement.unit}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-500">Price</p>
              <p className="font-bold">
                {announcement.isFree ? 'FREE' : `$${announcement.price}`}
              </p>
            </div>
          </div>

          {/* Action Button */}
        <Link 
        to={`/announcements/${announcement._id}/reserve`}
        className="mt-4 w-full duration-300 rounded-lg bg-brightColor hover:bg-brightColorDark text-white py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brightColor focus:ring-offset-2"
        >
        Reserve
        </Link>
        </div>
      </div>
    );
  };
  
  export default AnnouncementCard;