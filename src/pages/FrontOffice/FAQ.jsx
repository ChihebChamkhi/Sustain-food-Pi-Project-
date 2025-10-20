import React, { useState, useEffect } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FiSearch, FiExternalLink } from "react-icons/fi";
import { FaLeaf, FaHandsHelping, FaStore, FaUserFriends, FaQuestionCircle } from "react-icons/fa";
import axios from "axios"; // Make sure to install axios: npm install axios
const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Primary color from your app (#E84D1D)
  const primaryColor = "#E84D1D";
  const primaryLight = "bg-orange-100";
  const primaryDark = "bg-orange-800";
    const API_BASE_URL = "http://localhost:5000/api";


  // Simulate API fetch for FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setFaqs([
          {
            id: 1,
            question: "How do I sign up as a business or individual?",
            answer: "Click the 'Sign Up' button at the top right of the homepage and select your account type (Business, Individual, or Association). You'll need to provide basic information and verify your email address.",
            category: "general",
            relatedLinks: [
              { text: "Registration guide", url: "/help/registration" },
              { text: "Account types explained", url: "/help/account-types" }
            ]
          },
          {
            id: 2,
            question: "How do businesses post food donations?",
            answer: "Business accounts can access the donation dashboard after logging in. Click 'Post Donation' to add details about available food items, including type, quantity, and pickup window. Photos are recommended to increase visibility.",
            category: "business",
            relatedLinks: [
              { text: "Business dashboard tutorial", url: "/business-guide" }
            ]
          },
          {
            id: 3,
            question: "How can individuals or associations reserve food?",
            answer: "Browse available donations on the marketplace page. Click on any listing to see details, then use the 'Reserve' button to claim items. You'll receive confirmation and pickup instructions via email and in your account dashboard.",
            category: "individual",
            relatedLinks: [
              { text: "Marketplace guide", url: "/marketplace-help" }
            ]
          },
          {
            id: 4,
            question: "What food safety standards are followed for donated food?",
            answer: "All food donations must meet our Food Safety Guidelines. Businesses are required to confirm food has been stored properly and is within safe consumption timeframes. We recommend always checking items upon pickup. Perishable items must be properly refrigerated and within their use-by dates.",
            category: "safety",
            relatedLinks: [
              { text: "Food safety guidelines", url: "/safety" },
              { text: "Donation checklist", url: "/donation-checklist" }
            ]
          },
          {
            id: 5,
            question: "How does the platform track our impact?",
            answer: "Your dashboard includes real-time metrics showing meals saved, CO2 emissions prevented, and community impact. Businesses receive monthly reports, while associations get data on meals provided to their communities.",
            category: "impact",
            relatedLinks: [
              { text: "Impact metrics explained", url: "/impact" }
            ]
          },
          {
            id: 6,
            question: "Are there any fees for using the platform?",
            answer: "No, our platform is completely free for all users. We're funded by grants and donations to keep food redistribution accessible to everyone.",
            category: "general"
          },
          {
            id: 7,
            question: "What types of food can be donated?",
            answer: "Most non-perishable and properly stored perishable foods can be donated. We accept fresh produce, baked goods, packaged foods, and prepared meals that meet safety standards. Alcohol, homemade canned goods, and expired items cannot be listed.",
            category: "business",
            relatedLinks: [
              { text: "Approved food items", url: "/approved-foods" }
            ]
          },
          {
            id: 8,
            question: "How quickly must donated food be collected?",
            answer: "This depends on the food type. Perishable items typically need pickup within 2-4 hours of posting, while non-perishables may have longer windows. Each listing shows the available pickup timeframe.",
            category: "logistics"
          }
        ]);
        setIsLoading(false);
      }, 800);
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = [
    { id: "all", name: "All FAQs", icon: <FaLeaf className="mr-2" /> },
    { id: "general", name: "General", icon: <FaUserFriends className="mr-2" /> },
    { id: "business", name: "Business", icon: <FaStore className="mr-2" /> },
    { id: "individual", name: "Individuals", icon: <FaUserFriends className="mr-2" /> },
    { id: "safety", name: "Safety", icon: <FaHandsHelping className="mr-2" /> }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch(category) {
      case "business": return "bg-blue-100 text-blue-800";
      case "individual": return "bg-green-100 text-green-800";
      case "safety": return "bg-red-100 text-red-800";
      case "impact": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      setSubmitStatus('error');
      return;
    }
  
    setSubmitStatus('submitting');
  
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, {
        content: newQuestion.trim()
      }, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status >= 200 && status < 500
      });
  
      if (response.status === 201) {
        setSubmitStatus('success');
        setNewQuestion('');
        setTimeout(() => {
          setShowQuestionForm(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Now with your orange color */}
      <div 
        className="py-20 px-5 text-center text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Find answers about donating, receiving, and making an impact through food redistribution
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Categories - Fixed search functionality */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search FAQs (e.g. 'donation', 'safety', 'reserve')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: primaryColor }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-4 py-2 rounded-full ${activeCategory === cat.id ? 'text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                style={{ backgroundColor: activeCategory === cat.id ? primaryColor : '' }}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
          </div>
        ) : filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(faq.category)} mb-2`}>
                      {categories.find(c => c.id === faq.category)?.name || 'General'}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800">{faq.question}</h2>
                  </div>
                  <span className="text-gray-500 ml-4 mt-1">
                    {openIndex === index ? <BiChevronUp size={24} /> : <BiChevronDown size={24} />}
                  </span>
                </div>
                
                {openIndex === index && (
                  <div className="mt-4 pl-1">
                    <p className="text-gray-600 mb-4">{faq.answer}</p>
                    
                    {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Related resources:</h4>
                        <ul className="space-y-2">
                          {faq.relatedLinks.map((link, i) => (
                            <li key={i}>
                              <a 
                                href={link.url} 
                                className="flex items-center hover:underline"
                                style={{ color: primaryColor }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FiExternalLink className="mr-2" />
                                {link.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No FAQs found</h3>
            <p className="text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        )}

       {/* Submit Question Section */}
<div className="mt-16 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
  <div className="flex items-center mb-4">
    <FaQuestionCircle className="text-2xl mr-3" style={{ color: primaryColor }} />
    <h2 className="text-2xl font-bold text-gray-800">Can't find your answer?</h2>
  </div>
  
  {!showQuestionForm ? (
    <button
      onClick={() => setShowQuestionForm(true)}
      className="px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
      style={{ backgroundColor: primaryColor, color: 'white' }}
    >
      Submit a New Question
    </button>
  ) : (
    <form onSubmit={handleSubmitQuestion} className="mt-4">
      <div className="mb-4">
        <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
          Your Question
        </label>
        <textarea
          id="question"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ 
            focusRingColor: primaryColor,
            borderColor: submitStatus === 'error' ? '#dc2626' : '#e5e7eb'
          }}
          value={newQuestion}
          onChange={(e) => {
            setNewQuestion(e.target.value);
            if (submitStatus === 'error') setSubmitStatus(null);
          }}
          placeholder="Type your question here..."
          disabled={submitStatus === 'submitting'}
          required
        ></textarea>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          className="px-6 py-3 rounded-lg font-medium disabled:opacity-70 flex items-center gap-2"
          style={{ backgroundColor: primaryColor, color: 'white' }}
          disabled={submitStatus === 'submitting'}
        >
          {submitStatus === 'submitting' && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Question'}
        </button>

        {submitStatus === 'success' && (
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Thank you! We'll review your question.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center text-red-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Submission failed. Please try again.</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setShowQuestionForm(false);
            setSubmitStatus(null);
            setNewQuestion('');
          }}
          className="px-6 py-3 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )}
</div>

        {/* Additional Help Section */}
        <div 
          className="mt-8 rounded-xl p-8 border"
          style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to assist you with any questions about food donations, reservations, or platform features.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ backgroundColor: primaryColor, color: 'white' }}
            >
              Contact Support
            </a>
            <a
              href="/help-center"
              className="px-6 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium border"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;