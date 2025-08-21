'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, Cloud, Rocket, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ZeroGravisAPI } from '@/lib/api';
import type { OracleDataType } from '@/types/api';

interface Message {
  id: string;
  type: 'user' | 'oracle' | 'system';
  content: string;
  data?: any;
  timestamp: Date;
  status?: 'loading' | 'success' | 'error';
}

interface OracleOption {
  type: OracleDataType;
  name: string;
  icon: React.ReactNode;
  color: string;
  examples: string[];
}

const ORACLE_OPTIONS: OracleOption[] = [
  {
    type: 'price_feed' as OracleDataType,
    name: 'Price Feed Oracle',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'blue',
    examples: [
      'What is the current ETH/USD price?',
      'Show me BTC/USD price data',
      'Get latest crypto prices',
      'ETH price with 24h change'
    ]
  },
  {
    type: 'weather' as OracleDataType,
    name: 'Weather Oracle',
    icon: <Cloud className="w-5 h-5" />,
    color: 'green',
    examples: [
      'What is the weather in London?',
      'Show weather data for New York',
      'Current temperature in Tokyo',
      'Weather conditions in Istanbul'
    ]
  },
  {
    type: 'space' as OracleDataType,
    name: 'NASA Space Oracle',
    icon: <Rocket className="w-5 h-5" />,
    color: 'purple',
    examples: [
      'Show asteroid data for today',
      'NASA space data for 2024-01-15',
      'Potentially hazardous asteroids',
      'Recent space observations'
    ]
  }
];

