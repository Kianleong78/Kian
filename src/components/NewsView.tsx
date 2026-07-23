import React, { useState } from 'react';
import { Newspaper, Sparkles, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/mockMarketData';
import { NewsArticle } from '../types';

export const NewsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [aiTakeaways, setAiTakeaways] = useState<string[] | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const categories = ['All', 'Market News', 'Tech', 'Crypto', 'Macro', 'Earnings'];

  const filteredNews = selectedCategory === 'All'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter(n => n.category === selectedCategory);

  const fetchNewsDigest = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/news-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory })
      });
      const data = await res.json();
      if (data.takeaways) {
        setAiTakeaways(data.takeaways);
      }
    } catch {
      setAiTakeaways([
        "Tech earnings and AI spending remain primary drivers for NASDAQ strength.",
        "Central bank interest rate decisions are keeping global bond yields stable.",
        "Crypto asset institutional adoption continues via ETF record inflows."
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#dfe2f2]">
            Financial News & Intelligence
          </h1>
          <p className="text-xs text-[#787B86] mt-1">
            Real-time macroeconomic reporting, earnings calls, and AI market briefings
          </p>
        </div>

        <button
          onClick={fetchNewsDigest}
          disabled={isLoadingAi}
          className="flex items-center gap-2 bg-[#2962ff] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#313441] transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#b6c4ff]" />
          {isLoadingAi ? 'Generating AI Digest...' : 'AI Market Digest'}
        </button>
      </div>

      {/* AI Digest Card */}
      {aiTakeaways && (
        <div className="bg-[#1E222D] border border-[#2962ff]/40 p-5 rounded-xl mb-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2962ff]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 text-sm font-bold text-[#b6c4ff] mb-3">
            <Sparkles className="w-4 h-4" />
            Gemini AI Financial Briefing ({selectedCategory})
          </div>
          <ul className="space-y-2 text-xs text-[#dfe2f2]">
            {aiTakeaways.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#2962ff] font-bold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#2962ff] text-white'
                : 'bg-[#1E222D] text-[#787B86] hover:text-[#dfe2f2] border border-[#2A2E39]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="bg-[#1E222D] border border-[#2A2E39] p-5 rounded-xl hover:border-[#434656] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold bg-[#313441] text-[#b6c4ff] px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-[#787B86]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-[#dfe2f2] mb-2 hover:text-[#b6c4ff] transition-colors cursor-pointer">
                {article.title}
              </h3>

              <p className="text-xs text-[#787B86] leading-relaxed mb-4">
                {article.summary}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#2A2E39] pt-3 text-xs">
              <span className="font-semibold text-[#c3c5d8]">
                {article.source}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  article.sentiment === 'Bullish'
                    ? 'bg-[#089981]/20 text-[#089981]'
                    : article.sentiment === 'Bearish'
                    ? 'bg-[#F23645]/20 text-[#F23645]'
                    : 'bg-[#313441] text-[#787B86]'
                }`}
              >
                {article.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
