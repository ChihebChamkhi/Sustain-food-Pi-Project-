import { useState, useEffect, useRef } from 'react';
import { FaImage, FaTimes, FaPaperPlane, FaCheck, FaCheckDouble } from 'react-icons/fa';
import io from 'socket.io-client';

const ChatModal = ({ isOpen, onClose, offer, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Check file size (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  setSelectedImage(file);
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (event) => {
    setImagePreview(event.target.result);
  };
  reader.readAsDataURL(file);
};

// Add this function to remove the selected image
const removeImage = () => {
  setSelectedImage(null);
  setImagePreview(null);
};

// Add this function to send the image
const handleSendImage = () => {
  console.log('Attempting to send image...');
  if (!selectedImage) {
    console.error('No image selected');
    return;
  }
  if (!socketRef.current?.connected) {
    console.error('WebSocket not connected');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64Data = event.target.result;
    console.log('Image converted to base64, size:', base64Data.length);
    
    console.log('Emitting sendImage event to:', {
      recipientId: offer.userId._id,
      offerId: offer._id,
      imageSize: base64Data.length
    });
    
    socketRef.current.emit('sendImage', {
      imageData: base64Data,
      mimeType: selectedImage.type,
      senderId: currentUser._id,
      recipientId: offer.userId._id,
      offerId: offer._id,
      tempId: `img-temp-${Date.now()}`
    }, (response) => {
      console.log('Server response:', response);
    });
  };
  reader.readAsDataURL(selectedImage);
};



  const getAvatarUrl = (avatar) => {
  // If avatar is undefined/null
  if (!avatar) return '/default-avatar.png';
  
  // If avatar is an object with url property (like Mongoose populated data)
  if (typeof avatar === 'object' && avatar.url) {
    return avatar.url.startsWith('http') 
      ? avatar.url 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${avatar.url.startsWith('/') ? '' : '/'}${avatar.url}`;
  }
  
  // If avatar is already a full URL
  if (typeof avatar === 'string' && avatar.startsWith('http')) {
    return avatar;
  }
  
  // If avatar is a path (relative or absolute)
  if (typeof avatar === 'string') {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return avatar.startsWith('/') 
      ? `${baseUrl}${avatar}`
      : `${baseUrl}/${avatar}`;
  }
  
  // Default fallback
  return '/default-avatar.png';
};

  
  const getConnectionStatusColor = (status) => {
    switch (true) {
      case status === 'connected': return 'bg-green-500';
      case status.includes('reconnecting'): return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };
  
  const getConnectionStatusText = (status) => {
    switch (true) {
      case status === 'connected': return 'Connected';
      case status === 'disconnected': return 'Disconnected';
      case status.includes('reconnecting'): return status;
      case status === 'error': return 'Connection Error';
      default: return 'Connecting...';
    }
  };

  // Load all messages for this offer when modal opens
  useEffect(() => {
    if (!isOpen || !offer?._id || !currentUser?._id) return;

    

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env?.VITE_API_URL || 'http://localhost:5000'}/api/messages/${currentUser._id}/${offer.userId._id}?offerId=${offer._id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        const existingIds = new Set(data.messages.map(msg => msg._id));
        processedMessageIds.current = existingIds;
        
        setMessages(data.messages);
        
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [isOpen, offer, currentUser]);

  // Socket initialization and message handling
  useEffect(() => {
    if (!isOpen || !offer?._id || !currentUser?._id) return;

    const socket = io(import.meta.env?.VITE_WEBSOCKET_URL || 'http://localhost:5001', {
      auth: {
        token: localStorage.getItem('token'),
        userId: currentUser._id, // Make sure to include userId
        userName: currentUser.name
      },
      query: {
        offerId: offer._id,
        userId: currentUser._id
      }
    });

    socketRef.current = socket;

    // Connection events
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

    socket.on('reconnect_failed', () => {
      setConnectionStatus('disconnected');
    });

    // Message handling
    socket.on('newMessage', (message) => {
  console.log('Received message:', {
    id: message._id,
    type: message.image ? 'image' : 'text',
    from: message.sender._id,
    imageSize: message.image?.length
  });
  
  if (!processedMessageIds.current.has(message._id)) {
    setMessages(prev => [...prev, message]);
  }
});

    socket.on('typingStart', (senderId) => {
      console.log('Received typingStart from:', senderId);
      if (senderId === offer.userId._id) {
        setOtherUserTyping(true);
      }
    });
  
    socket.on('typingStop', (senderId) => {
      console.log('Received typingStop from:', senderId);
      if (senderId === offer.userId._id) {
        setOtherUserTyping(false);
      }
    });

    socket.on('messagesRead', ({ messageIds, readAt }) => {
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg._id) 
          ? { ...msg, read: true, readAt }
          : msg
      ));
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, offer, currentUser]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    
    if (!isTyping && socketRef.current?.connected) {
      console.log('Emitting typingStart to:', offer.userId._id);
      socketRef.current.emit('typingStart', offer.userId._id);
      setIsTyping(true);
    }
  
   
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  
    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeout.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        console.log('Emitting typingStop to:', offer.userId._id);
        socketRef.current.emit('typingStop', offer.userId._id);
      }
      setIsTyping(false);
    }, 3000);
  };

  // Auto-scroll and typing indicators
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current?.connected) return;
  
    const tempId = `temp-${Date.now()}`;
    const messageData = {
      text: newMessage.trim(),
      senderId: currentUser._id,
      recipientId: offer.userId._id,
      offerId: offer._id
    };
  
    // Optimistic update with complete sender info
    const optimisticMessage = {
      _id: tempId,
      text: newMessage.trim(),
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar // Include avatar
      },
      recipient: {
        _id: offer.userId._id
      },
      offerId: offer._id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
  
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
  
    socketRef.current.emit('sendMessage', messageData, (response) => {
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

  useEffect(() => {
    if (!isOpen || !socketRef.current?.connected || !messages.length) return;
  
    // Get unread messages sent TO current user (FROM the other user)
    const unreadMessages = messages.filter(
      msg => msg.sender === offer.userId._id && 
             msg.recipient === currentUser._id && 
             !msg.read
    );
  
    if (unreadMessages.length > 0) {
      console.log('Marking messages as read from sender:', offer.userId._id);
      socketRef.current.emit('markMessagesAsRead', {
        messageIds: unreadMessages.map(msg => msg._id),
        senderId: offer.userId._id  // This is the ID of who sent the messages
      });
    }
  }, [messages, isOpen, currentUser._id, offer.userId._id]);


  if (!isOpen) return null;


 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    {/* Chat Container - Noticeable Card Style */}
    <div className="bg-white rounded-2xl w-full max-w-lg h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
      
    {/* Header - Enhanced with Connection Status */}
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-500">
  <div className="flex items-center space-x-3">
    {/* Avatar with Online Status Indicator */}
    <div className="relative">
  {offer.userId?.avatar ? (
    <img 
      src={getAvatarUrl(
        typeof offer.userId.avatar === 'object' 
          ? offer.userId.avatar.url 
          : offer.userId.avatar
      )}
      className="object-cover w-10 h-10 border-2 border-white rounded-full"
      alt={offer.userId?.name || 'User'}
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/default-avatar.png';
      }}
    />
  ) : (
    <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-gray-300 border-2 border-white rounded-full">
      {offer.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  )}
      
      {/* Connection Status Dot */}
      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
        connectionStatus === 'connected' ? 'bg-green-400' : 'bg-gray-400'
      }`}>
        {/* Pulse animation when connected */}
        {connectionStatus === 'connected' && (
          <div className="absolute inset-0 bg-green-400 rounded-full opacity-75 animate-ping"></div>
        )}
      </div>
    </div>

    {/* User Info */}
    <div>
      <h2 className="text-lg font-bold text-white">
        {offer.userId?.name || 'Chat'}
      </h2>
      <div className="flex items-center space-x-2">
        {/* Connection Status Text */}
        <span className="text-xs text-blue-100">
          {connectionStatus === 'connected' ? 'Online' : 'Offline'}
        </span>
        
        {/* Typing Indicator */}
        {otherUserTyping && (
          <span className="flex items-center text-xs text-blue-100">
            <span className="flex ml-1 space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 bg-blue-100 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </span>
            <span className="ml-1">Typing...</span>
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Close Button */}
  <button 
    onClick={onClose}
    className="p-1 transition-colors rounded-full text-white/80 hover:text-white hover:bg-white/10"
    aria-label="Close chat"
  >
    <FaTimes size={20} />
  </button>
</div>

      {/* Message Area - Modern Bubble Layout */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-[url('https://transparenttextures.com/patterns/light-wool.png')]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
    
            <h3 className="text-lg font-medium text-gray-500">Start chatting !</h3>
            <p className="mt-1 text-gray-400">Send your first message to start chatting</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              className={`flex mb-4 ${message.sender?._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              {/* Sender Avatar */}
              {message.sender?._id !== currentUser._id && (
                <img 
                  src={getAvatarUrl(message.sender?.avatar)}
                  className="object-cover w-8 h-8 mt-1 mr-2 rounded-full"
                  alt={message.sender?.name}
                />
              )}

              {/* Message Bubble */}
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
                        className="max-w-full rounded-lg max-h-64"
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

      {/* Input Area - Modern Design */}
      <div className="p-4 bg-white border-t">
  {otherUserTyping && (
    <div className="flex items-center mb-2 text-sm text-gray-500">
      <div className="flex mr-2 space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
      </div>
      <span>{offer.userId?.name} is typing...</span>
    </div>
  )}

  {/* Image preview */}
  {imagePreview && (
    <div className="relative p-2 mb-2 bg-gray-100 rounded-lg">
      <img 
        src={imagePreview} 
        alt="Preview" 
        className="max-w-full rounded-md max-h-40"
      />
      <button 
        onClick={removeImage}
        className="absolute p-1 text-white rounded-full top-1 right-1 bg-gray-800/80 hover:bg-gray-900"
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
        className="p-2 text-gray-500 transition-colors rounded-full cursor-pointer hover:text-blue-500"
      >
        <FaImage size={18} />
      </label>
    </div>
    
    <input
      type="text"
      value={newMessage}
      onChange={handleInputChange}
      onKeyPress={(e) => e.key === 'Enter' && (imagePreview ? handleSendImage() : handleSendMessage())}
      placeholder="Type a message..."
      className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
    />
    
    <button
      onClick={imagePreview ? handleSendImage : handleSendMessage}
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
  </div>
)};

export default ChatModal;