import { FiCheck, FiX, FiClock, FiThermometer } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ApprovedFoods = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Approved Food Items</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-600">
            <FiCheck className="text-2xl" />
            Always Accepted
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FiThermometer />
                Perishables
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fresh fruits/vegetables</li>
                <li>Commercially packaged bread</li>
                <li>Dairy (unopened, refrigerated)</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FiClock />
                Non-Perishables
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Canned vegetables/fruits</li>
                <li>Dry grains/legumes</li>
                <li>Sealed snacks</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-red-600">
            <FiX className="text-2xl" />
            Never Accepted
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">High Risk Items</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Raw meat/poultry</li>
                <li>Sushi/raw fish</li>
                <li>Unpasteurized juices</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Regulated Substances</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Alcohol products</li>
                <li>Dietary supplements</li>
                <li>Medical foods</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4">Condition Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FiCheck className="text-green-600" />
                Good Condition
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Intact packaging</li>
                <li>No dents/rust on cans</li>
                <li>Clear expiration dates</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FiX className="text-red-600" />
                Damaged Goods
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Swollen packaging</li>
                <li>Broken seals</li>
                <li>Visible mold</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-800">Need Help Sorting?</h3>
          <p className="text-gray-600 mb-4">
            Use our interactive Food Safety Checker to verify your items:
          </p>
          <Link
            to="/safety-check"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Start Safety Check
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApprovedFoods;