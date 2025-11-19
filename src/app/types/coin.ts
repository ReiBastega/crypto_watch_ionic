export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  high_24h?: number;
  low_24h?: number;
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_24h: number;
}

export interface WalletEntry {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  lastPrice?: number;
}
