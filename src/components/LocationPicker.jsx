
// Create a new LocationSearchControl component
const LocationPicker = ({ onSearch, onReset }) => {
    const [radius, setRadius] = useState(5);
    const [isActive, setIsActive] = useState(false);
  
    return (
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar bg-white p-2 shadow-md rounded">
          {isActive ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Click on map to select location</p>
              <div className="flex items-center">
                <label className="mr-2 text-sm">Radius (km):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setIsActive(false);
                    onReset();
                  }}
                  className="flex-1 p-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                  }}
                  className="flex-1 p-1 text-sm bg-orange-100 hover:bg-orange-200 rounded"
                >
                  Ready
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsActive(true)}
              className="p-1 text-sm bg-orange-100 hover:bg-orange-200 rounded"
            >
              Search Nearby Needs
            </button>
          )}
        </div>
      </div>
    );
  };

export default LocationPicker;