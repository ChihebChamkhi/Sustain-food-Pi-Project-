import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DonationChecklist = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Donation Checklist</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-600">
            <FiCheckCircle className="text-2xl" />
            Always Acceptable
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Non-Perishables</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Canned goods (unopened)</li>
                <li>Dry pasta/rice</li>
                <li>Sealed snacks</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Fresh Produce</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Whole fruits/vegetables</li>
                <li>Uncut leafy greens</li>
                <li>Root vegetables</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-red-600">
            <FiXCircle className="text-2xl" />
            Strictly Prohibited
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Food Items</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Home-canned goods</li>
                <li>Expired products</li>
                <li>Raw meat/fish</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Non-Food Items</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Alcohol/tobacco</li>
                <li>Medications</li>
                <li>Opened packages</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-orange-600">
            <FiAlertTriangle className="text-2xl" />
            Special Considerations
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <FiCheckCircle className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Baked Goods</h3>
                <p className="text-gray-600">
                  Commercially packaged only, within 2 days of production
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <FiCheckCircle className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Dairy Products</h3>
                <p className="text-gray-600">
                  Must maintain refrigeration chain, unopened containers
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-800">Need Clarification?</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/safety"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              View Safety Guidelines
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Contact Food Safety Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationChecklist;