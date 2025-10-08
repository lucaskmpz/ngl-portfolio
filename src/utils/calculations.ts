import type { BigMacData, BigSatData, BitcoinPrice } from "../types";

export function calculateBigSatIndex(
  bigMacData: BigMacData[],
  btcPrices: BitcoinPrice[]
): BigSatData[] {
  const result: BigSatData[] = [];

  bigMacData.forEach(bigMac => {
    // Encontrar preço do BTC na mesma data (ou mais próxima)
    const btcPrice = findClosestBtcPrice(btcPrices, bigMac.date);
    
    if (btcPrice) {
      // 100,000 satoshis = 0.001 BTC
      const satsValueUSD = 0.001 * btcPrice.price;
      const bigMacs = satsValueUSD / bigMac.dollar_price;
      
      result.push({
        date: bigMac.date,
        country: bigMac.name,
        btcPrice: btcPrice.price,
        bigMacPrice: bigMac.dollar_price,
        bigSats: bigMacs
      });
    }
  });

  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function findClosestBtcPrice(btcPrices: BitcoinPrice[], targetDate: string): BitcoinPrice | null {
  // Primeiro tenta encontrar data exata
  const exactMatch = btcPrices.find(btc => btc.date === targetDate);
  if (exactMatch) return exactMatch;
  
  // Se não encontrar, procura a data mais próxima (pode implementar lógica mais sofisticada depois)
  return btcPrices.find(btc => btc.date <= targetDate) || null;
}