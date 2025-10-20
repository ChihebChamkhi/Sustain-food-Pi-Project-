import axios from "axios";

const API_URL = "http://localhost:5000/api/reservationbackoffice"; 

// Function to get all reservations
export const getAllReservations = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  };
  
  // Function to get a reservation by ID
  export const getReservationById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation by ID:', error);
      throw error;
    }
  };
  
  // Function to delete a reservation
  export const deleteReservation = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  };