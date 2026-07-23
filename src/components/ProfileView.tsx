import React from 'react';
import { User, Wallet, TrendingUp, DollarSign, RefreshCw, Award, PieChart } from 'lucide-react';
import { PortfolioPosition } from '../types';

interface ProfileViewProps {
  portfolio: PortfolioPosition[];
  cashBalance: number;
  onResetPortfolio: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  portfolio,
  cashBalance,
  onResetPortfolio
}) => {
  const holdingsValue = portfolio.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
  const totalAccountValue = cashBalance + holdingsValue;
  const initialCapital = 100000;
  const totalProfitLoss = totalAccountValue - initialCapital;
  const totalReturnPct = +((totalProfitLoss / initialCapital) * 100).toFixed(2);

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 pb-24 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-[#1E222D] border border-[#2A2E39] p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2962ff]/20 border-2 border-[#b6c4ff]/30 text-[#b6c4ff] flex items-center justify-center font-bold text-2xl shrink-0">
            KL
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#dfe2f2]">
              Paper Trader Portfolio
            </h1>
            <p className="text-xs text-[#787B86] mt-0.5">
              Simulated Account • Pro Tier Membership
            </p>
          </div>
        </div>

        <button
          onClick={onResetPortfolio}
          className="flex items-center gap-2 bg-[#313441] hover:bg-[#353945] text-[#dfe2f2] px-4 py-2 rounded-full text-xs font-bold border border-[#2A2E39] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#787B86]" />
          Reset Demo Account
        </button>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1E222D] border border-[#2A2E39] p-5 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#787B86] mb-1">
            <Wallet className="w-4 h-4 text-[#b6c4ff]" />
            Total Portfolio Value
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-data-tabular text-[#dfe2f2]">
            ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs font-bold mt-1 ${totalProfitLoss >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
            {totalProfitLoss >= 0 ? `+$${totalProfitLoss.toFixed(2)} (+${totalReturnPct}%)` : `-$${Math.abs(totalProfitLoss).toFixed(2)} (${totalReturnPct}%)`}
          </div>
        </div>

        <div className="bg-[#1E222D] border border-[#2A2E39] p-5 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#787B86] mb-1">
            <DollarSign className="w-4 h-4 text-[#089981]" />
            Available Cash Balance
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-data-tabular text-[#dfe2f2]">
            ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#787B86] mt-1">
            Virtual USD Capital
          </div>
        </div>

        <div className="bg-[#1E222D] border border-[#2A2E39] p-5 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#787B86] mb-1">
            <PieChart className="w-4 h-4 text-[#66dabf]" />
            Active Equity Value
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-data-tabular text-[#dfe2f2]">
            ${holdingsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#787B86] mt-1">
            {portfolio.length} Open Positions
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[#2A2E39] bg-[#171b26] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#dfe2f2]">My Open Positions</h2>
          <span className="text-xs text-[#787B86]">{portfolio.length} assets held</span>
        </div>

        {portfolio.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#787B86]">
            No active positions. Click on any stock in Explore or Chart tab to buy/sell shares.
          </div>
        ) : (
          <div className="divide-y divide-[#2A2E39]">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#262a35] text-xs font-semibold text-[#787B86]">
              <div className="col-span-4">Asset</div>
              <div className="col-span-3 text-right">Shares</div>
              <div className="col-span-2 text-right">Avg Price</div>
              <div className="col-span-3 text-right">Market Value</div>
            </div>

            {portfolio.map((pos) => {
              const currentVal = pos.shares * pos.currentPrice;
              const costBasis = pos.shares * pos.avgPrice;
              const pnl = currentVal - costBasis;
              const isPos = pnl >= 0;

              return (
                <div key={pos.symbol} className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-[#313441] transition-colors">
                  <div className="col-span-4">
                    <div className="font-bold text-sm text-[#dfe2f2]">{pos.symbol}</div>
                    <div className="text-[10px] text-[#787B86]">{pos.name}</div>
                  </div>

                  <div className="col-span-3 text-right font-data-tabular text-sm font-medium text-[#dfe2f2]">
                    {pos.shares}
                  </div>

                  <div className="col-span-2 text-right font-data-tabular text-xs text-[#dfe2f2]">
                    ${pos.avgPrice.toFixed(2)}
                  </div>

                  <div className="col-span-3 text-right">
                    <div className="font-data-tabular text-sm font-semibold text-[#dfe2f2]">
                      ${currentVal.toFixed(2)}
                    </div>
                    <div className={`text-[11px] font-bold ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                      {isPos ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
