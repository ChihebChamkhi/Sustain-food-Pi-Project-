import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiClock } from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';

const UserChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser?._id) {
        throw new Error('User ID not available');
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await fetch(
        `http://localhost:5000/api/messages/conversations/${currentUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Server returned invalid data format');
      }

      setConversations(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchConversations();
    }
  }, [currentUser?._id]);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return '/default-avatar.png';
    if (avatar.startsWith('http')) return avatar;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${avatar}`;
  };

  if (!currentUser) {
    return <div className="pt-20 p-4">Loading user information...</div>;
  }

  if (loading) {
    return (
      <div className="pt-20 mt-20 p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 p-4">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={fetchConversations}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-12 max-w-2xl mx-auto p-4">
      <div className="pt-20 flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiMessageSquare className="mr-2" /> My Conversations
        </h2>
        <span className="text-sm text-gray-500">
          {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
        </span>
      </div>
      
      {conversations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiMessageSquare className="mx-auto text-gray-400 text-4xl mb-3" />
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-sm text-gray-400 mt-1">Start a new conversation to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <Link
              key={conv._id}
              to={`/chat/${conv._id}`}
              state={{ offerId: conv.lastMessage?.offerId }}
              className="block p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img 
                    src={getAvatarUrl(conv.user?.avatar)}
                    alt={conv.user?.organizationName || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conv.user?.organizationName || conv.user?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center whitespace-nowrap ml-2">
                      <FiClock className="mr-1" />
                      {formatTime(conv.lastMessage?.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conv.lastMessage?.text || 'Start conversation !'}
                    </p>
                    {conv.lastMessage?.read && conv.lastMessage.sender !== currentUser._id && (
                      <IoCheckmarkDone className="ml-2 text-blue-500" />
                    )}
                  </div>
                  
                  
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserChatList;