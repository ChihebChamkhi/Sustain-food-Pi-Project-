// components/FilterBar.js
const FilterBar = ({ filters, onFilterChange, filterOptions }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          {Object.entries(filterOptions).map(([name, options]) => (
            <select
              key={name}
              value={filters[name]}
              onChange={(e) => onFilterChange(name, e.target.value)}
              className="border rounded px-3 py-2"
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
    );
  };
  
  export default FilterBar;