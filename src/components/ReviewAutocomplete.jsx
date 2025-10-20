import { useState, useEffect, useRef } from 'react';
import { getReviewSuggestions } from '../services/reviewService';

export default function ReviewAutocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (value.length > 3) { // Only trigger after 3+ characters
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        const suggestions = await getReviewSuggestions(value);
        setSuggestions(suggestions);
        setIsLoading(false);
      }, 300); // Debounce 300ms
    } else {
      setSuggestions([]);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [value]);

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        rows={5}
        placeholder="The pizza was..."
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 bottom-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
              }}
            >
              <div className="font-medium">{suggestion}</div>
              <div className="text-xs text-blue-600 mt-1">AI Suggestion</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}