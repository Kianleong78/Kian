import React from 'react';
import { Menu, Search, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onToggleMenu?: () => void;
  isAiActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenGetStarted,
  onToggleMenu,
  isAiActive
}) => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full px-4 md:px-8 h-14 bg-[#0f131e]/85 backdrop-blur-md border-b border-[#2A2E39]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMenu || onOpenSearch}
          className="text-[#b6c4ff] hover:opacity-80 transition-opacity p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b6c4ff]"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl md:text-2xl font-extrabold text-[#dfe2f2] tracking-tight">
          Markets
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {isAiActive && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2962ff]/20 text-[#b6c4ff] text-xs font-semibold border border-[#2962ff]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#b6c4ff] animate-pulse" />
            Gemini AI Live
          </span>
        )}
        <button 
          onClick={onOpenSearch}
          className="text-[#dfe2f2] hover:text-[#b6c4ff] p-1.5 rounded-full hover:bg-[#1E222D] transition-colors focus:outline-none"
          aria-label="Search markets"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={onOpenGetStarted}
          className="bg-[#2962ff] text-[#f7f5ff] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#313441] transition-colors cursor-pointer shadow-sm active:scale-95"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
