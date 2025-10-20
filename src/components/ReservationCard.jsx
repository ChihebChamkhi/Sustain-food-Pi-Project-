import { format, parseISO, isValid } from 'date-fns';
import { useState } from 'react';
import RouteSuggestion from './RouteSuggestion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const foodCategoryColors = {
  dairy: 'bg-blue-50 text-blue-800 border border-blue-100',
  meat: 'bg-red-50 text-red-800 border border-red-100',
  fish: 'bg-teal-50 text-teal-800 border border-teal-100',
  bakery: 'bg-amber-50 text-amber-800 border border-amber-100',
  vegetarian: 'bg-green-50 text-green-800 border border-green-100',
  vegan: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
  default: 'bg-gray-50 text-gray-800 border border-gray-100'
};

const ReservationCard = ({
  reservation = {},
  type, // 'reservations' (made by user) or 'requests' (made on user's announcements)
  showActions = true,
  showApproveReject = false,
  onAction = {}
}) => {
  const [showRouteSuggestions, setShowRouteSuggestions] = useState(false);
  const [showFoodDetails, setShowFoodDetails] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'PPpp') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  // Determine food category for styling
  const foodCategory = reservation.foodStorageInfo?.foodCategory?.toLowerCase() || '';
  const categoryColor =
    foodCategory.includes('dairy') ? 'dairy' :
    foodCategory.includes('meat') ? 'meat' :
    foodCategory.includes('fish') ? 'fish' :
    foodCategory.includes('bakery') ? 'bakery' :
    foodCategory.includes('vegetable') || foodCategory.includes('vegetarian') ? 'vegetarian' :
    foodCategory.includes('vegan') ? 'vegan' : 'default';

  // Enhanced food type display
  const getFoodTypeDisplay = () => {
    if (!reservation.announcement?.foodType) return 'Food';

    const foodTypeMap = {
      'vegetarian': 'Vegetarian',
      'vegan': 'Vegan',
      'meat': 'Meat',
      'bakery': 'Bakery',
      'dairy': 'Dairy',
      'other': 'Other'
    };

    return foodTypeMap[reservation.announcement.foodType] || 'Food';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {reservation.announcement?.title || 'Untitled Announcement'}
          </h3>
          {reservation.announcement?.category === 'food' && (
            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${foodCategoryColors[categoryColor]}`}>
              {getFoodTypeDisplay()}
            </span>
          )}
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[reservation.status] || 'bg-gray-100 text-gray-800'}`}>
          {reservation.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-2">
        {type === 'reservations' && (
          <>
            <div>
              <p className="text-sm text-gray-500">Announcement Owner</p>
              <p className="font-medium">{reservation.announcer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reserved By</p>
              <p className="font-medium">You</p>
            </div>
          </>
        )}

        {type === 'requests' && (
          <>
            <div>
              <p className="text-sm text-gray-500">Reserved By</p>
              <p className="font-medium">{reservation.reserver?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Announcement</p>
              <p className="font-medium">{reservation.announcement?.title}</p>
            </div>
          </>
        )}

        <div>
          <p className="text-sm text-gray-500">Pickup Time</p>
          <p className="font-medium">{formatDate(reservation.pickupTime)}</p>
        </div>

        {reservation.announcement?.category === 'food' && (
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-medium">
              {reservation.quantity} {reservation.announcement?.unit || 'units'}
            </p>
          </div>
        )}
      </div>

      {/* Google Calendar Button */}
      {reservation.calendarEventId && (
        <div className="mt-4">
          <a
            href="https://calendar.google.com/calendar/u/0/r/month"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            View in Google Calendar
          </a>
        </div>
      )}

      {/* Food Information Section - Enhanced */}
      {reservation.announcement?.category === 'food' && (
        <div className={`mt-4 p-4 rounded-lg ${foodCategoryColors[categoryColor]}`}>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Food Details</h4>
            <button
              onClick={() => setShowFoodDetails(!showFoodDetails)}
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              {showFoodDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {showFoodDetails && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Quantity</p>
                  <p className="mt-1">
                    {reservation.quantity} {reservation.announcement?.unit || 'units'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Expiration</p>
                  <p className="mt-1">
                    {reservation.announcement?.expirationDate
                      ? format(parseISO(reservation.announcement.expirationDate), 'PPP')
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Category</p>
                  <p className="mt-1 capitalize">
                    {reservation.foodStorageInfo?.foodCategory || 'General'}
                  </p>
                </div>
              </div>

              {reservation.foodStorageInfo && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Storage Instructions</p>
                    <p className="mt-1">{reservation.foodStorageInfo.storage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Shelf Life</p>
                    <p className="mt-1">{reservation.foodStorageInfo.shelfLife}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Handling</p>
                    <p className="mt-1">{reservation.foodStorageInfo.handlingInstructions}</p>
                  </div>
                </div>
              )}

              {reservation.announcement?.ingredients && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Ingredients</p>
                  <p className="mt-1">{reservation.announcement.ingredients}</p>
                </div>
              )}

              {reservation.announcement?.allergens && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Allergens</p>
                  <p className="mt-1">{reservation.announcement.allergens}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action buttons section */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* My Reservations tab - actions for reserver */}
        {type === 'reservations' && (
          <>
            {/* Cancel button for pending reservations */}
            {reservation.status === 'pending' && (
              <button
                onClick={() => onAction.cancel()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            )}

            {/* Route suggestions for approved reservations */}
            {reservation.status === 'approved' && (
              <button
                onClick={() => setShowRouteSuggestions(!showRouteSuggestions)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                {showRouteSuggestions ? 'Hide Routes' : 'Get Route Suggestions'}
              </button>
            )}
          </>
        )}

        {/* Reservation Requests tab - actions for announcer */}
        {type === 'requests' && (
          <>
            {/* Approve/Reject buttons for pending requests */}
            {showApproveReject && (
              <>
                <button
                  onClick={() => onAction.approve()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => onAction.reject()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}

            {/* Complete button for approved reservations */}
            {reservation.status === 'approved' && (
              <button
                onClick={() => onAction.complete()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Mark as Completed
              </button>
            )}
          </>
        )}
      </div>

      {/* Route suggestions section */}
      {showRouteSuggestions && type === 'reservations' && reservation.status === 'approved' && (
        <div className="mt-4">
          <RouteSuggestion
            reservationId={reservation._id}
            onRouteConfirmed={() => {
              setShowRouteSuggestions(false);
              if (typeof onAction.refetch === 'function') {
                onAction.refetch();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
