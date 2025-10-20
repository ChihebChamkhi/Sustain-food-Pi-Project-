import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaImage, FaTimes, FaCheck, FaCheckDouble } from 'react-icons/fa';
import io from 'socket.io-client';

const UserChatPage = () => {
  const { userId: recipientId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();
  const socketRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeout = useRef();
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Get offerId from location state if available
  const offerId = location.state?.offerId;

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar === 'undefined') return null;
    if (/^https?:\/\//i.test(avatar)) return avatar;
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';
    const cleanAvatar = avatar.startsWith('/') ? avatar : `/${avatar}`;
    return `${baseUrl}${cleanAvatar}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSendImage = () => {
    if (!selectedImage || !socketRef.current?.connected) return;

    const tempId = `img-temp-${Date.now()}`;
    
    const optimisticMessage = {
      _id: tempId,
      image: imagePreview,
      sender: {
        _id: currentUser._id,
        name: currentUser.organizationName || currentUser.name,
        avatar: currentUser.avatar
      },
      recipient: {
        _id: recipientId
      },
      ...(offerId && { offerId }),
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setSelectedImage(null);
    setImagePreview(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      socketRef.current.emit('sendImage', {
        imageData: event.target.result,
        mimeType: selectedImage.type,
        senderId: currentUser._id,
        recipientId: recipientId,
        offerId: offerId,
        tempId: tempId
      }, (response) => {
        if (response?.success) {
          setMessages(prev => prev.map(msg => 
            msg._id === tempId ? response.message : msg
          ));
        } else {
          setMessages(prev => prev.map(msg => 
            msg._id === tempId ? {...msg, status: 'failed'} : msg
          ));
        }
      });
    };
    reader.readAsDataURL(selectedImage);
  };

  useEffect(() => {
    if (!currentUser?._id || !recipientId) return;
  
    const socket = io(import.meta.env?.VITE_WEBSOCKET_URL || 'http://localhost:5001', {
      auth: {
        token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        userId: currentUser._id,
        userName: currentUser.name
      },
      query: {
        userId: currentUser._id
      }
    });
  
    socketRef.current = socket;
  
    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('joinUser', currentUser._id);
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('error');
    });

    socket.on('reconnecting', (attempt) => {
      setConnectionStatus(`reconnecting (attempt ${attempt})`);
    });

    socket.on('newMessage', (message) => {
      if (!processedMessageIds.current.has(message._id)) {
        processedMessageIds.current.add(message._id);
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('typingStart', (senderId) => {
      if (senderId === recipientId) {
        setOtherUserTyping(true);
      }
    });
  
    socket.on('typingStop', (senderId) => {
      if (senderId === recipientId) {
        setOtherUserTyping(false);
      }
    });
  
    return () => {
      if (socket) socket.disconnect();
    };
  }, [currentUser?._id, recipientId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (!isTyping && socketRef.current?.connected) {
      socketRef.current.emit('typingStart', recipientId);
      setIsTyping(true);
    }
  
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  
    typingTimeout.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('typingStop', recipientId);
      }
      setIsTyping(false);
    }, 3000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !imagePreview) return;

    if (imagePreview) {
      handleSendImage();
      return;
    }

    const tempId = `temp-${Date.now()}`;
    
    try {
      setError(null);
      
      const optimisticMessage = {
        _id: tempId,
        text: newMessage.trim(),
        sender: {
          _id: currentUser._id,
          name: currentUser.organizationName || currentUser.name,
          avatar: currentUser.avatar
        },
        recipient: {
          _id: recipientId
        },
        ...(offerId && { offerId }),
        createdAt: new Date().toISOString(),
        status: 'sending',
        isOptimistic: true
      };
  
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
  
      if (socketRef.current?.connected) {
        socketRef.current.emit('sendMessage', {
          text: newMessage.trim(),
          senderId: currentUser._id,
          recipientId: recipientId,
          offerId: offerId
        }, (response) => {
          if (response?.success) {
            setMessages(prev => prev.map(msg => 
              msg._id === tempId ? {
                ...response.message,
                sender: {
                  ...response.message.sender,
                  avatar: currentUser.avatar
                }
              } : msg
            ));
          } else {
            setMessages(prev => prev.map(msg => 
              msg._id === tempId ? {...msg, status: 'failed'} : msg
            ));
            setError(response?.error || 'Failed to send message');
          }
        });
      }
    } catch (err) {
      console.error('Send error:', err);
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? {...msg, status: 'failed'} : msg
      ));
      setError(err.message);
    }
  };

  const fetchMessages = async () => {
  try {
    setLoading(true);
    setError(null);
    
    if (!currentUser?._id || !recipientId) {
      throw new Error('Missing user information');
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error('Authentication token missing');

    const url = new URL(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${currentUser._id}/${recipientId}`
    );
    
    if (offerId) {
      url.searchParams.append('offerId', offerId);
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setMessages(data.messages || []);

    // Improved otherUser handling
    const senderOfFirstMessage = data.messages?.[0]?.sender;
    const recipientOfFirstMessage = data.messages?.[0]?.recipient;
    
    setOtherUser(
      data.otherUser || 
      senderOfFirstMessage?._id === recipientId ? senderOfFirstMessage :
      recipientOfFirstMessage?._id === recipientId ? recipientOfFirstMessage :
      { _id: recipientId, name: 'Chat Participant' }
    );
    
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err.message);
    setOtherUser({ _id: recipientId, name: 'Chat Participant' }); // Better default
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (currentUser?._id && recipientId) {
      fetchMessages();
    }
  }, [currentUser?._id, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <button 
            onClick={fetchMessages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-4">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 flex justify-between items-center">
  <div className="flex items-center space-x-3">
    {otherUser?.avatar && (
      <div className="relative">
        <img 
          src={getAvatarUrl(otherUser.avatar)} 
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
          alt={otherUser.name}
        />
        {/* Online status indicator */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          connectionStatus === 'connected' ? 'bg-green-400' : 'bg-gray-400'
        }`}></div>
      </div>
    )}
    <div>
      <h2 className="font-bold text-white">
        {otherUser?.organizationName || otherUser?.name || 'Chat'}
      </h2>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-blue-100">
          {connectionStatus === 'connected' ? 'Online' : 'Offline'}
        </span>
        {otherUserTyping && (
          <span className="text-xs text-blue-100 flex items-center">
            <span className="flex space-x-1 ml-1 mr-1">
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </span>
            Typing...
          </span>
        )}
      </div>
    </div>
  </div>
  <Link 
    to="/messages" 
    className="text-white/80 hover:text-white p-1 rounded-full transition-colors hover:bg-white/10"
    aria-label="Close chat"
  >
    <FaTimes size={20} />
  </Link>
</div>

      {/* Message Area */}
      <div className="h-[70vh] p-4 overflow-y-auto bg-gray-50 bg-[url('https://transparenttextures.com/patterns/light-wool.png')]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FiMessageSquare className="text-gray-300 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Start chatting</h3>
            <p className="text-gray-400 mt-1">Send your first message to start chatting</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`flex mb-4 ${message.sender?._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender?._id !== currentUser._id && (
                <img 
                  src={getAvatarUrl(message.sender?.avatar)}
                  className="w-8 h-8 rounded-full mr-2 mt-1 object-cover"
                  alt={message.sender?.name}
                />
              )}

              <div className={`relative max-w-[75%] ${
                message.sender?._id === currentUser._id ? 'text-right' : 'text-left'
              }`}>
                <div 
                  className={`inline-block px-4 py-3 rounded-2xl ${
                    message.sender?._id === currentUser._id 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
                  }`}
                >
                  {message.text && <p className="text-sm">{message.text}</p>}
                  {message.image && (
                    <div className="mt-2">
                      <img 
                        src={message.image} 
                        alt="Sent content" 
                        className="max-w-full max-h-64 rounded-lg"
                      />
                    </div>
                  )}
                  <div className={`flex items-center mt-1 text-xs ${
                    message.sender?._id === currentUser._id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender?._id === currentUser._id && (
                      <span className="ml-1">
                        {message.read ? (
                          <FaCheckDouble className="inline" />
                        ) : (
                          <FaCheck className="inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        {otherUserTyping && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <div className="flex space-x-1 mr-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span>{otherUser?.name} is typing...</span>
          </div>
        )}

        {imagePreview && (
          <div className="relative mb-2 p-2 bg-gray-100 rounded-lg">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-full max-h-40 rounded-md"
            />
            <button 
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-800/80 text-white rounded-full p-1 hover:bg-gray-900"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label 
              htmlFor="image-upload"
              className="p-2 text-gray-500 hover:text-blue-500 rounded-full transition-colors cursor-pointer"
            >
              <FaImage size={18} />
            </label>
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && (imagePreview ? handleSendImage() : sendMessage())}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
          
          <button
            onClick={imagePreview ? handleSendImage : sendMessage}
            disabled={!newMessage.trim() && !imagePreview}
            className={`p-3 rounded-full ${
              (newMessage.trim() || imagePreview)
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400'
            } transition-colors`}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;