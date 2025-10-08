import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { calculateBigSatIndex } from '../utils/calculations';
import type { BigSatData } from '../types';

export const BigSatIndex: React.FC = () => {
  const [data, setData] = useState<BigSatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bigMacData, btcData, currentBtcPrice] = await Promise.all([
        ApiService.getBigMacData(),
        ApiService.getBitcoinHistory(),
        ApiService.getCurrentBitcoinPrice()
      ]);
      
      // Filtrar apenas dados dos EUA
      const usBigMacData = bigMacData.filter(item => item.name === 'United States');
      const bigSatData = calculateBigSatIndex(usBigMacData, btcData);
      
      setData(bigSatData);
      setCurrentPrice(currentBtcPrice);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular Big Macs que 100k sats compram hoje
  const currentBigMacPrice = data.length > 0 ? data[data.length - 1].bigMacPrice : 0;
  const currentBigSats = currentPrice > 0 ? (0.001 * currentPrice) / currentBigMacPrice : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Big Sat Index...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="font-bold">🍔</span>
            </div>
            <h1 className="text-xl font-bold">Big Sat Index</h1>
          </div>
          <div className="text-sm text-gray-400">
            Real-time Bitcoin valuation
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Big Sat Index
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How many Big Macs can 100,000 satoshis buy throughout Bitcoin's history?
            </p>
          </div>

          {/* Main Card with Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* BTC Price Card */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">₿</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">BTC PRICE</p>
                <p className="text-3xl font-bold text-green-400">
                  ${currentPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Big Mac Price Card */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍔</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">BIG MAC PRICE</p>
                <p className="text-3xl font-bold text-yellow-400">
                  ${currentBigMacPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Big Sat Index Card */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">BIG SATS INDEX</p>
                <p className="text-3xl font-bold text-orange-400">
                  {currentBigSats.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 mt-2">Big Macs per 100k sats</p>
              </div>
            </div>
          </div>

          {/* Chart Card (Placeholder) */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Historical Performance</h2>
            <div className="h-80 bg-gray-700/50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-400 text-lg">Chart Coming Soon</p>
                <p className="text-gray-500 text-sm mt-2">Interactive historical data visualization</p>
              </div>
            </div>
          </div>

          {/* Historical Data Table */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Historical Data (United States)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-right py-4 px-4 text-gray-400 font-semibold">BTC Price</th>
                    <th className="text-right py-4 px-4 text-gray-400 font-semibold">Big Mac Price</th>
                    <th className="text-right py-4 px-4 text-gray-400 font-semibold">Big Macs per 100k sats</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice().reverse().map((item, index) => (
                    <tr 
                      key={`${item.date}-${index}`} 
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium">{item.date}</div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-green-400 font-mono">
                          ${item.btcPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-yellow-400 font-mono">
                          ${item.bigMacPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-orange-400 font-mono font-bold">
                          {item.bigSats.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              Data Sources: The Economist Big Mac Index & CoinGecko
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Big Sat Index
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};