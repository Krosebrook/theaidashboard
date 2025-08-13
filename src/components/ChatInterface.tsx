import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Bot, Send, Copy, Share2, Star, 
  Paperclip, Image, Mic 
} from 'lucide-react';
import AgentPanel from './AgentPanel';
import { agents } from '../data/mockData';
import { useAgentCoordination } from '../hooks/useAgentCoordination';
import type { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      agent: 'Master Orchestrator',
      content: 'Welcome to the Universal AI App Generator! I can create any type of application across web, mobile, desktop, and edge platforms. What would you like to build today?',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [generationProgress, setGenerationProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { coordinateAgents, isCoordinating } = useAgentCoordination();

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isGenerating || isCoordinating) return;

    const newMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsGenerating(true);



    // Use the real agent coordination system
    coordinateAgents(currentMessage, agents, (message) => {
      setChatMessages(prev => [...prev, message]);
      if (message.progress === 100) {
        setIsGenerating(false);
      }
    });
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex h-full">
      <AgentPanel 
        agents={agents}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
      />

      {/* Enhanced Chat Messages Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Command Center</h2>
                <div className="text-sm text-gray-500">
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Agents coordinating...
                    </span>
                  ) : (
                    'Ready for your next command'
                  )}
                </div>
              </div>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatMessages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.agent && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.agent}</span>
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl shadow-sm ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => {
                      if (line.includes('✅') || line.includes('🚀') || line.includes('🛡️') || line.includes('🌍') || line.includes('💰')) {
                        return (
                          <div key={index} className={`${index > 0 ? 'mt-2' : ''} ${message.type === 'assistant' ? 'text-gray-800' : 'text-white'}`}>
                            {line}
                          </div>
                        );
                      }
                      return line && (
                        <p key={index} className={`${index > 0 ? 'mt-1' : ''} ${message.type === 'assistant' ? 'text-gray-700' : 'text-white'}`}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  
                  {message.progress && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${message.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{message.progress}%</span>
                    </div>
                  )}
                </div>
                
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {(isGenerating || isCoordinating) && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI agents are coordinating your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Describe your app idea... (e.g., 'Create a full-stack e-commerce platform with AI recommendations')"
                  className="w-full p-4 pr-16 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[60px] max-h-32"
                  rows={2}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>💡 Try: "Build a social media app with AI moderation"</span>
                </div>
                <div>{currentMessage.length}/2000</div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isGenerating || isCoordinating}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;