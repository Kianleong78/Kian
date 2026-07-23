import React, { useState } from 'react';
import { 
  X, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BarChart3, 
  DollarSign, 
  Check, 
  Clock, 
  Share2,
  RefreshCw
} from 'lucide-react';
import { StockItem, MarketIndex } from '../types';

interface StockDetailModalProps {
  item: StockItem | MarketIndex | null;
  onClose: () => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (item: StockItem | MarketIndex) => void;
  onBuySell?: (symbol: string, name: string, price: number, isBuy: boolean) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  item,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  onBuySell
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [activeTab, setActiveTab] = useState<'chart' | 'ai'>('chart');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  if (!item) return null;

  const isStock = 'price' in item;
  const currentPrice = isStock ? (item as StockItem).price : (item as MarketIndex).value;
  const changePercent = item.changePercent;
  const isPositive = changePercent >= 0;
  const symbol = item.symbol;
  const name = item.name;

  // Generate synthetic chart points for timeframes
  const generateChartPoints = () => {
    const count = timeframe === '1D' ? 24 : timeframe === '1W' ? 35 : timeframe === '1M' ? 50 : 80;
    const points: number[] = [];
    let base = currentPrice * (1 - (changePercent / 100));
    for (let i = 0; i < count; i++) {
      const volatility = currentPrice * 0.012;
      const step = (Math.random() - 0.47) * volatility;
      base += step;
      points.push(+base.toFixed(2));
    }
    // Force final point to equal currentPrice
    points[points.length - 1] = currentPrice;
    return points;
  };

  const chartPoints = generateChartPoints();
  const minPrice = Math.min(...chartPoints);
  const maxPrice = Math.max(...chartPoints);

