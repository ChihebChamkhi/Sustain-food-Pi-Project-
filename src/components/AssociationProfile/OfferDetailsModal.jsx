import { FaMoneyBillWave, FaPercentage, FaBoxOpen, FaUser, FaInfoCircle, FaComments, FaPhone } from 'react-icons/fa';
import { useState } from 'react';
import Chat from './Chat';

const OfferDetailsModal = ({ isOpen, onClose, offer }) => {
  const [activeTab, setActiveTab] = useState('details');
  const currentUserId = localStorage.getItem('userId');

  if (!offer || !offer.userId) return null;

  const calculateProfitInfo = () => {
    if (offer.type !== 'sale') return null;
    
    
    const totalOriginalPrice = offer.originalPrice * offer.offerQuantity;
    const totalSellingPrice = offer.pricePerUnit * offer.offerQuantity;
    const profit = totalSellingPrice - totalOriginalPrice;
    const profitPercentage = (profit / totalOriginalPrice) * 100;

    return {
      totalOriginalPrice,
      totalSellingPrice,
      profit,
      profitPercentage: profitPercentage.toFixed(2) 
    };
  };

  const profitInfo = calculateProfitInfo();

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-4xl w-full z-10 max-h-[90vh] flex flex-col">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaBoxOpen className="mr-2 text-orange-500" />
              Offer Details
            </h3>
          </div>

          


          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'details' ? (
                <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <FaUser className="mt-1 mr-3 text-gray-500" />
                <div>
                  <h4 className="font-medium">Donor Information</h4>
                  <p className="text-gray-700">{offer.userId?.name || 'Anonymous'}</p>
                  <p className="text-gray-600 text-sm">{offer.userId?.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-gray-500" />
                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-gray-700">{offer.contactInfo}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaInfoCircle className="mt-1 mr-3 text-gray-500" />
                <div>
                  <h4 className="font-medium">Offer Details</h4>
                  <p className="text-gray-700">
                    {offer.offerQuantity} {offer.needId?.unit} of {offer.needId?.title}
                  </p>
                  {offer.message && (
                    <p className="text-gray-600 mt-1">"{offer.message}"</p>
                  )}
                </div>
              </div>


{offer.type === 'sale' && (
                <>
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <h4 className="font-medium text-yellow-800 flex items-center">
                      <FaMoneyBillWave className="mr-2" />
                      Sale Terms
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">Original Price (per unit)</p>
                        <p className="font-medium">{offer.originalPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Selling Price (per unit)</p>
                        <p className="font-medium">{offer.pricePerUnit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Original</p>
                        <p className="font-medium">{profitInfo.totalOriginalPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Selling</p>
                        <p className="font-medium">{profitInfo.totalSellingPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <FaPercentage className="mr-2" />
                      Association's Gain
                    </h4>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Profit Amount</p>
                      <p className="font-medium text-green-700">{profitInfo.profit}</p>
                      <p className="text-sm text-gray-600 mt-1">Profit Percentage</p>
                      <p className="font-medium text-green-700">{profitInfo.profitPercentage}%</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      By accepting this offer, your association will gain {profitInfo.profitPercentage}% profit.
                    </p>
                  </div>
                </>
              )}
            
            
          
              </div>
            ) : (
              <Chat 
                TheId={offer._id} 
                currentUserId={currentUserId} 
                otherUserId={offer.userId._id}
              />
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 flex justify-end border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsModal;