import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiInfo, FiMail } from 'react-icons/fi';

const RegistrationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">Registration Guide</h1>
        <p className="text-gray-600 text-lg">Get started in 3 simple steps</p>
      </header>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="font-bold text-xl">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Account Type Selection
                <FiInfo className="text-orange-500 text-lg" />
              </h2>
              <p className="text-gray-600 mb-4">
                Choose between three specialized account types tailored for different users:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><span className="font-medium">Business:</span> Food providers & donors</li>
                <li><span className="font-medium">Individual:</span> Personal food recipients</li>
                <li><span className="font-medium">Association:</span> Non-profits & organizations</li>
              </ul>
              <Link 
                to="/help/account-types" 
                className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                Compare account types <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="font-bold text-xl">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-600 mb-2">Required Information</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Legal name or business name</li>
                    <li>Valid email address</li>
                    <li>Physical address</li>
                    <li>Contact phone number</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-600 mb-2">Optional Information</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Profile picture</li>
                    <li>Social media links</li>
                    <li>Organization description</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="font-bold text-xl">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Email Verification
                <FiMail className="text-orange-500" />
              </h2>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-3">
                  After submitting your registration, you'll receive a verification email within 
                  <span className="font-medium"> 5 minutes</span>. This email contains:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Account activation link</li>
                  <li>Welcome message with next steps</li>
                  <li>Important security information</li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-orange-600">
                  <FiCheckCircle />
                  <span className="font-medium">Verification link expires in 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources Section */}
      <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
        <h3 className="text-2xl font-semibold text-orange-800 mb-6">Essential Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/help/account-types" 
            className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FiArrowRight className="text-2xl text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-1">Account Types</h4>
                <p className="text-gray-600 text-sm">Detailed comparison of features and requirements</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/safety" 
            className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-1">Safety Guidelines</h4>
                <p className="text-gray-600 text-sm">Food handling and distribution protocols</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <Link
          to="/create-account"
          className="inline-block px-8 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-lg"
        >
          Start Registration Now
        </Link>
      </div>
    </div>
  );
};

export default RegistrationGuide;