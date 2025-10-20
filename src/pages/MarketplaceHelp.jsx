import { Link } from 'react-router-dom';
import { FiShoppingCart, FiBell, FiMapPin } from 'react-icons/fi';

const MarketplaceHelp = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Marketplace Guide</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiShoppingCart className="text-orange-600" />
            Reserving Food
          </h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>Browse available donations on the marketplace</li>
            <li>Click any listing for detailed information</li>
            <li>Use the "Reserve" button to claim items</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiBell className="text-orange-600" />
            Notifications
          </h2>
          <p className="text-gray-600">
            Receive real-time updates via:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Email confirmations</li>
              <li>Mobile push notifications</li>
              <li>Dashboard alerts</li>
            </ul>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiMapPin className="text-orange-600" />
            Pickup Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Business Hours</h3>
              <p>8 AM - 6 PM Daily</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Required Documentation</h3>
              <ul className="list-disc pl-5">
                <li>Government ID</li>
                <li>Reservation confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHelp;