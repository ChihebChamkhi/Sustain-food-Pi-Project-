import { FiPieChart, FiCloud, FiDroplet, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ImpactMetrics = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Impact Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiPieChart className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">1.2M+</h2>
          </div>
          <p className="text-gray-600">Meals Saved</p>
          <p className="text-sm text-gray-500 mt-2">Equivalent to feeding 800 people daily</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiCloud className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">450K+</h2>
          </div>
          <p className="text-gray-600">CO2 Emissions Prevented</p>
          <p className="text-sm text-gray-500 mt-2">Equal to 15,000 cars off the road</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiDroplet className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">180M+</h2>
          </div>
          <p className="text-gray-600">Gallons Water Saved</p>
          <p className="text-sm text-gray-500 mt-2">Equivalent to 270 Olympic pools</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiUsers className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">85K+</h2>
          </div>
          <p className="text-gray-600">Community Members Served</p>
          <p className="text-sm text-gray-500 mt-2">Across 12 major cities</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-orange-600">Monthly Progress</h2>
        <div className="bg-orange-50 p-4 rounded-lg">
          {/* Replace with actual chart component */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Impact Visualization Chart</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Top Contributors</h3>
          <ul className="space-y-3">
            {['FreshMart Groceries', 'City Bakery Co.', 'Green Valley Farms'].map((contributor, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span>{contributor}</span>
                <span className="text-orange-600 font-medium">{(index + 1) * 12500} meals</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Real-World Impact</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FiUsers className="text-orange-600" />
              </div>
              <p className="text-gray-600">
                15 community centers powered by donations
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FiCloud className="text-orange-600" />
              </div>
              <p className="text-gray-600">
                18% reduction in local food waste
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FiDroplet className="text-orange-600" />
              </div>
              <p className="text-gray-600">
                Water savings equivalent to 500 households
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-orange-50 p-6 rounded-xl text-center">
        <h3 className="text-2xl font-semibold mb-4 text-orange-800">Join the Movement</h3>
        <p className="text-gray-600 mb-6">
          Start making an impact today. Every contribution counts!
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Become a Contributor
        </Link>
      </div>
    </div>
  );
};

export default ImpactMetrics;