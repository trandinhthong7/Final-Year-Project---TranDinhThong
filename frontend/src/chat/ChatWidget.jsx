import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAngleDoubleDown } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import axios from 'axios';

const ChatWidget = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi there! 👋 I am the TDT Stadium AI assistant. Looking for specific boots, gloves, or accessories?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Start new chat
  const handleNewChat = () => {
    setMessages([
      { role: 'bot', text: 'Hi there! 👋 I am the TDT Stadium AI assistant. Looking for specific boots, gloves, or accessories?' }
    ]);
    setInput('');
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
    setIsOpen(false); // Close chat when navigating
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
      const response = await axios.post(`${backendUrl}/api/chat`, { 
        message: userMessage 
      });
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.data.reply,
        products: response.data.products || []
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#fffffe] rounded-lg shadow-xl w-80 sm:w-96 mb-4 flex flex-col relative" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-[#004643] text-[#fffffe] p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">TDT Stadium Assistant</h3>
            <div className="flex items-center gap-2">
              {/* New Chat Button */}
              <button 
                onClick={handleNewChat}
                className="text-[#fffffe] hover:scale-110 transition-colors"
                title="Start new chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              {/* Close Button */}
              <button onClick={toggleChat} className="text-[#fffffe] hover:scale-110  font-bold">
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto bg-[#fffffe] flex flex-col gap-3 relative"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.role === 'user' ? 'self-end' : 'self-start'} max-w-[85%]`}>
                {/* Text Message */}
                <div className={`rounded-lg p-3 ${msg.role === 'user' ? 'bg-[#004643] text-[#fffffe]' : 'bg-[#abd1c6] text-[#001e1d]'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {/* Product Suggestions */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.products.map((product) => {
                      // Get the first image from color variants or main images
                      const productImage = 
                        product.colorVariants?.[0]?.images?.[0] || 
                        product.images?.[0] || 
                        '/placeholder-product.svg';
                      
                      return (
                        <div 
                          key={product._id} 
                          className="bg-[#004643] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-3">
                            {/* Product Image */}
                            <div className="w-20 h-20 rounded-md overflow-hidden">
                              <img 
                                src={productImage} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/placeholder-product.svg';
                                }}
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-[#fffffe] truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-[#abd1c6] mt-1">
                                {product.brand} • {product.category}
                              </p>
                              <p className="text-sm font-bold text-[#abd1c6] mt-1">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                          
                          {/* View Button */}
                          <button
                            onClick={() => handleViewProduct(product._id)}
                            className="w-full mt-3 bg-[#f9bc60] text-[#001e1d] text-sm py-2 rounded-md hover:scale-105 transition-transform"
                          >
                            View Product
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#abd1c6] text-[#001e1d] self-start max-w-[80%] rounded-lg p-3">
                <p className="text-sm animate-pulse">Typing...</p>
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-18 left-1/2 transform -translate-x-1/2 bg-[#fffffe] border border-[#004643] text-[#004643] rounded-full p-2 shadow-lg hover:scale-110 transition-all z-10"
              title="Scroll to bottom"
            >
              <FaAngleDoubleDown className="w-4 h-4" />
            </button>
          )}

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2 rounded-b-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about boots, gloves..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#004643]"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#004643] text-[#fffffe] px-4 py-2 rounded-md hover:scale-110 disabled:bg-[#e8e4e6]"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-[#004643] text-[#fffffe] rounded-full p-4 shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        >
          <IoChatbubbleEllipsesSharp/>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;