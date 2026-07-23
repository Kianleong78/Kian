import React, { useState } from 'react';
import { Star, Trash2, ArrowUpRight, ArrowDownRight, Bell, Plus, Search, TrendingUp } from 'lucide-react';
import { StockItem, MarketIndex } from '../types';

interface WatchlistViewProps {
  watchlist: (StockItem | MarketIndex)[];
  onRemove: (id: string) => void;
  onSelect: (item: StockItem | MarketIndex) => void;
  onOpenSearch: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlist,
  onRemove,
  onSelect,
  onOpenSearch
}) => {
  const [alertMap, setAlertMap] = useState<Record<string, boolean>>({});

  const toggleAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#dfe2f2]">
            My Watchlist
          </h1>
          <p className="text-xs text-[#787B86] mt-1">
            Track custom targets and receive real-time price tick notifications
          </p>
        </div>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 bg-[#2962ff] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#313441] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Symbol
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-[#2962ff]/10 text-[#b6c4ff] flex items-center justify-center mx-auto mb-4 border border-[#2962ff]/20">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#dfe2f2] mb-1">
            Your Watchlist is Empty
          </h3>
          <p className="text-xs text-[#787B86] mb-6">
            Keep track of stocks, indices, crypto, and commodities by clicking the star icon on any asset.
          </p>
          <button
            onClick={onOpenSearch}
            className="bg-[#2962ff] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#313441] transition-colors"
          >
            Explore Markets
          </button>
        </div>
      ) : (
        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#262a35] border-b border-[#2A2E39] text-xs font-semibold text-[#787B86]">
            <div className="col-span-5 md:col-span-4">Asset</div>
            <div className="col-span-4 md:col-span-3 text-right">Price</div>
            <div className="hidden md:block md:col-span-3 text-right">24h Change</div>
            <div className="col-span-3 md:col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-[#2A2E39]">
            {watchlist.map((item) => {
              const isStock = 'price' in item;
              const price = isStock ? (item as StockItem).price : (item as MarketIndex).value;
              const changePercent = item.changePercent;
              const isPos = changePercent >= 0;
              const hasAlert = !!alertMap[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-[#313441] transition-colors cursor-pointer group"
                >
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#b6c4ff] font-bold text-xs border border-[#434656] shrink-0">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors truncate">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-3 text-right font-data-tabular text-sm font-medium text-[#dfe2f2]">
                    ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  <div className="hidden md:block md:col-span-3 text-right">
                    <span className={`text-xs font-bold inline-flex items-center gap-0.5 ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {isPos ? `+${changePercent}%` : `${changePercent}%`}
                      {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <div className="col-span-3 md:col-span-2 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => toggleAlert(item.id, e)}
                      title={hasAlert ? "Alert Enabled" : "Enable Price Alert"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        hasAlert
                          ? 'bg-[#2962ff]/20 text-[#b6c4ff]'
                          : 'text-[#787B86] hover:text-[#dfe2f2] hover:bg-[#353945]'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      title="Remove from Watchlist"
                      className="p-1.5 text-[#787B86] hover:text-[#F23645] hover:bg-[#F23645]/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
};
