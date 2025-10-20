import React, { useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getAnnouncementById } from '../../services/api_announcements';
import ReservationForm from '../../components/ReservationForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { format } from 'date-fns';

const ReservationPage = () => {
  useEffect(() => {
    document.title = "Reservation Page";
  });
  
  const { id } = useParams();
  const location = useLocation();
  
  const { data: announcement, isLoading, isError, error } = useQuery(
    ['announcement', id],
    () => getAnnouncementById(id),
    {
      retry: false,
      onError: (err) => console.error('Failed to load announcement:', err)
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto">
        <Alert type="error" message={error.message} />
      </div>
    </div>
  );
  if (!announcement) return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto">
        <Alert type="info" message="Announcement not found" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Make a Reservation</h1>
          <p className="mt-2 text-lg text-orange-600">
            Reserve {announcement.title} from {announcement.createdBy?.name}
          </p>
        </div>
        
        {location.state?.successMessage && (
          <div className="max-w-3xl mx-auto mb-8">
            <Alert type="success" message={location.state.successMessage} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Announcement Details Card */}
          <div className="p-6 overflow-hidden bg-white shadow-md rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Item Details</h2>
            
            <div className="mb-6">
              {announcement.images?.[0] && (
                <img 
                  src={announcement.images[0]} 
                  alt={announcement.title}
                  className="object-cover w-full h-64 rounded-lg shadow-sm"
                />
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
            <p className="mt-2 text-gray-600">{announcement.description}</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-700">Pickup Window</p>
                  <p className="text-gray-600">
                    {format(new Date(announcement.pickupTime.start), 'PPpp')} - {format(new Date(announcement.pickupTime.end), 'PPpp')}
                  </p>
                </div>
              </div>
              
              {announcement.category === 'food' && (
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700">Available Quantity</p>
                    <p className="text-gray-600">
                      {announcement.quantity} {announcement.unit}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Reservation Form */}
          <ReservationForm announcement={announcement} />
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;