export default function OracleCommandCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOracle, setSelectedOracle] = useState<OracleDataType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Add welcome message only on client-side to avoid hydration mismatch
    if (isClient && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'system',
        content: 'Welcome to ZeroGravis Oracle Command Center! Select an oracle type and ask your questions.',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
  }, [isClient, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  const parseUserQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Price feed patterns
    if (lowerQuery.includes('eth') || lowerQuery.includes('ethereum')) {
      return { type: 'price_feed', symbol: 'ETH/USD' };
    }
    if (lowerQuery.includes('btc') || lowerQuery.includes('bitcoin')) {
      return { type: 'price_feed', symbol: 'BTC/USD' };
    }
    if (lowerQuery.includes('price')) {
      return { type: 'price_feed', symbol: 'ETH/USD' };
    }
    
    // Weather patterns
    const cityMatch = lowerQuery.match(/weather.*in\s+(\w+)|(\w+)\s+weather/);
    if (cityMatch || lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
      const city = cityMatch?.[1] || cityMatch?.[2] || 'London';
      return { type: 'weather', city: city.charAt(0).toUpperCase() + city.slice(1) };
    }
    
    // Space patterns
    if (lowerQuery.includes('asteroid') || lowerQuery.includes('space') || lowerQuery.includes('nasa')) {
      const dateMatch = lowerQuery.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch?.[0] || new Date().toISOString().split('T')[0];
      return { type: 'space', date };
    }
    
    return null;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    addMessage({ type: 'user', content });
    setInputValue('');
    setIsLoading(true);

    // Parse query or use selected oracle
    const parsedQuery = parseUserQuery(content);
    const oracleType = selectedOracle || parsedQuery?.type;

    if (!oracleType) {
      addMessage({
        type: 'oracle',
        content: 'Please select an oracle type first or ask a more specific question (e.g., "ETH price", "weather in London", "asteroid data").',
        status: 'error'
      });
      setIsLoading(false);
      return;
    }

    // Add loading message
    const loadingId = addMessage({
      type: 'oracle',
      content: 'Querying oracle network...',
      status: 'loading'
    });

    try {
      let response;
      let displayContent = '';

      switch (oracleType) {
        case 'price_feed':
          const symbol = parsedQuery?.symbol || 'ETH/USD';
          if (symbol === 'ETH/USD') {
            response = await ZeroGravisAPI.getETHPrice();
          } else {
            response = await ZeroGravisAPI.getBTCPrice();
          }
          
          if (response.success && response.data) {
            const priceData = response.data.aggregatedValue;
            displayContent = `💰 **${symbol} Price Data**\n\n` +
              `**Current Price:** $${priceData.price?.toLocaleString() || 'N/A'}\n` +
              `**24h Change:** ${priceData.change24h >= 0 ? '+' : ''}${priceData.change24h?.toFixed(2) || 0}%\n` +
              `**24h Volume:** $${(priceData.volume24h || 0).toLocaleString()}\n` +
              `**Market Cap:** $${(priceData.marketCap || 0).toLocaleString()}\n\n` +
              `**Source:** ${response.data.sources?.[0] || 'Chainlink'}\n` +
              `**Confidence:** ${((response.data.confidence || 0) * 100).toFixed(1)}%\n` +
              `**Execution Time:** ${response.data.executionTime}ms`;
          }
          break;

        case 'weather':
          const city = parsedQuery?.city || 'London';
          response = await ZeroGravisAPI.getWeatherData(city);
          
          if (response.success && response.data) {
            const weatherData = response.data.aggregatedValue;
            displayContent = `🌤️ **Weather in ${weatherData.location || city}**\n\n` +
              `**Temperature:** ${weatherData.temperature || 'N/A'}°C\n` +
              `**Condition:** ${weatherData.condition || 'N/A'}\n` +
              `**Humidity:** ${weatherData.humidity || 'N/A'}%\n` +
              `**Pressure:** ${weatherData.pressure || 'N/A'} hPa\n` +
              `**Wind Speed:** ${weatherData.windSpeed || 'N/A'} km/h\n\n` +
              `**Coordinates:** ${weatherData.coordinates?.lat?.toFixed(4) || 'N/A'}, ${weatherData.coordinates?.lon?.toFixed(4) || 'N/A'}\n` +
              `**Source:** ${response.data.sources?.[0] || 'OpenWeatherMap'}\n` +
              `**Confidence:** ${((response.data.confidence || 0) * 100).toFixed(1)}%`;
          }
          break;

        case 'space':
          const date = parsedQuery?.date || new Date().toISOString().split('T')[0];
          response = await ZeroGravisAPI.getSpaceData(date);
          
          if (response.success && response.data) {
            const spaceData = response.data.aggregatedValue;
            const asteroids = spaceData.data || [];
            const hazardousCount = asteroids.filter((a: any) => a.isPotentiallyHazardous).length;
            
            displayContent = `🚀 **NASA Space Data for ${date}**\n\n` +
              `**Total Asteroids:** ${asteroids.length}\n` +
              `**Potentially Hazardous:** ${hazardousCount}\n\n` +
              `**Recent Asteroids:**\n`;
            
            asteroids.slice(0, 5).forEach((asteroid: any, i: number) => {
              displayContent += `${i + 1}. **${asteroid.name}**\n` +
                `   Size: ${asteroid.diameter?.min}-${asteroid.diameter?.max}m\n` +
                `   Distance: ${(asteroid.missDistance || 0).toLocaleString()}km\n` +
                `   Velocity: ${(asteroid.velocity || 0).toLocaleString()}km/h\n` +
                `   ${asteroid.isPotentiallyHazardous ? '⚠️ Potentially Hazardous' : '✅ Safe'}\n\n`;
            });
            
            displayContent += `**Source:** NASA NEO API\n` +
              `**Confidence:** ${((response.data.confidence || 0) * 100).toFixed(1)}%`;
          }
          break;
      }

      updateMessage(loadingId, {
        content: displayContent || 'No data available from oracle.',
        data: response?.data,
        status: response?.success ? 'success' : 'error'
      });

    } catch (error) {
      updateMessage(loadingId, {
        content: 'Error querying oracle network. Please try again.',
        status: 'error'
      });
    }

    setIsLoading(false);
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  const selectedOracleConfig = ORACLE_OPTIONS.find(o => o.type === selectedOracle);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">🔮 Oracle Command Center</h1>
        <p className="text-blue-100">
          Real-time data from 0G Network Oracle services
        </p>
      </div>

      {/* Oracle Selection */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Oracle Type:</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {ORACLE_OPTIONS.map((oracle) => (
            <button
              key={oracle.type}
              onClick={() => setSelectedOracle(oracle.type)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedOracle === oracle.type
                  ? `border-${oracle.color}-500 bg-${oracle.color}-50`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`text-${oracle.color}-600`}>
                  {oracle.icon}
                </div>
                <span className="font-medium text-gray-800">
                  {oracle.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Example Questions */}
      {selectedOracleConfig && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Example questions for {selectedOracleConfig.name}:
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {selectedOracleConfig.examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 text-sm bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                💬 {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : message.type === 'system'
                ? 'bg-gray-100 text-gray-700 border'
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="whitespace-pre-line text-sm">
                    {message.content}
                  </div>
                  {message.status && (
                    <div className="flex items-center space-x-2 mt-2">
                      {message.status === 'loading' && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      )}
                      {message.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {message.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage(inputValue)}
            placeholder={selectedOracleConfig 
              ? `Ask ${selectedOracleConfig.name} a question...`
              : "Select an oracle type above or ask a question..."
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {selectedOracleConfig && (
          <p className="text-xs text-gray-500 mt-2">
            Using {selectedOracleConfig.name} • Real-time data from 0G Network
          </p>
        )}
      </div>
    </div>
  );
}