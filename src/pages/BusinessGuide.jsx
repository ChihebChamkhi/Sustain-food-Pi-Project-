import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiDollarSign } from 'react-icons/fi';

const BusinessGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Business Donation Guide</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiPackage className="text-orange-600" />
            Posting Donations
          </h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>Log in to your business dashboard</li>
            <li>Click "New Donation" in the navigation menu</li>
            <li>Fill in donation details:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Food type and quantity</li>
                <li>Expiration dates</li>
                <li>Pickup time window</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-orange-600" />
            Time Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Perishable Items</h3>
              <p>Must be collected within 4 hours of posting</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Non-Perishable</h3>
              <p>48-hour pickup window</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-orange-600" />
            Tax Benefits
          </h2>
          <p className="text-gray-600">
            All donations through our platform qualify for IRS tax deductions. 
            <Link to="/impact" className="text-orange-600 hover:underline ml-2">
              Learn about impact tracking
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessGuide;