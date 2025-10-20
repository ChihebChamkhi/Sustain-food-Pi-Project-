import { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import { getRouteSuggestions, confirmRoute } from '../services/api_reservations';
import LoadingSpinner from './LoadingSpinner';
import AnnouncementMapPicker from './AnnouncementMapPicker';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import RouteConfirmationModal from './RouteConfirmationModal';

const RouteSuggestion = ({ reservationId, onRouteConfirmed }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { mutate: fetchRoutes, isLoading } = useMutation(
    () => getRouteSuggestions(reservationId, userLocation),
    {
      onSuccess: (data) => {
        setRouteData(data);
        if (data.suggestions?.length > 0) {
          setSelectedRoute(data.suggestions[0]);
        }
      },
      onError: (error) => {
        console.error('Route suggestion error:', error);
        alert(error.message || 'Failed to get route suggestions');
      }
    }
  );

  const { mutate: confirmSelectedRoute, isLoading: isConfirming } = useMutation(
    () => confirmRoute(reservationId, selectedRoute),
    {
      onSuccess: () => {
        alert('Route confirmed successfully!');
        setShowConfirmation(false);
        if (onRouteConfirmed) {
          onRouteConfirmed();
        }
      },
      onError: (error) => {
        console.error('Route confirmation error:', error);
        alert(error.message || 'Failed to confirm route');
      }
    }
  );

  const handleLocationSelect = useCallback((location) => {
    if (location?.coordinates) {
      setUserLocation({
        lat: location.coordinates[1],
        lng: location.coordinates[0]
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userLocation) {
      alert('Please provide your location first');
      return;
    }
    fetchRoutes();
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleConfirmClick = () => {
    if (selectedRoute) {
      setShowConfirmation(true);
    }
  };

  if (!routeData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Get Route Suggestions</h3>

        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600">
            To get route suggestions to your reservation location, please select your location on the map:
          </p>

          <AnnouncementMapPicker
            onLocationSelect={handleLocationSelect}
            initialPosition={userLocation ? {
              lat: userLocation.lat,
              lng: userLocation.lng
            } : null}
            height="300px"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!userLocation || isLoading}
          className="w-full px-4 py-2 text-white rounded bg-brightColor hover:bg-brightColor/90 disabled:opacity-50"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Get Route Suggestions'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="mb-2 text-lg font-semibold">Route to: {routeData.destination}</h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {routeData.suggestions.map((route) => (
            <div
              key={route.id}
              onClick={() => handleRouteSelect(route)}
              className={`p-3 border rounded cursor-pointer ${
                selectedRoute?.id === route.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <h4 className="font-medium">Option {route.id + 1}</h4>
              <p className="text-sm text-gray-600">{route.summary}</p>
              <p className="text-xs text-gray-500">
                Distance: {(route.distance / 1000).toFixed(1)} km
              </p>
              <p className="text-xs text-gray-500">
                Time: {Math.ceil(route.duration / 60)} min
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64 overflow-hidden rounded-lg">
        <MapContainer
          center={[selectedRoute.geometry.coordinates[0][1], selectedRoute.geometry.coordinates[0][0]]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}

          <Marker position={[routeData.destinationCoordinates[1], routeData.destinationCoordinates[0]]}>
            <Popup>Destination</Popup>
          </Marker>

          <Polyline
            positions={selectedRoute.geometry.coordinates.map(coord => [coord[1], coord[0]])}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        </MapContainer>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleConfirmClick}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Confirm This Route
        </button>
      </div>

      <RouteConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSelectedRoute}
        route={selectedRoute}
        isLoading={isConfirming}
        userLocation={userLocation}
        destination={routeData.destinationCoordinates}
      />
    </div>
  );
};

export default RouteSuggestion;