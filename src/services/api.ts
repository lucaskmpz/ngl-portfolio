import type { BigMacData, BitcoinPrice } from "../types";


export class ApiService {
  // Dados do Big Mac (CSV público)
  static async getBigMacData(): Promise<BigMacData[]> {
    try {
      const response = await fetch('https://raw.githubusercontent.com/TheEconomist/big-mac-data/master/output-data/big-mac-source-data.csv');
      const csvText = await response.text();
      return this.parseBigMacCSV(csvText);
    } catch (error) {
      console.error('Error fetching Big Mac data:', error);
      throw error;
    }
  }

  // Dados históricos do Bitcoin
  static async getBitcoinHistory(): Promise<BitcoinPrice[]> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=3650&interval=daily'
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price
      }));
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error);
      throw error;
    }
  }

  // PREÇO ATUAL DO BITCOIN (NOVO MÉTODO)
  static async getCurrentBitcoinPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      console.error('Error fetching current Bitcoin price:', error);
      throw error;
    }
  }

  private static parseBigMacCSV(csvText: string): BigMacData[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const entry: any = {};
      
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
        
        // Converter números
        if (['local_price', 'dollar_ex', 'dollar_price', 'USD'].includes(header)) {
          entry[header] = parseFloat(entry[header]) || 0;
        }
      });
      
      return entry as BigMacData;
    }).filter(entry => entry.date && entry.name && entry.local_price > 0);
  }
}