import React, { useState } from 'react';
import { Search, X, TrendingUp, ChevronRight, Star } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';
import { WORLD_INDICES, US_STOCKS, CRYPTO_ASSETS, FOREX_ASSETS, FUTURES_BONDS } from '../data/mockMarketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: StockItem | MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allAssets: (StockItem | MarketIndex)[] = [
    ...WORLD_INDICES,
    ...US_STOCKS,
    ...CRYPTO_ASSETS,
    ...FOREX_ASSETS,
    ...FUTURES_BONDS
  ];

  const filteredAssets = query.trim() === ''
    ? allAssets.slice(0, 8)
    : allAssets.filter(
        a => a.symbol.toLowerCase().includes(query.toLowerCase()) ||
             a.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1E222D] border border-[#2A2E39] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2A2E39] bg-[#171b26] gap-3">
          <Search className="w-5 h-5 text-[#b6c4ff]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, index or crypto (e.g., NVDA, AAPL, BTC, NI225)..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#dfe2f2] placeholder-[#787B86] focus:outline-none font-['Inter']"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#787B86] hover:text-[#dfe2f2] hover:bg-[#313441] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#2A2E39]/50">
          <div className="px-3 py-2 text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
            {query.trim() === '' ? 'Popular Symbols' : `Matching Results (${filteredAssets.length})`}
          </div>

          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86]">
              No assets matching "{query}".
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isStock = 'price' in asset;
              const price = isStock ? (asset as StockItem).price : (asset as MarketIndex).value;
              const changePct = asset.changePercent;
              const isPos = changePct >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelect(asset);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 hover:bg-[#313441] rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center border border-[#434656] text-[#b6c4ff] font-bold text-xs">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-xs text-[#787B86]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-data-tabular text-sm font-semibold text-[#dfe2f2]">
                      ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs font-bold ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {isPos ? `+${changePct}%` : `${changePct}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
