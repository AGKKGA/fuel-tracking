export type FuelType = 'Gasoline Regular' | 'Gasoline Premium' | 'Diesel';
export type Region = 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Middle East' | 'Oceania';

export interface FuelPrice {
  country: string;
  flag: string;
  region: Region;
  fuelType: FuelType;
  priceLocal: number;
  currency: string;
  priceUSD: number;
  lastUpdated: string;
}

export interface HistoricalSnapshot {
  date: string; // ISO Date
  avgPriceUSD: number;
}
