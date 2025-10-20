/*
// CSS first
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

// Then components
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect } from 'react';
import { getReservations } from '../services/api_reservations';
import { useAuth } from '../context/AuthContext';

const ReservationCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Fetch both incoming and outgoing reservations
        const [incoming, outgoing] = await Promise.all([
          getReservations('requests'),
          getReservations('reservations')
        ]);
        
        const allReservations = [...incoming, ...outgoing];
        
        const calendarEvents = allReservations.map(reservation => ({
          id: reservation._id,
          title: `Reservation: ${reservation.announcement?.title}`,
          start: reservation.pickupTime,
          end: new Date(new Date(reservation.pickupTime).getTime() + 3600000),
          color: getEventColor(reservation.status, user.id, reservation),
          extendedProps: {
            status: reservation.status,
            reserverName: reservation.reserver?.name,
            announcerName: reservation.announcer?.name,
            quantity: reservation.quantity,
            message: reservation.message,
            announcementTitle: reservation.announcement?.title,
            calendarEventId: reservation.calendarEventId
          }
        }));
        
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user.id]);

  const getEventColor = (status, userId, reservation) => {
    if (status === 'approved') return '#10B981'; // green
    if (status === 'pending') return '#F59E0B'; // yellow
    if (status === 'completed') return '#3B82F6'; // blue
    if (status === 'cancelled') return '#6B7280'; // gray
    if (status === 'rejected') return '#EF4444'; // red
    return '#8B5CF6'; // purple
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="auto"
        nowIndicator={true}
        editable={false}
        selectable={false}
      />
    </div>
  );
};

function renderEventContent(eventInfo) {
  const statusMap = {
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected'
  };

  return (
    <div className="p-1 overflow-hidden">
      <div className="font-bold truncate">{eventInfo.event.title}</div>
      <div className="text-sm">
        <span className={`px-1 rounded ${getStatusColorClass(eventInfo.event.extendedProps.status)}`}>
          {statusMap[eventInfo.event.extendedProps.status] || eventInfo.event.extendedProps.status}
        </span>
      </div>
      <div className="text-xs truncate">
        {eventInfo.event.extendedProps.reserverName} → {eventInfo.event.extendedProps.announcerName}
      </div>
      {eventInfo.event.extendedProps.calendarEventId && (
        <a 
          href={`https://calendar.google.com/event?action=VIEW&eid=${eventInfo.event.extendedProps.calendarEventId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1 text-xs text-blue-500 hover:underline"
          onClick={e => e.stopPropagation()}
        >
          View in Google Calendar
        </a>
      )}
    </div>
  );
}

function getStatusColorClass(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function handleEventClick(clickInfo) {
  // You can implement a modal to show reservation details here
  console.log('Event clicked:', clickInfo.event);
}

export default ReservationCalendar;

*/