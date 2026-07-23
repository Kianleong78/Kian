import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Cpu,
  Smartphone,
  ShoppingCart,
  Search,
  Zap,
  Terminal,
  Share2,
  Tv,
  Coins,
  DollarSign,
  Radio
} from 'lucide-react';
import { CategoryTab, MarketIndex, StockItem, CompanyCap } from '../types';
import { WORLD_INDICES, US_STOCKS, WORLD_BIGGEST_COMPANIES, CRYPTO_ASSETS, FOREX_ASSETS, FUTURES_BONDS } from '../data/mockMarketData';

interface ExploreViewProps {
  onSelectStock: (stock: StockItem) => void;
  onSelectIndex: (index: MarketIndex) => void;
  onSeeAllStocks: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectStock,
  onSelectIndex,
  onSeeAllStocks,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('Indices');
  const [liveTicks, setLiveTicks] = useState<boolean>(true);
  const [indices, setIndices] = useState<MarketIndex[]>(WORLD_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(US_STOCKS);
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down'>>({});

  // Simulate real-time price updates (live market tick simulation)
  useEffect(() => {
    if (!liveTicks) return;

    const interval = setInterval(() => {
      // Randomly update 1 stock or index price
      const isStock = Math.random() > 0.4;
      if (isStock) {
        setStocks(prev => {
          const indexToUpdate = Math.floor(Math.random() * prev.length);
          const stock = prev[indexToUpdate];
          const deltaPercent = (Math.random() - 0.48) * 0.4;
          const priceDiff = +(stock.price * (deltaPercent / 100)).toFixed(2);
          const newPrice = +(stock.price + priceDiff).toFixed(2);
          const newChange = +(stock.change + priceDiff).toFixed(2);
          const newChangePercent = +(stock.changePercent + deltaPercent).toFixed(2);

          setFlashMap(f => ({ ...f, [stock.id]: deltaPercent >= 0 ? 'up' : 'down' }));
          setTimeout(() => {
            setFlashMap(f => {
              const copy = { ...f };
              delete copy[stock.id];
              return copy;
            });
          }, 800);

          return prev.map((s, idx) => 
            idx === indexToUpdate 
              ? { ...s, price: newPrice, change: newChange, changePercent: newChangePercent }
              : s
          );
        });
      } else {
        setIndices(prev => {
          const idxToUpdate = Math.floor(Math.random() * prev.length);
          const idxObj = prev[idxToUpdate];
          const deltaPercent = (Math.random() - 0.48) * 0.3;
          const diff = +(idxObj.value * (deltaPercent / 100)).toFixed(2);
          const newValue = +(idxObj.value + diff).toFixed(2);
          const newChangePercent = +(idxObj.changePercent + deltaPercent).toFixed(2);

          setFlashMap(f => ({ ...f, [idxObj.id]: deltaPercent >= 0 ? 'up' : 'down' }));
          setTimeout(() => {
            setFlashMap(f => {
              const copy = { ...f };
              delete copy[idxObj.id];
              return copy;
            });
          }, 800);

          return prev.map((item, i) =>
            i === idxToUpdate
              ? { ...item, value: newValue, changePercent: newChangePercent }
              : item
          );
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [liveTicks]);

  const categoryTabs: CategoryTab[] = [
    'Indices',
    'Stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds'
  ];

  const getStockIcon = (iconName: string) => {
    switch (iconName) {
      case 'token':
      case 'cpu':
        return <Cpu className="w-5 h-5 text-white" />;
      case 'apple':
        return <Smartphone className="w-5 h-5 text-white" />;
      case 'shopping':
        return <ShoppingCart className="w-5 h-5 text-white" />;
      case 'search':
        return <Search className="w-5 h-5 text-white" />;
      case 'car':
        return <Zap className="w-5 h-5 text-white" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-white" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-white" />;
      case 'crypto':
        return <Coins className="w-5 h-5 text-white" />;
      case 'currency':
        return <DollarSign className="w-5 h-5 text-white" />;
      default:
        return <Tv className="w-5 h-5 text-white" />;
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 pb-24">
      {/* Header Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#dfe2f2] tracking-tight">
              Markets, everywhere
            </h1>
            <ChevronDown className="w-6 h-6 text-[#c3c5d8] group-hover:text-[#b6c4ff] transition-colors" />
          </div>

          <button
            onClick={() => setLiveTicks(!liveTicks)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              liveTicks
                ? 'bg-[#089981]/15 text-[#089981] border-[#089981]/40'
                : 'bg-[#313441] text-[#787B86] border-[#2A2E39]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveTicks ? 'animate-pulse text-[#089981]' : ''}`} />
            {liveTicks ? 'Live Ticks Active' : 'Live Ticks Paused'}
          </button>
        </div>

        {/* Horizontal Scroll Tabs */}
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar fade-right border-b border-[#2A2E39] pb-0.5">
          {categoryTabs.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#2962ff] text-[#b6c4ff] font-bold'
                    : 'border-transparent text-[#787B86] hover:text-[#dfe2f2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </section>

      {/* World Indices Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#dfe2f2] flex items-center gap-1 group cursor-pointer">
            World indices
            <ChevronRight className="w-5 h-5 text-[#c3c5d8] group-hover:text-[#b6c4ff] transition-colors" />
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar fade-right snap-x pb-2">
          {indices.map((idx) => {
            const isPositive = idx.changePercent >= 0;
            const flash = flashMap[idx.id];

            return (
              <div
                key={idx.id}
                onClick={() => onSelectIndex(idx)}
                className={`min-w-[280px] bg-[#1E222D] border border-[#2A2E39] p-4 rounded-lg snap-start hover:border-[#434656] transition-all cursor-pointer group ${
                  flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
                        idx.badgeType === 'primary'
                          ? 'bg-[#2962ff]/20 border-[#b6c4ff]/20 text-[#b6c4ff]'
                          : idx.badgeType === 'secondary'
                          ? 'bg-[#20a28a]/20 border-[#66dabf]/20 text-[#66dabf]'
                          : 'bg-[#313441] border-[#8d90a2]/30 text-[#dfe2f2]'
                      }`}
                    >
                      {idx.badgeText || idx.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                        {idx.symbol}
                      </h3>
                      <p className="text-[11px] text-[#787B86] font-medium">
                        {idx.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-data-tabular text-[20px] font-semibold text-[#dfe2f2]">
                      {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-xs font-bold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                      </span>
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-[#F23645]" />
                      )}
                    </div>
                  </div>

                  {/* Sparkline Visual */}
                  <div className="w-24 h-10 flex items-end gap-1">
                    {idx.sparkline.map((val, i) => {
                      const maxVal = Math.max(...idx.sparkline);
                      const heightPct = Math.max(15, Math.round((val / maxVal) * 100));
                      return (
                        <div
                          key={i}
                          style={{ height: `${heightPct}%` }}
                          className={`w-1 rounded-t-sm transition-all ${
                            isPositive ? 'bg-[#089981]/50' : 'bg-[#F23645]/50'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Content Conditional View */}
      {activeTab === 'Crypto' && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#dfe2f2] mb-4">Top Cryptocurrencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CRYPTO_ASSETS.map((crypto) => (
              <div
                key={crypto.id}
                onClick={() => onSelectStock(crypto)}
                className="flex items-center justify-between p-4 bg-[#1E222D] border border-[#2A2E39] rounded-lg hover:border-[#434656] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-[#434656]">
                    <Coins className="w-5 h-5 text-[#b6c4ff]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#dfe2f2]">{crypto.symbol}</h4>
                    <p className="text-xs text-[#787B86]">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-data-tabular text-sm font-semibold text-[#dfe2f2]">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-bold ${crypto.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {crypto.changePercent >= 0 ? `+${crypto.changePercent}%` : `${crypto.changePercent}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'Forex' && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#dfe2f2] mb-4">Popular Forex Pairs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FOREX_ASSETS.map((fx) => (
              <div
                key={fx.id}
                onClick={() => onSelectStock(fx)}
                className="flex items-center justify-between p-4 bg-[#1E222D] border border-[#2A2E39] rounded-lg hover:border-[#434656] cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[#dfe2f2]">{fx.symbol}</h4>
                  <p className="text-xs text-[#787B86]">{fx.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-data-tabular text-sm font-semibold text-[#dfe2f2]">
                    {fx.price.toFixed(4)}
                  </div>
                  <div className={`text-xs font-bold ${fx.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {fx.changePercent >= 0 ? `+${fx.changePercent}%` : `${fx.changePercent}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'Futures' && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-[#dfe2f2] mb-4">Commodities & Futures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FUTURES_BONDS.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectStock(item)}
                className="flex items-center justify-between p-4 bg-[#1E222D] border border-[#2A2E39] rounded-lg hover:border-[#434656] cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[#dfe2f2]">{item.symbol}</h4>
                  <p className="text-xs text-[#787B86]">{item.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-data-tabular text-sm font-semibold text-[#dfe2f2]">
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-bold ${item.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                    {item.changePercent >= 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* US Stocks Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#dfe2f2] flex items-center gap-2 group cursor-pointer">
            {/* US Flag Image from prompt */}
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuxag_GfVl7nhSZxR6QP7CqZid3nm-NppHJ5Z5eib8-JatuKIPYTplSl03S6viUPS_q4dp0lNAckCtcouBe1ePJm2OvHVCQEls9wlO5r3xopVbBwxp20m7FYpMKlEoaQJwgpSIT0k-zikrNPhTIkgO84jVrhu8ucp63oxOVFRAKq2-qiKouvBU4T1EtoDgjOxjcyJ_VYoz-0SAWo4Yl8PuLTyeFQlL5s1vmXVsTOZivbbs0hrGG2HybiYDDo7epkQW3W7_e-kW4w" 
              alt="US Flag" 
              className="w-6 h-4 object-cover rounded-[2px]" 
            />
            US stocks
            <ChevronRight className="w-5 h-5 text-[#c3c5d8] group-hover:text-[#b6c4ff] transition-colors" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-1">
          {stocks.map((stock) => {
            const isPositive = stock.changePercent >= 0;
            const flash = flashMap[stock.id];

            return (
              <div
                key={stock.id}
                onClick={() => onSelectStock(stock)}
                className={`flex items-center justify-between py-3 px-4 border-b border-[#2A2E39] hover:bg-[#1b1f2b] transition-all cursor-pointer group rounded-sm ${
                  flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-[#434656] shrink-0">
                    {getStockIcon(stock.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                        {stock.symbol}
                      </h4>
                      <span className="bg-[#313441] text-[#c3c5d8] text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-[#787B86] line-clamp-1">
                      {stock.name}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-data-tabular text-base text-[#dfe2f2]">
                    {stock.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onSeeAllStocks}
          className="w-full mt-6 py-3 border border-[#2A2E39] rounded-full text-xs font-bold text-[#dfe2f2] hover:bg-[#313441] transition-colors cursor-pointer active:scale-98"
        >
          See all US stocks
        </button>
      </section>

      {/* World Biggest Companies Table Style */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#dfe2f2] mb-4">
          World biggest companies
        </h2>
        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#262a35] border-b border-[#2A2E39]">
            <div className="col-span-6 text-xs font-medium text-[#787B86]">Symbol</div>
            <div className="col-span-6 text-xs font-medium text-[#787B86] text-right">Market cap</div>
          </div>

          <div className="divide-y divide-[#2A2E39]">
            {WORLD_BIGGEST_COMPANIES.map((company, i) => {
              const isPos = company.changePercent >= 0;
              return (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#313441] transition-colors cursor-pointer"
                  onClick={() => {
                    const match = US_STOCKS.find(s => s.symbol === company.symbol);
                    if (match) onSelectStock(match);
                  }}
                >
                  <div className="col-span-6 flex flex-col">
                    <span className="font-semibold text-sm text-[#dfe2f2]">{company.symbol}</span>
                    <span className="text-[10px] text-[#787B86]">{company.name}</span>
                  </div>
                  <div className="col-span-6 text-right flex flex-col justify-center">
                    <span className="font-data-tabular text-sm text-[#dfe2f2]">{company.marketCap}</span>
                    <span className={`text-[10px] font-bold ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {isPos ? `+${company.changePercent}%` : `${company.changePercent}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
