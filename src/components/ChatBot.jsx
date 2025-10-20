// components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Food Waste Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call your AI API here
      const response = await fetchAIResponse(inputValue);
      
      const botMessage = { 
        text: response.answer || "I'm sorry, I couldn't process your request.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI API error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the service. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API call - replace with your actual AI service integration
  const fetchAIResponse = async (query) => {
    // This is a placeholder - replace with your actual API call
    console.log("Querying AI with:", query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample responses based on common questions
    const responses = {
      "hello": "Hello! How can I assist you with food waste reduction today?",
      "guidelines": "Our community guidelines focus on food safety, respectful engagement, and responsible sharing. You can find details in each section above.",
      "safety": "All shared food must be fresh, properly stored, and safe for consumption. Never share food that shows signs of spoilage.",
      "report": "To report a guideline violation, please use our contact form or email support@foodwasteapp.com",
      "donate": "To donate food, create an account and post your available items with clear descriptions and photos.",
      "receive": "Browse available food listings and reserve items you need. Be sure to pick them up during the specified times.",
      "default": "I'm here to help with questions about food waste reduction and our community guidelines. You can ask about safety standards, how to participate, or reporting issues."
    };

    const lowerQuery = query.toLowerCase();
    let answer = responses.default;

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      answer = responses.hello;
    } else if (lowerQuery.includes('guideline')) {
      answer = responses.guidelines;
    } else if (lowerQuery.includes('safety') || lowerQuery.includes('safe')) {
      answer = responses.safety;
    } else if (lowerQuery.includes('report')) {
      answer = responses.report;
    } else if (lowerQuery.includes('donate') || lowerQuery.includes('give')) {
      answer = responses.donate;
    } else if (lowerQuery.includes('receive') || lowerQuery.includes('get food')) {
      answer = responses.receive;
    }

    return { answer };
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-full max-w-xs overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 bg-[#E84D1D] text-white">
            <h3 className="font-semibold">Food Waste Assistant</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="h-64 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user' 
                    ? 'bg-[#E84D1D] text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="flex p-4 border-t">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about guidelines..."
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#E84D1D]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 text-white bg-[#E84D1D] rounded-r-lg hover:bg-[#C53D0D] disabled:opacity-50"
            >
              <FiSend />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="flex items-center justify-center w-16 h-16 text-white bg-[#E84D1D] rounded-full shadow-lg hover:bg-[#C53D0D] focus:outline-none focus:ring-2 focus:ring-[#E84D1D] focus:ring-offset-2"
          aria-label="Open chat"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;