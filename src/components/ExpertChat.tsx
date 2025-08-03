import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Leaf, 
  Clock, 
  Loader2,
  MessageSquare,
  Settings,
  Zap,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'suggestion';
}

const ExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Plant Care Assistant. I can help you with plant identification, care tips, troubleshooting, and more. What would you like to know about your plants?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<'general' | 'diagnostic' | 'care'>('general');
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const quickSuggestions = [
    "My plant's leaves are turning yellow",
    "How often should I water my Monstera?",
    "What's wrong with my plant?",
    "Best soil for indoor plants",
    "How to propagate my plant",
    "Plant care schedule tips"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple initialization without user data logging
  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
  }, []);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // For now, using a simple response system
      // You can replace this with actual OpenAI API call
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('yellow') || lowerMessage.includes('leaves')) {
        return "Yellow leaves can indicate several issues:\n\n1. **Overwatering** - Check if soil is soggy\n2. **Underwatering** - Soil should be moist but not dry\n3. **Nutrient deficiency** - Consider fertilizing\n4. **Too much sun** - Move to indirect light\n\nCan you tell me more about your watering schedule and lighting conditions?";
      }
      
      if (lowerMessage.includes('monstera') || lowerMessage.includes('water')) {
        return "Monstera plants prefer:\n\n💧 **Watering**: Every 1-2 weeks, when top 2-3 inches of soil is dry\n🌞 **Light**: Bright, indirect sunlight\n🌡️ **Temperature**: 65-85°F (18-29°C)\n💨 **Humidity**: 60-80%\n\nWater thoroughly and let excess drain. Never let it sit in water!";
      }
      
      if (lowerMessage.includes('propagate')) {
        return "Here's how to propagate most plants:\n\n1. **Choose a healthy stem** with 2-3 nodes\n2. **Cut below a node** with clean scissors\n3. **Remove lower leaves** to expose nodes\n4. **Place in water** or moist soil\n5. **Keep in bright, indirect light**\n6. **Wait for roots** (2-6 weeks)\n\nWhich plant are you trying to propagate?";
      }
      
      if (lowerMessage.includes('soil')) {
        return "For indoor plants, use a well-draining potting mix:\n\n🌱 **Basic mix**: 2 parts potting soil + 1 part perlite + 1 part peat moss\n🌿 **Succulents**: Add extra perlite or sand\n🌺 **Orchids**: Use orchid bark mix\n🌳 **Large plants**: Add compost for nutrients\n\nAvoid garden soil - it's too heavy for pots!";
      }
      
      return "I'd be happy to help with your plant care question! To give you the best advice, could you tell me:\n\n1. What type of plant you have\n2. What specific issue you're experiencing\n3. Your current care routine\n\nThis will help me provide more targeted recommendations! 🌿";
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      showToast('success', 'AI Response', 'Your plant care assistant has replied!');
    } catch (error) {
      showToast('error', 'AI Error', 'Sorry, I encountered an issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center mt-16 lg:mt-0">
        <LoadingSpinner 
          size="lg" 
          text="Initializing AI Assistant..." 
          fullScreen={false} 
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col mt-16 lg:mt-0 animate-slide-in">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-green rounded-2xl flex items-center justify-center shadow-green">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">AI Plant Assistant</h1>
              <p className="text-green-600">Get instant plant care advice from AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* AI Mode Selector */}
            <div className="flex bg-green-100 rounded-xl p-1">
              {[
                { id: 'general', label: 'General', icon: Brain },
                { id: 'diagnostic', label: 'Diagnostic', icon: Sparkles },
                { id: 'care', label: 'Care Tips', icon: Lightbulb }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setAiMode(mode.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      aiMode === mode.id 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
            
            <button className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-green' 
                    : 'bg-white border-2 border-green-200'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-green-600" />
                  )}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl max-w-full ${
                  message.sender === 'user'
                    ? 'bg-gradient-green text-white'
                    : 'bg-white text-green-900 border border-green-200 shadow-green'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-green-100' : 'text-green-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white border-2 border-green-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-white border border-green-200 rounded-2xl px-4 py-3 shadow-green">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-sm text-green-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-green-600 mb-3 font-medium">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="px-3 py-2 bg-white border border-green-200 rounded-xl text-sm text-green-700 hover:bg-green-50 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-md border-t border-green-200 p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your plants..."
                className="w-full px-4 py-3 pr-12 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 text-xs text-green-400">
                Press Enter to send
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-green text-white rounded-xl hover:shadow-green-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-green-500">
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3" />
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Usually responds in seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertChat;