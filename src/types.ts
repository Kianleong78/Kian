export type AssetType = 'Index' | 'Stock' | 'Crypto' | 'Forex' | 'Futures' | 'Bond';

export interface MarketIndex {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  badgeText?: string;
  badgeType?: 'primary' | 'secondary' | 'neutral';
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  open: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
  peRatio: number;
  sector: string;
  type: AssetType;
  iconName: 'token' | 'apple' | 'shopping' | 'search' | 'car' | 'terminal' | 'share' | 'cpu' | 'tv' | 'gold' | 'oil' | 'crypto' | 'currency';
  sparkline: number[];
}

export interface CompanyCap {
  symbol: string;
  name: string;
  marketCap: string;
  changePercent: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'Market News' | 'Earnings' | 'Crypto' | 'Tech' | 'Macro';
  summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  readTime: string;
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export type CategoryTab = 'Indices' | 'Stocks' | 'Crypto' | 'Futures' | 'Forex' | 'Government bonds';

export type NavTab = 'explore' | 'watchlist' | 'chart' | 'news' | 'profile';
