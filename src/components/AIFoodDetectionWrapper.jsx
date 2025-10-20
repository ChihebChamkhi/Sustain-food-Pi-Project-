// components/AIFoodDetectionWrapper.jsx
import { useState } from 'react';
import AIAnnouncementGenerator from './AIAnnouncementGenerator';

const AIFoodDetectionWrapper = ({ onApplyGeneratedData }) => {
  const [showAI, setShowAI] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleApply = () => {
    if (generatedData) {
      onApplyGeneratedData(generatedData);
      setShowAI(false);
    }
  };

  return (
    <div className="mb-6">
      {!showAI ? (
        <button
          onClick={() => setShowAI(true)}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Use AI Food Detection
        </button>
      ) : (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">AI Food Detection</h3>
            <button 
              onClick={() => setShowAI(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <AIAnnouncementGenerator 
            onGenerate={(data) => setGeneratedData(data)} 
          />
          
          {generatedData && (
            <button
              onClick={handleApply}
              className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Apply AI Suggestions
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFoodDetectionWrapper;