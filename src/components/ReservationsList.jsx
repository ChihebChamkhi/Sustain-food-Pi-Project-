import React from 'react';
import { useQuery } from 'react-query';
import {
  getReservations,
  cancelReservation,
  updateReservationStatus
} from '../services/api_reservations';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';
import ReservationCard from './ReservationCard';
import { useAuth } from '../context/AuthContext';

const ReservationsList = ({
  type = 'reservations', // 'reservations' or 'requests'
  statusFilter = null,
  showActions = true,
  showApproveReject = false
}) => {
  const { user } = useAuth();

  const {
    data: reservations,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['reservations', type, statusFilter],
    () => getReservations(type, statusFilter),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      onError: (err) => console.error('Error fetching reservations:', err)
    }
  );

  const handleCancel = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(reservationId);
        refetch();
      } catch (err) {
        alert(err.message || 'Failed to cancel reservation');
      }
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    const actionText = {
      approve: 'approve',
      reject: 'reject',
      complete: 'complete',
      cancel: 'cancel'
    }[newStatus];

    if (window.confirm(`Are you sure you want to ${actionText} this reservation?`)) {
      try {
        await updateReservationStatus(reservationId, newStatus);
        refetch();
      } catch (err) {
        alert(err.message || `Failed to ${actionText} reservation`);
      }
    }
  };

  if (isLoading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-lg shadow-md animate-pulse">
          <div className="w-1/2 h-6 mb-4 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <Alert type="error" message={error.message} />;

  return (
    <div className="space-y-4">
      {reservations?.length === 0 ? (
        <Alert type="info" message={
          type === 'requests'
            ? 'No reservation requests found for your announcements'
            : 'No reservations found'
        } />
      ) : (
        reservations?.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            type={type}
            showActions={showActions}
            showApproveReject={showApproveReject && reservation.status === 'pending'}
            currentUserId={user?.id}
            onAction={{
              cancel: () => handleCancel(reservation._id),
              approve: () => handleStatusUpdate(reservation._id, 'approved'),
              reject: () => handleStatusUpdate(reservation._id, 'rejected'),
              complete: () => handleStatusUpdate(reservation._id, 'completed'),
              refetch: refetch
            }}
          />
        ))
      )}
    </div>
  );
};

export default ReservationsList;
