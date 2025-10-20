import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
  const map = useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      
      // Reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`)
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

const AnnouncementMapPicker = ({ initialPosition, onLocationSelect, height = '300px' }) => {
  const [position, setPosition] = useState(initialPosition || null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (position && address) {
      onLocationSelect({
        coordinates: [position.lng, position.lat], // Note: longitude first for MongoDB
        location: address
      });
    }
  }, [position, address, onLocationSelect]);

  return (
    <div className="map-picker">
      <MapContainer
        center={position || [36.8065, 10.1815]} // Default to Tunisia center
        zoom={13}
        style={{ height, width: '100%', borderRadius: '8px' }}
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
      <div className="mt-2 text-sm text-gray-600">
        {position ? (
          <p>Selected: {address || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`}</p>
        ) : (
          <p>Click on the map to select a location</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementMapPicker;