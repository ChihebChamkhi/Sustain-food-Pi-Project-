// components/AnnouncementFilters.js
const AnnouncementFilters = ({ filters, setFilters }) => {
    const foodTypes = ['vegetarian', 'vegan', 'meat', 'bakery', 'dairy', 'other'];
    const categories = ['food', 'donation', 'event'];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-bold mb-3">Filter Announcements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full border rounded-md p-2"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
  
          {/* Food Type Filter (shown only when category is food) */}
          {filters.category === 'food' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Type
              </label>
              <select
                value={filters.foodType}
                onChange={(e) => setFilters({...filters, foodType: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="all">All Types</option>
                {foodTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {/* Distance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Distance (km)
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.distance}
              onChange={(e) => setFilters({...filters, distance: e.target.value})}
              className="w-full"
            />
            <div className="text-center mt-1">
              {filters.distance} km
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AnnouncementFilters;