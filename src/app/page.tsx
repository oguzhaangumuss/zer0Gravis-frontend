'use client';

import OracleCommandCenter from '@/components/OracleCommandCenter';
import { useHealth } from '@/hooks/useZeroGravis';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function HealthStatus() {
  const { data: health, isLoading, error } = useHealth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking system health...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Backend offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm">
        ZeroGravis v{health.version} • {health.status}
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ZeroGravis
              </h1>
              <p className="text-sm text-gray-600">
                0G Oracle Data Aggregation Platform
              </p>
            </div>
            <HealthStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to ZeroGravis Oracle Network
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access real-time data from multiple oracle sources including Chainlink price feeds, 
            weather data, and NASA space observations. All powered by the 0G Network infrastructure.
          </p>
        </div>

        {/* Oracle Command Center */}
        <div className="mb-12">
          <OracleCommandCenter />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Price Feed Oracle
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time cryptocurrency prices from Chainlink with 24h changes, 
              volume and market cap data.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌤️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weather Oracle
            </h3>
            <p className="text-gray-600 text-sm">
              Current weather conditions including temperature, humidity, 
              pressure and wind data for any city worldwide.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              NASA Space Oracle
            </h3>
            <p className="text-gray-600 text-sm">
              Asteroid and space observation data from NASA with detailed 
              information about near-Earth objects.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Network Statistics
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Oracle Sources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Real-time Updates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">0G</div>
              <div className="text-sm text-gray-600">Network Powered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Queries Available</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built on 0G Network • Powered by ZeroGravis Oracle Aggregation Platform
            </p>
            <p className="text-xs mt-2">
              Real-time data from Chainlink, OpenWeatherMap, and NASA APIs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}