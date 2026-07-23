import React from 'react';
import { Star, BarChart2, Compass, Newspaper, User } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  watchlistCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  watchlistCount = 0
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: (
        <div className="relative">
          <Star className={`w-5 h-5 ${activeTab === 'watchlist' ? 'fill-[#b6c4ff] text-[#b6c4ff]' : ''}`} />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#F23645] text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
              {watchlistCount}
            </span>
          )}
        </div>
      )
    },
    {
      id: 'chart',
      label: 'Chart',
      icon: <BarChart2 className="w-5 h-5" />
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'fill-[#b6c4ff] text-[#b6c4ff]' : ''}`} />
    },
    {
      id: 'news',
      label: 'News',
      icon: <Newspaper className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-14 px-2 bg-[#1b1f2b] border-t border-[#2A2E39]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all active:scale-90 ${
              isActive
                ? 'text-[#b6c4ff] font-bold'
                : 'text-[#787B86] hover:text-[#dfe2f2]'
            }`}
          >
            {tab.icon}
            <span className="text-[11px] font-medium tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
