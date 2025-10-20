// services/api_ai.js
export const generateAnnouncementFromImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    // Use the full URL instead of process.env
    const response = await fetch(`http://localhost:5000/api/ai/generate-from-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    if (!response.ok) {
      throw new Error('AI generation failed');
    }
  
    return await response.json();
  };