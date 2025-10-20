// components/AIAnnouncementGenerator.jsx
import { useState } from 'react';
import { generateAnnouncementFromImage } from '../services/api_ai';
import LoadingSpinner from './LoadingSpinner';

const AIAnnouncementGenerator = ({ onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedData(null);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // Generate announcement from image
      const response = await generateAnnouncementFromImage(file);
      setGeneratedData(response.data);
      
      // Pass the generated data to the parent component
      onGenerate(response.data);
      
    } catch (err) {
      setError(err.message || 'Failed to generate announcement');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedData = () => {
    if (generatedData) {
      onGenerate(generatedData);
    }
  };

  return (
    <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        AI-Powered Announcement Generator
      </h3>
      
      <p className="mb-4 text-sm text-gray-600">
        Upload a photo of your food items and our AI will suggest title, description, and categories.
      </p>
      
      <div className="flex flex-col items-center">
        {previewImage && (
          <div className="relative w-48 h-48 mb-4">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}
        
        <label className={`flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed rounded-lg cursor-pointer ${
          isGenerating ? 'border-gray-300' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}>
          {isGenerating ? (
            <div className="flex flex-col items-center">
              <LoadingSpinner size="small" />
              <span className="mt-2 text-sm text-gray-600">Analyzing image...</span>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {previewImage ? 'Analyze another image' : 'Upload food photo'}
              </span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
            disabled={isGenerating}
          />
        </label>
        
        {error && (
          <div className="mt-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {generatedData && (
          <div className="w-full p-3 mt-4 bg-white border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800">AI Suggestions</h4>
            <div className="mt-2 text-sm">
              <p><span className="font-semibold">Title:</span> {generatedData.title}</p>
              <p><span className="font-semibold">Description:</span> {generatedData.description}</p>
              <p><span className="font-semibold">Category:</span> {generatedData.category}</p>
              <p><span className="font-semibold">Food Type:</span> {generatedData.foodType}</p>
              <p><span className="font-semibold">Tags:</span> {generatedData.tags.join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnnouncementGenerator;