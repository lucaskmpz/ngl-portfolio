// src/types/index.ts
export interface BigMacData {
  date: string;
  currency_code: string;
  name: string;
  local_price: number;
  dollar_ex: number;
  dollar_price: number;
  USD: number;
}

export interface BitcoinPrice {
  date: string;
  price: number;
}

export interface BigSatData {
  date: string;
  country: string;
  btcPrice: number;
  bigMacPrice: number;
  bigSats: number; // Quantos Big Macs 100k sats compram
}