
import React, { useState, useEffect } from 'react';
import { Coins, ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { AppView } from '../types';

interface ProgressionViewProps {
  outcome: 'victory' | 'defeat' | 'draw' | 'declared';
  oldXp: number;
  oldLevel: number;
  currentXp: number;
  currentLevel: number;
  oldCoins: number;
  currentCoins: number;
  onNavigate?: (view: AppView) => void;
  onClose: () => void;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  outcome,
  oldXp,
  oldLevel,
  currentXp,
  currentLevel,
  oldCoins,
  currentCoins,
  onNavigate,
}) => {
  const [animatedXp, setAnimatedXp] = useState(oldXp);
  const [animatedCoins, setAnimatedCoins] = useState(oldCoins);
  
  const xpDiff = currentXp - oldXp;
  const coinDiff = currentCoins - oldCoins;
  const isXpLoss = xpDiff < 0;
  const isCoinLoss = coinDiff < 0;
  const levelUp = currentLevel > oldLevel;

  const isVictory = outcome === 'victory';
  const isDeclared = outcome === 'declared';

  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setAnimatedXp(Math.round(oldXp + (currentXp - oldXp) * eased));
      setAnimatedCoins(Math.round(oldCoins + (currentCoins - oldCoins) * eased));
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [oldXp, currentXp, oldCoins, currentCoins]);

  const progressPercent = (animatedXp % 2000) / 20;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-zinc-950 animate-in fade-in duration-300">
      
      <header className="p-6 bg-zinc-900/50 border-b border-zinc-800 text-center">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1">Victory Path</p>
        <h1 className="heading-font text-4xl font-black italic tracking-tighter text-white">REWARDS SUMMARY</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Outcome Title Overlay */}
        <div className="text-center py-4">
          <h2 className={`heading-font text-7xl font-black italic tracking-tighter leading-none ${
            isVictory ? 'text-emerald-500' : outcome === 'defeat' ? 'text-red-600' : isDeclared ? 'text-yellow-500' : 'text-zinc-400'
          }`}>
            {outcome.toUpperCase()}
          </h2>
        </div>

        {/* XP PROGRESSION */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] space-y-5 shadow-2xl">
           <div className="flex justify-between items-end">
             <div className="space-y-1">
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Player Rank</p>
               <h4 className={`heading-font text-3xl font-black leading-none ${levelUp ? 'text-emerald-400' : 'text-white'}`}>
                 Level {currentLevel} {levelUp && 'UP!'}
               </h4>
             </div>
             <div className="text-right">
               <p className={`heading-font text-2xl font-black italic leading-none flex items-center justify-end gap-1 ${isXpLoss ? 'text-red-500' : 'text-emerald-500'}`}>
                 {isXpLoss ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                 {Math.abs(xpDiff)} XP
               </p>
             </div>
           </div>
           
           <div className="relative h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-1">
              <div 
                className={`h-full rounded-full transition-all duration-300 ease-out ${isXpLoss ? 'bg-red-600/50' : 'bg-red-600'}`} 
                style={{ width: `${progressPercent}%` }} 
              />
           </div>
           
           <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              <span>{animatedXp} XP</span>
              <span>LVL {currentLevel + 1}</span>
           </div>
        </div>

        {/* CURRENCY UPDATE */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-600/20">
                 <Coins className="text-yellow-500" size={24} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Banked Coins</p>
                 <h4 className="heading-font text-3xl font-black text-white leading-none mt-1">{animatedCoins.toLocaleString()}</h4>
              </div>
           </div>
           <div className={`flex items-center gap-1 heading-font text-3xl font-black italic ${isCoinLoss ? 'text-red-500' : 'text-emerald-500'}`}>
              {isCoinLoss ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              {Math.abs(coinDiff)}
           </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 p-6 pb-12 z-50">
        <div className="max-w-lg mx-auto w-full flex gap-4">
          <button 
            onClick={() => onNavigate?.(AppView.GAMEPLAY)}
            className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            BACK
          </button>
          <button 
            onClick={() => onNavigate?.(AppView.MATCH_STATS)}
            className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:scale-[0.98] active:border-b-0 transition-all"
          >
            <span className="heading-font text-2xl font-black italic uppercase tracking-widest">NEXT</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};
