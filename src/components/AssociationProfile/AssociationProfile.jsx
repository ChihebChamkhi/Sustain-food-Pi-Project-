import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {
  FaUser, FaSlidersH, FaHandshake, FaClipboardList, FaCog,
  FaHeart, FaCalendarAlt, FaBoxOpen
} from "react-icons/fa";
import OfferPredictions from './OfferPredictions';

const AssociationProfile = () => {
  const { user } = useAuth();
    
  const stats = [
    { value: "24", label: "Active Needs", icon: <FaClipboardList className="text-blue-500" /> },
    { value: "18", label: "Offers Received", icon: <FaHandshake className="text-green-500" /> },
    { value: "127kg", label: "Food Saved", icon: <FaBoxOpen className="text-orange-500" /> },
    { value: "32", label: "Days Active", icon: <FaCalendarAlt className="text-purple-500" /> }
  ];

useEffect(() => {
    document.title = "Profile";
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative mt-20 text-white p-8 text-center min-h-[150px] flex items-center justify-center" style={{backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661756423422-4486e27eb6dd?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-700/80"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="mb-2 text-3xl font-bold">Welcome Back, {user.name} !</h1>
          <p className="text-lg opacity-90">
            Your work has helped redistribute <span className="font-bold">1.2 tons</span> of food this month. 
            Keep making a difference! 🌱
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 mx-auto md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 p-4 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
            <div className="text-2xl">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col max-w-6xl gap-6 px-4 py-8 mx-auto lg:flex-row">
        {/* Left Column - Offer Predictions (Full height) */}
        <div className="lg:w-1/3">
          
            <OfferPredictions associationId={user._id} />
          
        </div>

        {/* Right Column - Other Cards (3x2 grid) */}
        <div className="grid grid-cols-1 gap-6 lg:w-2/3 md:grid-cols-2">
          {[
            {
              to: "/association/account",
              icon: <FaUser className="w-6 h-6" />,
              title: "Account Information",
              desc: "Update your association details",
              color: "blue"
            },
            {
              to: "/association/preferences",
              icon: <FaSlidersH className="w-6 h-6" />,
              title: "Donation Preferences",
              desc: "Set what food types you accept",
              color: "green"
            },
            {
              to: "/association/offers",
              icon: <FaHandshake className="w-6 h-6" />,
              title: "Offers Management",
              desc: "Review and accept donations",
              color: "purple"
            },
            {
              to: "/my-donation-needs",
              icon: <FaClipboardList className="w-6 h-6" />,
              title: "My Needs",
              desc: "Manage your current requests",
              color: "orange"
            },
            {
              to: "/association/settings",
              icon: <FaCog className="w-6 h-6" />,
              title: "Settings",
              desc: "Delete account & Notifications",
              color: "red"
            },
            {
              custom: (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 text-yellow-600 bg-yellow-100 rounded-full">
                      <FaHeart className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Your Impact</h2>
                      <p className="text-sm text-gray-600">Last 30 days:</p>
                    </div>
                  </div>
                  <ul className="mt-auto space-y-1 text-xs">
                    <li>✅ Fed <strong>84 families</strong></li>
                    <li>✅ Saved <strong>127kg CO₂</strong></li>
                    <li>✅ Partnered with <strong>6 new donors</strong></li>
                  </ul>
                </div>
              ),
              color: "yellow"
            }
          ].map((card, index) => (
            card.to ? (
              <Link 
                key={index}
                to={card.to}
                className={`group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-${card.color}-500 h-full min-h-[180px]`}
              >
                <div className="flex items-center h-full gap-4">
                  <div className={`p-3 rounded-full bg-${card.color}-100 text-${card.color}-600 group-hover:bg-${card.color}-200 transition-colors`}>
                    {card.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{card.title}</h2>
                    <p className="text-sm text-gray-600">{card.desc}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div 
                key={index}
                className={`group bg-white p-6 rounded-xl shadow-md border-l-4 border-${card.color}-500 h-full min-h-[180px]`}
              >
                {card.custom}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociationProfile;