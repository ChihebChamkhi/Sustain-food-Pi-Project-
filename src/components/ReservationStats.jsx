const ReservationStats = ({ stats }) => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Total Reservations</h3>
          <p className="text-2xl font-bold text-brightColor">{stats.totalReservations}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingReservations}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-2xl font-bold text-green-500">{stats.approvedReservations}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-2xl font-bold text-blue-500">{stats.completedReservations}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">Food Saved (kg)</h3>
          <p className="text-2xl font-bold text-brightColor">{stats.totalFoodSaved}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">CO2 Saved (kg)</h3>
          <p className="text-2xl font-bold text-brightColor">{stats.totalCO2Saved}</p>
        </div>
      </div>
    );
  };
  
  export default ReservationStats;