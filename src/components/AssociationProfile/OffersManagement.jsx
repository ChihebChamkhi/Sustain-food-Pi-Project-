import { useState, useEffect, useRef } from 'react';
import { FaCheck, FaTimes, FaEye, FaMoneyBillWave, FaGift, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
import OfferDetailsModal from './OfferDetailsModal';
import Pagination from '../Pagination';
import ChatModal from './Chat';
import { useAuth } from '../../context/AuthContext';



const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNeed, setSelectedNeed] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentChatOffer, setCurrentChatOffer] = useState(null);
  
  const { user: currentUser } = useAuth();



  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNeed, statusFilter]);

  const handleStartChat = (offer) => {
    if (!currentUser) {
    console.error("Cannot start chat - no current user");
    }
    console.log("Chat button clicked", offer._id); // Debug log
    setCurrentChatOffer(offer);
    setChatOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
       
        const needsRes = await fetch('http://localhost:5000/api/donation-needs/myneeds', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!needsRes.ok) {
          const errorData = await needsRes.json();
          throw new Error(errorData.message || `HTTP error! status: ${needsRes.status}`);
        }
    
        const needsData = await needsRes.json();
        setNeeds(needsData || []);
    
        
        const offersRes = await fetch('http://localhost:5000/api/help-offers/offers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!offersRes.ok) {
          const errorData = await offersRes.json();
          throw new Error(errorData.message || `HTTP error! status: ${offersRes.status}`);
        }
    
        const offersData = await offersRes.json();
        console.log("Fetched offers:", offersData);
        setOffers(offersData || []);
    
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to load data. Please try again.");
        setOffers([]);
        setNeeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const notificationTimeout = useRef();

 
  const showNotification = (message, type = 'success') => {
   
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    setNotification({
      show: true,
      message,
      type
    });

   
    notificationTimeout.current = setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 3000);
  };

  
  useEffect(() => {
    return () => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, []);

  const filteredOffers = offers.filter(offer => {
  
    if (!offer.needId) return false;
    
    const matchesNeed = selectedNeed === 'all' || offer.needId._id === selectedNeed;
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    
    return matchesNeed && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading offers...</div>;
  }

 
  const handleViewOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/help-offers/${offerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSelectedOffer(data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to load offer details");
    }
  };


  const handleStatusChange = async (offerId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/help-offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Status update failed');

      
      setOffers(offers.map(offer => 
        offer._id === offerId ? { ...offer, status: newStatus } : offer
      ));

      showNotification(
  `Offer ${newStatus}. The list will update shortly.`,
  newStatus === 'accepted' ? 'success' : 'error'
);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);


const handlePageChange = (page) => {
  setCurrentPage(page);
};
  

  return (
    <div className="mt-10 min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {notification.show && (
        <div className={`fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg animate-fade-in
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
          <button 
            onClick={() => setNotification(prev => ({...prev, show: false}))}
            className="ml-3 font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Offers Management</h1>

          

          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          
          <select 
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>

          
          <select 
          value={selectedNeed}
          onChange={(e) => setSelectedNeed(e.target.value)}
          className="border rounded p-2 flex-grow"
        >
          <option value="all">All Needs</option>
          {needs.map(need => (
            <option key={need._id} value={need._id}>
              {need.title} ({need.status})
            </option>
          ))}
        </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2 flex-grow"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No offers found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">

        <div className="text-sm text-gray-500 mb-2">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOffers.length)} of {filteredOffers.length} offers
        </div>

            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Donor</th>
                  <th className="p-3 text-left">Need</th>
                  <th className="p-3 text-left">Offer Details</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
              {currentOffers.map((offer) => (
  <tr key={offer._id}>
    
      <td className="p-3">
        <div className="font-medium">
          {offer.userId?.name || 'Anonymous'}
        </div>
        <div className="text-sm text-gray-500">
          {offer.contactInfo}
        </div>
      </td>
      <td className="p-3">
        <div className="font-medium">
          {offer.needId?.title || 'Need not available'}
        </div>
        {offer.needId?.quantity && (
          <div className="text-sm text-gray-500">
            {offer.needId.quantity} {offer.needId.unit}
          </div>
        )}
      </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {offer.offerQuantity} {offer.needId?.unit || 'units'}
                      </div>
                      {offer.type === 'sale' && (
                        <div className="text-sm text-gray-500">
                          {offer.pricePerUnit} per unit (Total: {offer.pricePerUnit * offer.offerQuantity})
                        </div>
                      )}
                      {offer.message && (
                        <div className="text-sm text-gray-500 mt-1">
                          "{offer.message}"
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {offer.type === 'sale' ? (
                          <>
                            <FaMoneyBillWave className="text-yellow-500 mr-1" />
                            <span>Sale</span>
                          </>
                        ) : (
                          <>
                            <FaGift className="text-green-500 mr-1" />
                            <span>Donation</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="p-3 flex space-x-2">
        <button 
          onClick={() => handleViewOffer(offer._id)}
          className="p-2 text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <FaEye />
        </button>
        <button 
          onClick={() => handleStatusChange(offer._id, 'accepted')}
          disabled={offer.status === 'accepted'}
          className={`p-2 ${offer.status === 'accepted' 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-green-600 hover:text-green-800'}`}
          title="Accept Offer"
        >
          <FaCheck />
        </button>
        <button 
          onClick={() => handleStatusChange(offer._id, 'rejected')}
          disabled={offer.status === 'rejected'}
          className={`p-2 ${offer.status === 'rejected' 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-red-600 hover:text-red-800'}`}
          title="Reject Offer"
        >
          <FaTimes />
        </button>
        <button 
        onClick={() => handleStartChat(offer)} // Ensure this exists
        className="p-2 text-purple-600 hover:text-purple-800"
        title="Chat with donor"
      >
        <FaComments />
      </button>
      </td>

      {/* Offer Details Modal */}
      <OfferDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
      />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {filteredOffers.length > itemsPerPage && (
  <div className="mt-4 flex justify-center">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </div>)}
  {chatOpen && currentChatOffer && (
  <ChatModal
    isOpen={chatOpen}
    onClose={() => setChatOpen(false)}
    offer={currentChatOffer}
    currentUser={currentUser}
  />
)}
    </div>
  );
};

export default OffersManagement;