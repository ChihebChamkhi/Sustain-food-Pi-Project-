// services/api_announcementsbackOffice.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/announcements-backoffice"; // Replace with your actual API URL

// Function to get all announcements
export const getAllAnnouncements = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

// Function to delete an announcement by ID
export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await axios.delete(`${API_URL}/${announcementId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

// Function to update an announcement by ID
export const updateAnnouncement = async (announcementId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${announcementId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};
