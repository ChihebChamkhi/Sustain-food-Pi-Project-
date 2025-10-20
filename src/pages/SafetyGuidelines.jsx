import { FiAlertTriangle, FiThermometer, FiCheckSquare } from 'react-icons/fi';

const SafetyGuidelines = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Food Safety Protocols</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-orange-600" />
            Critical Rules
          </h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-600">
            <li>All perishables must be refrigerated below 40°F (4°C)</li>
            <li>No expired products (except non-perishables within 6 months)</li>
            <li>Immediate reporting of damaged packaging</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiThermometer className="text-orange-600" />
            Temperature Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="font-medium">Frozen</p>
              <p className="text-2xl">0°F</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="font-medium">Refrigerated</p>
              <p className="text-2xl">34-38°F</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="font-medium">Dry Storage</p>
              <p className="text-2xl">Below 75°F</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiCheckSquare className="text-orange-600" />
            Donation Checklist
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-5 h-5 text-orange-600" />
              Verify expiration dates
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-5 h-5 text-orange-600" />
              Check packaging integrity
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-5 h-5 text-orange-600" />
              Maintain temperature logs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;