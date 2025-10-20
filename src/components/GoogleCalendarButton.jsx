import React from 'react';

const GoogleCalendarButton = () => {
  return (
    <a
      href="/api/auth/google"
      className="inline-flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Connect Google Calendar
    </a>
  );
};

export default GoogleCalendarButton;