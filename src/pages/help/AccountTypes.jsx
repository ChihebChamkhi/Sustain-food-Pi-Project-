import { Link } from 'react-router-dom';
import { FaBuilding, FaUser, FaHandsHelping, FaQuestionCircle } from 'react-icons/fa';

const AccountTypes = () => {
  const accountTypes = [
    {
      type: 'Business',
      icon: <FaBuilding className="text-3xl text-orange-600" />,
      description: 'For restaurants, grocery stores, food producers, and other commercial entities',
      features: [
        'Post food donations',
        'Track donation history',
        'Generate impact reports',
        'Manage multiple locations',
        'Access business analytics'
      ],
      requirements: [
        'Valid business license',
        'Tax identification number',
        'Commercial kitchen certification (for prepared foods)'
      ]
    },
    {
      type: 'Individual',
      icon: <FaUser className="text-3xl text-orange-600" />,
      description: 'For personal users seeking food donations',
      features: [
        'Browse available donations',
        'Reserve food items',
        'Receive pickup notifications',
        'Save favorite providers',
        'Track personal usage'
      ],
      requirements: [
        'Government-issued ID',
        'Proof of address',
        'Income verification (optional)'
      ]
    },
    {
      type: 'Association',
      icon: <FaHandsHelping className="text-3xl text-orange-600" />,
      description: 'For non-profits, charities, and community organizations',
      features: [
        'Bulk reservation capabilities',
        'Team management tools',
        'Custom distribution schedules',
        'Impact reporting dashboard',
        'Grant tracking integration'
      ],
      requirements: [
        '501(c)(3) certification',
        'Organization EIN',
        'Board member contact information'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-orange-600 flex items-center gap-3">
        <FaQuestionCircle />
        Account Types Explained
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {accountTypes.map((account, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-orange-50">
            <div className="flex items-center gap-4 mb-6">
              {account.icon}
              <h2 className="text-xl font-bold text-gray-800">{account.type}</h2>
            </div>
            
            <p className="text-gray-600 mb-6">{account.description}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold text-orange-600 mb-3">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {account.features.map((feature, fIndex) => (
                  <li key={fIndex} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-orange-600 mb-3">Requirements:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {account.requirements.map((requirement, rIndex) => (
                  <li key={rIndex} className="text-gray-600">{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">Comparison Guide</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-center">Business</th>
                <th className="p-3 text-center">Individual</th>
                <th className="p-3 text-center">Association</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-orange-100">
                <td className="p-3">Daily Donation Limit</td>
                <td className="p-3 text-center">Unlimited</td>
                <td className="p-3 text-center">3 Reservations</td>
                <td className="p-3 text-center">Custom</td>
              </tr>
              <tr className="border-b border-orange-100">
                <td className="p-3">Analytics Access</td>
                <td className="p-3 text-center">✓</td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">✓</td>
              </tr>
              <tr className="border-b border-orange-100">
                <td className="p-3">Team Members</td>
                <td className="p-3 text-center">Up to 10</td>
                <td className="p-3 text-center">1</td>
                <td className="p-3 text-center">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-orange-600">Need Help Choosing?</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/help/registration"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Registration Guide
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountTypes;