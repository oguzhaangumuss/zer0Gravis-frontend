'use client';

import { useETHPrice, useBTCPrice } from '@/hooks/useZeroGravis';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';

interface PriceCardProps {
  symbol: string;
  data: any;
  isLoading: boolean;
  error: any;
}

function PriceCard({ symbol, data, isLoading, error }: PriceCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
          <DollarSign className="h-5 w-5 text-red-500" />
        </div>
        <p className="text-red-600 text-sm">Failed to load price data</p>
      </div>
    );
  }

  if (!data?.success || !data?.data?.aggregatedValue) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
          <DollarSign className="h-5 w-5 text-gray-500" />
        </div>
        <p className="text-gray-600 text-sm">No data available</p>
      </div>
    );
  }

  const priceData = data.data.aggregatedValue;
  const change24h = priceData.change24h || 0;
  const isPositive = change24h >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            ${priceData.price?.toLocaleString() || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            {priceData.currency || 'USD'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">24h Volume</p>
            <p className="font-medium">
              ${(priceData.volume24h || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Market Cap</p>
            <p className="font-medium">
              ${(priceData.marketCap || 0).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Source: {data.data.sources?.[0] || 'Chainlink'}</span>
            <span>Confidence: {((data.data.confidence || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OraclePriceFeeds() {
  const ethQuery = useETHPrice();
  const btcQuery = useBTCPrice();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔮 Oracle Price Feeds
        </h2>
        <p className="text-gray-600">
          Real-time cryptocurrency prices from Chainlink oracles
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <PriceCard
          symbol="ETH/USD"
          data={ethQuery.data}
          isLoading={ethQuery.isLoading}
          error={ethQuery.error}
        />
        <PriceCard
          symbol="BTC/USD"
          data={btcQuery.data}
          isLoading={btcQuery.isLoading}
          error={btcQuery.error}
        />
      </div>
      
      <div className="text-center text-sm text-gray-500">
        Data refreshes every 10 seconds • Powered by 0G Network
      </div>
    </div>
  );
}