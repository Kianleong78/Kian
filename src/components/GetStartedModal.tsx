import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1E222D] border border-[#2A2E39] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#787B86] hover:text-[#dfe2f2] hover:bg-[#313441] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#2962ff]/20 text-[#b6c4ff] flex items-center justify-center border border-[#2962ff]/30">
              <Zap className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#dfe2f2]">
                Start Trading with Markets Pro
              </h2>
              <p className="text-xs text-[#787B86] mt-1 leading-relaxed">
                Unlock real-time tick streaming, custom price alerts, $100,000 paper trading capital, and Gemini AI analysis.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#787B86] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  className="w-full bg-[#171b26] border border-[#2A2E39] rounded-xl px-4 py-2.5 text-sm text-[#dfe2f2] placeholder-[#787B86] focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2962ff] hover:bg-[#313441] text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-[#2A2E39] flex items-center gap-2 text-[11px] text-[#787B86]">
              <ShieldCheck className="w-4 h-4 text-[#089981]" />
              <span>No credit card required. Instantly allocated $100k demo balance.</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#089981]/20 text-[#089981] flex items-center justify-center border border-[#089981]/30 mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#dfe2f2]">
              Account Activated!
            </h2>
            <p className="text-xs text-[#787B86]">
              Welcome to Markets Pro! Your demo paper trading wallet has been initialized with $100,000.
            </p>
            <button
              onClick={onClose}
              className="bg-[#2962ff] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#313441] transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
