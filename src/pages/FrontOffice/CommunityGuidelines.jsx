import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import ChatBot from "../../components/ChatBot";

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Chatbot Component */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-[#E84D1D] to-[#FF6B35]">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container relative px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Community Guidelines for Food Waste Reduction
            </h1>
            <p className="text-xl text-orange-100">
              Creating a sustainable future through responsible food sharing and waste reduction
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12 mx-auto">
        {/* Introduction Section */}
        <section className="max-w-4xl mx-auto mb-16 text-center">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Our Commitment</h2>
            <p className="mb-4 text-lg text-gray-600">
              At our core, we believe that reducing food waste is not just an environmental imperative but a moral obligation. 
              These guidelines establish the standards for participation in our community-driven food sharing platform.
            </p>
            <p className="text-lg text-gray-600">
              By following these principles, we can collectively make a meaningful impact while ensuring a safe, respectful, 
              and positive experience for all members.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "🌱",
                title: "Sustainability First",
                description: "We prioritize environmental stewardship through practical food waste reduction strategies that benefit both people and planet.",
                color: "text-green-600"
              },
              {
                icon: "🤝",
                title: "Community Focus",
                description: "We foster meaningful connections between members who share our vision for responsible food distribution.",
                color: "text-blue-600"
              },
              {
                icon: "🔍",
                title: "Transparency",
                description: "We maintain open communication about food quality, safety standards, and sharing processes.",
                color: "text-purple-600"
              }
            ].map((value, index) => (
              <div key={index} className="p-8 text-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <span className={`text-5xl mb-4 ${value.color}`}>{value.icon}</span>
                <h3 className="mb-4 text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines Accordion */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Community Standards
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: "Food Safety & Quality Standards",
                content: (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>All shared food must be fresh, properly stored, and safe for consumption</li>
                    <li>Clearly label items with preparation date and ingredients when possible</li>
                    <li>Follow proper food handling guidelines during transport and storage</li>
                    <li>Never share food that shows signs of spoilage or contamination</li>
                  </ul>
                )
              },
              {
                title: "Respectful Community Engagement",
                content: (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Treat all members with dignity and respect regardless of background</li>
                    <li>Maintain appropriate communication in all interactions</li>
                    <li>Respect privacy and personal boundaries</li>
                    <li>No discriminatory language or behavior will be tolerated</li>
                  </ul>
                )
              },
              {
                title: "Responsible Sharing Practices",
                content: (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Only offer quantities you can reasonably provide</li>
                    <li>Be punctual and reliable for scheduled pickups</li>
                    <li>Clearly communicate any changes or cancellations</li>
                    <li>Respect the needs of those receiving food donations</li>
                  </ul>
                )
              },
              {
                title: "Legal & Regulatory Compliance",
                content: (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Adhere to all local health department regulations</li>
                    <li>Follow food safety laws applicable in your region</li>
                    <li>Understand liability protections under Good Samaritan laws</li>
                    <li>Maintain proper documentation when required</li>
                  </ul>
                )
              }
            ].map((item, index) => (
              <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md">
                <button
                  className="flex items-center justify-between w-full p-6 text-left"
                  onClick={() => toggleSection(index)}
                  aria-expanded={openSection === index}
                  aria-controls={`section-${index}`}
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <span className="text-gray-600">
                    {openSection === index ? <BiChevronUp size={25} /> : <BiChevronDown size={25} />}
                  </span>
                </button>
                {openSection === index && (
                  <div id={`section-${index}`} className="p-6 pt-0 text-gray-600">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Participation Guide */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            How to Participate Effectively
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "📦",
                title: "For Food Donors",
                steps: [
                  "Take clear photos of items you're sharing",
                  "Provide accurate descriptions and quantities",
                  "Specify pickup location and availability window",
                  "Follow through with commitments"
                ]
              },
              {
                icon: "🛒",
                title: "For Food Receivers",
                steps: [
                  "Only reserve what you'll actually use",
                  "Arrive on time for scheduled pickups",
                  "Bring appropriate containers when needed",
                  "Express gratitude to donors"
                ]
              },
              {
                icon: "🌟",
                title: "For Community Advocates",
                steps: [
                  "Help educate others about food waste",
                  "Share success stories and best practices",
                  "Volunteer to coordinate larger donations",
                  "Provide constructive feedback"
                ]
              }
            ].map((role, index) => (
              <div key={index} className="p-8 bg-white rounded-lg shadow-md">
                <span className="block mb-4 text-5xl text-center">{role.icon}</span>
                <h3 className="mb-4 text-xl font-semibold text-center">{role.title}</h3>
                <ul className="space-y-3 list-disc list-inside">
                  {role.steps.map((step, i) => (
                    <li key={i} className="text-gray-600">{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Enforcement Section */}
        <section className="max-w-4xl p-8 mx-auto mb-16 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Policy Enforcement
          </h2>
          <p className="mb-4 text-gray-600">
            To maintain the integrity of our community, we enforce these guidelines through:
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Education",
                description: "First-time issues result in guidance on proper procedures"
              },
              {
                title: "Warning",
                description: "Repeated violations lead to formal warnings"
              },
              {
                title: "Restriction",
                description: "Serious or continued violations may result in account suspension"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 text-center bg-gray-50 rounded-lg">
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            We investigate all reported violations thoroughly and fairly. If you encounter any issues, please report them through our contact form.
          </p>
        </section>

        {/* Call to Action */}
        <section className="max-w-2xl p-8 mx-auto text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Ready to Make a Difference?
          </h2>
          <p className="mb-6 text-gray-600">
            Join our growing community of individuals and organizations committed to reducing food waste while helping those in need.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/create-account")}
              className="px-6 py-3 font-medium text-white bg-[#E84D1D] rounded-lg hover:bg-[#C53D0D] focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2"
            >
              Join Our Community
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-6 py-3 font-medium text-[#E84D1D] bg-white border border-[#E84D1D] rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2"
            >
              Learn More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityGuidelines;