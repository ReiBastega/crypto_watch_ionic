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
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  ath?: number;
  ath_change_percentage?: number;
  atl?: number;
  market_cap_rank?: number;
}

export interface WalletEntry {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  lastPrice?: number;
}
