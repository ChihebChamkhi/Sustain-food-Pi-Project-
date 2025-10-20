import { format } from 'date-fns';

const RouteConfirmationModal = ({ isOpen, onClose, onConfirm, route, isLoading, userLocation, destination }) => {
  if (!isOpen || !route) return null;

  const calculateETA = () => {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + route.duration * 1000);
    return format(arrivalTime, 'h:mm a');
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination[1]},${destination[0]}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleConfirm = () => {
    onConfirm({
      id: route.id,
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry, // Make sure this is the full geometry object
      summary: route.summary
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="z-50 w-full max-w-md p-6 bg-white rounded-lg">
          <h3 className="mb-4 text-lg font-bold">Confirm Your Route</h3>

          <div className="mb-4 space-y-3">
            <p>
              <span className="font-semibold">Summary:</span> {route.summary}
            </p>
            <p>
              <span className="font-semibold">Distance:</span> {(route.distance / 1000).toFixed(1)} km
            </p>
            <p>
              <span className="font-semibold">Estimated Time:</span> {Math.ceil(route.duration / 60)} minutes
            </p>
            <p>
              <span className="font-semibold">ETA:</span> {calculateETA()}
            </p>

            <button
              onClick={openInGoogleMaps}
              className="flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Preview in Google Maps
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Route'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteConfirmationModal;
