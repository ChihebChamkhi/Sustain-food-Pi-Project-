import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { createReservation } from '../services/api_reservations';
import { getAnnouncementById } from '../services/api_announcements';
import { useQuery } from 'react-query';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import Alert from '../components/Alert';
import { format, parseISO, isBefore, isAfter } from 'date-fns';

const ReservationForm = ({ announcement: initialAnnouncement }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: announcement, isLoading, isError, error } = useQuery(
    ['announcement', id],
    () => getAnnouncementById(id),
    {
      enabled: !initialAnnouncement && !!id,
      initialData: initialAnnouncement,
      retry: false
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (announcement) {
      setPickupTime(format(new Date(announcement.pickupTime.start), "yyyy-MM-dd'T'HH:mm"));
    }
  }, [announcement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!user) {
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      if (!announcement) {
        throw new Error('Announcement information is missing');
      }

      const selectedPickupTime = new Date(pickupTime);
      const startTime = new Date(announcement.pickupTime.start);
      const endTime = new Date(announcement.pickupTime.end);

      if (isBefore(selectedPickupTime, startTime)) {
        throw new Error('Selected pickup time is before the available window');
      }

      if (isAfter(selectedPickupTime, endTime)) {
        throw new Error('Selected pickup time is after the available window');
      }

      const reservationData = {
        announcementId: announcement._id,
        quantity,
        message,
        pickupTime: selectedPickupTime.toISOString()
      };

      const createdReservation = await createReservation(reservationData);
      
      setSuccessMessage('Reservation request sent successfully!');
      
      setTimeout(() => {
        navigate('/profile', { 
          state: { 
            successMessage: 'Reservation created successfully!',
            reservation: createdReservation
          } 
        });
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Alert type="error" message={error.message} />;
  if (!announcement) return <Alert type="error" message="Announcement not found" />;

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Make Reservation</h2>
      
      {errorMessage && (
        <div className="mb-6">
          <Alert type="error" message={errorMessage} />
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border border-orange-100 rounded-lg bg-orange-50">
          <h3 className="text-lg font-semibold text-gray-800">Reserving: {announcement.title}</h3>
          <p className="mt-1 text-gray-600">{announcement.description}</p>
        </div>

        {announcement.category === 'food' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
              <span className="ml-1 text-gray-500">
                (Available: {announcement.quantity} {announcement.unit || 'units'})
              </span>
            </label>
            <input
              type="number"
              min="1"
              max={announcement.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Number(e.target.value), announcement.quantity))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preferred Pickup Time
          </label>
          <input
            type="datetime-local"
            min={format(new Date(announcement.pickupTime.start), "yyyy-MM-dd'T'HH:mm")}
            max={format(new Date(announcement.pickupTime.end), "yyyy-MM-dd'T'HH:mm")}
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Available between {format(new Date(announcement.pickupTime.start), 'PPpp')} and {format(new Date(announcement.pickupTime.end), 'PPpp')}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows="4"
            maxLength="500"
            placeholder="Any special requests or instructions..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 text-lg font-medium text-white transition-colors duration-300 rounded-lg ${
              isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'
            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              'Confirm Reservation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;