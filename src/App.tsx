import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { WatchlistView } from './components/WatchlistView';
import { NewsView } from './components/NewsView';
import { ProfileView } from './components/ProfileView';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { NavTab, StockItem, MarketIndex, PortfolioPosition } from './types';
import { WORLD_INDICES, US_STOCKS } from './data/mockMarketData';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('explore');
  const [selectedAsset, setSelectedAsset] = useState<StockItem | MarketIndex | null>(US_STOCKS[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);

  // Initial Watchlist
  const [watchlist, setWatchlist] = useState<(StockItem | MarketIndex)[]>([
    US_STOCKS[0], // NVDA
    WORLD_INDICES[0], // NI225
    US_STOCKS[1] // AAPL
  ]);

  // Initial Portfolio
  const [cashBalance, setCashBalance] = useState<number>(95000);
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 10,
      avgPrice: 138.50,
      currentPrice: 143.59
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 15,
      avgPrice: 228.00,
      currentPrice: 231.41
    }
  ]);

  const handleSelectAsset = (item: StockItem | MarketIndex) => {
    setSelectedAsset(item);
    setIsDetailModalOpen(true);
  };

  const handleToggleWatchlist = (item: StockItem | MarketIndex) => {
    setWatchlist((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      if (exists) {
        return prev.filter((x) => x.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((x) => x.id !== id));
  };

  const handleBuySell = (symbol: string, name: string, price: number, isBuy: boolean) => {
    if (isBuy) {
      if (cashBalance >= price) {
        setCashBalance((c) => c - price);
        setPortfolio((prev) => {
          const existing = prev.find((p) => p.symbol === symbol);
          if (existing) {
            const newShares = existing.shares + 1;
            const newAvgPrice = ((existing.shares * existing.avgPrice) + price) / newShares;
            return prev.map((p) =>
              p.symbol === symbol ? { ...p, shares: newShares, avgPrice: newAvgPrice, currentPrice: price } : p
            );
          } else {
            return [...prev, { symbol, name, shares: 1, avgPrice: price, currentPrice: price }];
          }
        });
      }
    } else {
      setPortfolio((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing && existing.shares > 0) {
          setCashBalance((c) => c + price);
          if (existing.shares === 1) {
            return prev.filter((p) => p.symbol !== symbol);
          } else {
            return prev.map((p) =>
              p.symbol === symbol ? { ...p, shares: p.shares - 1, currentPrice: price } : p
            );
          }
        }
        return prev;
      });
    }
  };

  const handleResetPortfolio = () => {
    setCashBalance(100000);
    setPortfolio([]);
  };

  const isInWatchlist = (id?: string) => {
    if (!id) return false;
    return watchlist.some((x) => x.id === id);
  };

  return (
    <div className="min-h-screen bg-[#0f131e] text-[#dfe2f2] font-['Inter',sans-serif] selection:bg-[#b6c4ff]/30">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        isAiActive={true}
      />

      {/* Main Content Body */}
      {activeNavTab === 'explore' && (
        <ExploreView
          onSelectStock={handleSelectAsset}
          onSelectIndex={handleSelectAsset}
          onSeeAllStocks={() => setIsSearchOpen(true)}
        />
      )}

      {activeNavTab === 'watchlist' && (
        <WatchlistView
          watchlist={watchlist}
          onRemove={handleRemoveFromWatchlist}
          onSelect={handleSelectAsset}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {activeNavTab === 'chart' && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 pb-24">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-[#dfe2f2]">
              Interactive Chart Hub
            </h1>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-xs bg-[#2962ff] text-white px-3.5 py-1.5 rounded-full font-bold hover:bg-[#313441] transition-colors"
            >
              Switch Asset
            </button>
          </div>

          {selectedAsset ? (
            <div className="bg-[#1E222D] border border-[#2A2E39] p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#dfe2f2]">{selectedAsset.symbol}</h2>
                  <p className="text-xs text-[#787B86]">{selectedAsset.name}</p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="bg-[#313441] hover:bg-[#353945] text-[#b6c4ff] px-4 py-2 rounded-lg text-xs font-bold border border-[#2A2E39] transition-colors"
                >
                  Open Full Screen Chart & AI Analysis
                </button>
              </div>
              <p className="text-xs text-[#787B86]">
                Click "Open Full Screen Chart & AI Analysis" above or select any ticker from the Explore page to view interactive charts, key stats, and Gemini AI sentiment reports.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#787B86]">
              Select an asset from Explore or Watchlist to view detailed technical charts.
            </div>
          )}
        </div>
      )}

      {activeNavTab === 'news' && <NewsView />}

      {activeNavTab === 'profile' && (
        <ProfileView
          portfolio={portfolio}
          cashBalance={cashBalance}
          onResetPortfolio={handleResetPortfolio}
        />
      )}

      {/* Asset Detail & Chart Modal */}
      {isDetailModalOpen && (
        <StockDetailModal
          item={selectedAsset}
          onClose={() => setIsDetailModalOpen(false)}
          isInWatchlist={isInWatchlist(selectedAsset?.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onBuySell={handleBuySell}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelectAsset}
      />

      {/* Get Started Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      {/* Bottom Nav Bar */}
      <BottomNav
        activeTab={activeNavTab}
        onTabChange={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'chart' && selectedAsset && !isDetailModalOpen) {
            setIsDetailModalOpen(true);
          }
        }}
        watchlistCount={watchlist.length}
      />
    </div>
  );
}