  const fetchAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          name,
          price: currentPrice,
          changePercent,
          marketCap: isStock ? (item as StockItem).marketCap : 'Index Level',
          sector: isStock ? (item as StockItem).sector : 'Financial Index',
          type: isStock ? (item as StockItem).type : 'Index'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAiAnalysis(data.analysis);
      } else {
        setAiError(data.error || 'Failed to generate AI analysis.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error connecting to Gemini API.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTabSwitch = (tab: 'chart' | 'ai') => {
    setActiveTab(tab);
    if (tab === 'ai' && !aiAnalysis && !isAiLoading) {
      fetchAiAnalysis();
    }
  };

  const handleTrade = (isBuy: boolean) => {
    if (onBuySell && isStock) {
      onBuySell(symbol, name, currentPrice, isBuy);
      setTradeSuccessMsg(`${isBuy ? 'Bought' : 'Sold'} 1 share of ${symbol} at $${currentPrice}!`);
      setTimeout(() => setTradeSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1E222D] border border-[#2A2E39] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#2A2E39] bg-[#171b26]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#dfe2f2]">{symbol}</h2>
                {isStock && (
                  <span className="bg-[#313441] text-[#c3c5d8] text-[10px] px-2 py-0.5 rounded font-bold">
                    {(item as StockItem).exchange}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#787B86]">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item)}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isInWatchlist
                  ? 'bg-[#2962ff]/20 text-[#b6c4ff] border-[#2962ff]/40'
                  : 'bg-[#313441] text-[#dfe2f2] border-[#2A2E39] hover:bg-[#353945]'
              }`}
            >
              <Star className={`w-4 h-4 ${isInWatchlist ? 'fill-[#b6c4ff]' : ''}`} />
              <span className="hidden sm:inline">
                {isInWatchlist ? 'In Watchlist' : 'Add Watchlist'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#787B86] hover:text-[#dfe2f2] hover:bg-[#313441] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {tradeSuccessMsg && (
          <div className="bg-[#089981]/20 border-b border-[#089981]/40 text-[#089981] px-4 py-2 text-xs font-semibold flex items-center justify-between">
            <span>{tradeSuccessMsg}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Price Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold font-data-tabular text-[#dfe2f2]">
                {hoverIndex !== null
                  ? `$${chartPoints[hoverIndex].toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isPositive ? `+${changePercent}%` : `${changePercent}%`}
                </span>
                <span className="text-xs text-[#787B86]">
                  {hoverIndex !== null ? `Point #${hoverIndex + 1}` : 'Today'}
                </span>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center bg-[#171b26] p-1 rounded-lg border border-[#2A2E39]">
              <button
                onClick={() => handleTabSwitch('chart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'chart'
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-[#787B86] hover:text-[#dfe2f2]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Technical Chart
              </button>
              <button
                onClick={() => handleTabSwitch('ai')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-[#787B86] hover:text-[#dfe2f2]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b6c4ff]" />
                Gemini AI Analyst
              </button>
            </div>
          </div>

          {activeTab === 'chart' ? (
            <>
              {/* Timeframe Selector */}
              <div className="flex items-center gap-1 border-b border-[#2A2E39] pb-3">
                {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                      timeframe === tf
                        ? 'bg-[#313441] text-[#b6c4ff] border border-[#b6c4ff]/30'
                        : 'text-[#787B86] hover:text-[#dfe2f2]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart SVG Visualization */}
              <div className="relative bg-[#171b26] p-4 rounded-xl border border-[#2A2E39] h-64 flex flex-col justify-between">
                <div className="absolute top-3 left-3 text-[10px] text-[#787B86] font-mono">
                  MAX: ${maxPrice.toFixed(2)}
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] text-[#787B86] font-mono">
                  MIN: ${minPrice.toFixed(2)}
                </div>

                <svg 
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${chartPoints.length - 1} 100`}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d={`M 0,100 ${chartPoints.map((pt, i) => {
                      const y = 100 - ((pt - minPrice) / (maxPrice - minPrice || 1)) * 80 - 10;
                      return `L ${i},${y}`;
                    }).join(' ')} L ${chartPoints.length - 1},100 Z`}
                    fill="url(#chartGrad)"
                  />

                  {/* Line */}
                  <path
                    d={`M 0,${100 - ((chartPoints[0] - minPrice) / (maxPrice - minPrice || 1)) * 80 - 10} ${chartPoints.map((pt, i) => {
                      const y = 100 - ((pt - minPrice) / (maxPrice - minPrice || 1)) * 80 - 10;
                      return `L ${i},${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="1.5"
                  />

                  {/* Interactive Points */}
                  {chartPoints.map((pt, i) => {
                    const cx = i;
                    const cy = 100 - ((pt - minPrice) / (maxPrice - minPrice || 1)) * 80 - 10;
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={hoverIndex === i ? 2.5 : 0.8}
                        fill={isPositive ? '#089981' : '#F23645'}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoverIndex(i)}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#171b26] p-3 rounded-lg border border-[#2A2E39]">
                  <span className="text-[11px] text-[#787B86]">52-Wk High</span>
                  <p className="font-data-tabular font-semibold text-sm text-[#dfe2f2] mt-0.5">
                    ${isStock ? (item as StockItem).high52 : (currentPrice * 1.15).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-lg border border-[#2A2E39]">
                  <span className="text-[11px] text-[#787B86]">52-Wk Low</span>
                  <p className="font-data-tabular font-semibold text-sm text-[#dfe2f2] mt-0.5">
                    ${isStock ? (item as StockItem).low52 : (currentPrice * 0.82).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-lg border border-[#2A2E39]">
                  <span className="text-[11px] text-[#787B86]">Market Cap</span>
                  <p className="font-data-tabular font-semibold text-sm text-[#dfe2f2] mt-0.5">
                    {isStock ? (item as StockItem).marketCap : 'N/A'}
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-lg border border-[#2A2E39]">
                  <span className="text-[11px] text-[#787B86]">P/E Ratio</span>
                  <p className="font-data-tabular font-semibold text-sm text-[#dfe2f2] mt-0.5">
                    {isStock ? (item as StockItem).peRatio || 'N/A' : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isStock && onBuySell && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleTrade(true)}
                    className="flex-1 bg-[#089981] hover:bg-[#07806c] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow active:scale-98"
                  >
                    Buy 1 Share
                  </button>
                  <button
                    onClick={() => handleTrade(false)}
                    className="flex-1 bg-[#F23645] hover:bg-[#d62d3b] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow active:scale-98"
                  >
                    Sell 1 Share
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Gemini AI Analysis Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#2962ff]/10 p-3 rounded-xl border border-[#2962ff]/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#b6c4ff]" />
                  <span className="text-sm font-semibold text-[#dfe2f2]">
                    Powered by Gemini 3.6 Flash
                  </span>
                </div>
                <button
                  onClick={fetchAiAnalysis}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#2962ff] text-white rounded-lg text-xs font-semibold hover:bg-[#313441] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  Re-Analyze
                </button>
              </div>

              {isAiLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#b6c4ff] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-[#787B86]">
                    Evaluating order book, volatility metrics, and recent news catalysts...
                  </p>
                </div>
              ) : aiError ? (
                <div className="p-4 bg-[#F23645]/15 border border-[#F23645]/30 rounded-xl text-xs text-[#ffb4ab]">
                  {aiError}
                </div>
              ) : aiAnalysis ? (
                <div className="bg-[#171b26] p-5 rounded-xl border border-[#2A2E39] text-sm text-[#dfe2f2] leading-relaxed whitespace-pre-line font-['Inter']">
                  {aiAnalysis}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
