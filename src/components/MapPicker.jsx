import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const TUNISIA_BOUNDS = [
  [30.230236, 7.521980], 
  [37.761205, 11.880713]  
];

const LocationMarker = ({ position, setPosition, setAddress }) => {
  const map = useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      
      
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&countrycodes=tn&accept-language=fr`)
        .then(res => res.json())
        .then(data => {
          const address = data.display_name || `${newPosition.lat.toFixed(4)}, ${newPosition.lng.toFixed(4)}`;
          setAddress(address);
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          setAddress(`${newPosition.lat.toFixed(4)}, ${newPosition.lng.toFixed(4)}`);
        });
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
};

const MapPicker = ({ initialPosition, onLocationSelect, height = '400px' }) => {
  const [position, setPosition] = useState(initialPosition || [34, 9]); 
  const [address, setAddress] = useState('');
  const [geocodingStatus, setGeocodingStatus] = useState('idle'); 
  const mapRef = useRef(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [nearbyNeeds, setNearbyNeeds] = useState([]);

  
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMaxBounds(TUNISIA_BOUNDS);
      mapRef.current.setMinZoom(7);
    }
  }, []);

  const fetchNearbyNeeds = async (lat, lng, radius) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/donation-needs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch nearby needs");
      }
      
      const data = await response.json();
      setNearbyNeeds(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nearby needs:", error);
      setLoading(false);
    }
  };

  const handleLocationUpdate = useCallback(() => {
    if (position && address) {
      onLocationSelect({
        coordinates: { lat: position.lat, lng: position.lng },
        address
      });
    }
  }, [position, address, onLocationSelect]);

  useEffect(() => {
    handleLocationUpdate();
  }, [handleLocationUpdate]);

  return (
    <div className="map-picker relative z-[5]">
      <MapContainer
        ref={mapRef}
        center={position || [34, 9]} // Center on Tunisia
        zoom={7}
        minZoom={7}
        maxBounds={TUNISIA_BOUNDS}
        style={{ 
          height, 
          width: '100%', 
          borderRadius: '8px',
          position: 'relative', 
          zIndex: 5 
        }}
        className="z-[5]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker 
          position={position} 
          setPosition={setPosition}
          setAddress={setAddress}
        />
      </MapContainer>
      <div className="mt-2 text-sm">
        {geocodingStatus === 'loading' && (
          <p className="text-blue-500">Looking up address...</p>
        )}
        {geocodingStatus === 'error' && (
          <p className="text-red-500">Couldn't fetch full address (showing coordinates)</p>
        )}
        {position ? (
          <p className="text-gray-600">Selected: {address || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`}</p>
        ) : (
          <p className="text-gray-600">Click on the map to select a location in Tunisia</p>
        )}
      </div>
    </div>
  );
};

export default MapPicker;