
import React, { useState, useEffect } from 'react';
import { Coins, Package, X, ChevronUp, ChevronDown } from 'lucide-react';
import { MatchState } from '../types';

interface ProgressionViewProps {
  outcome: 'victory' | 'defeat' | 'draw' | 'declared';
  declaredBalls: number | null;
  oldXp: number;
  oldLevel: number;
  currentXp: number;
  currentLevel: number;
  oldCoins: number;
  currentCoins: number;
  onClose: () => void;
  match: MatchState;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  outcome,
  oldXp,
  oldLevel,
  currentXp,
  currentLevel,
  oldCoins,
  currentCoins,
  onClose,
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Phase 2 CTA: Single Close Affordance */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all active:scale-90 z-[210]"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pt-10">
          {/* Outcome Header */}
          <div className="text-center space-y-1">
            <h2 className={`heading-font text-6xl font-black italic tracking-tighter leading-none ${
              isVictory ? 'text-emerald-500' : outcome === 'defeat' ? 'text-red-600' : isDeclared ? 'text-yellow-500' : 'text-zinc-400'
            }`}>
              {isDeclared ? 'TACTICAL RETREAT' : outcome.toUpperCase()}
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Account Progression</p>
          </div>

          {/* XP PROGRESSION */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl space-y-4">
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rank Progression</p>
                 <h4 className={`heading-font text-2xl font-black leading-none ${levelUp ? 'text-emerald-400' : 'text-white'}`}>
                   Level {currentLevel} {levelUp && 'UP!'}
                 </h4>
               </div>
               <div className="text-right">
                 <p className={`heading-font text-xl font-black italic leading-none flex items-center justify-end gap-0.5 ${isXpLoss ? 'text-red-500' : 'text-emerald-500'}`}>
                   {isXpLoss ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                   {Math.abs(xpDiff)} XP
                 </p>
               </div>
             </div>
             <div className="relative h-2.5 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div className={`h-full rounded-full transition-all duration-300 ease-out ${isXpLoss ? 'bg-red-600/50' : 'bg-red-600'}`} style={{ width: `${progressPercent}%` }} />
             </div>
             <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                <span>{animatedXp} Total XP</span>
                <span>Next LV. {currentLevel + 1}</span>
             </div>
          </div>

          {/* CURRENCY UPDATE */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-600/20">
                   <Coins className="text-yellow-500" size={18} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Coin Balance</p>
                   <h4 className="heading-font text-2xl font-black text-white leading-none mt-1">{animatedCoins}</h4>
                </div>
             </div>
             <div className={`flex items-center gap-0.5 heading-font text-xl font-black italic ${isCoinLoss ? 'text-red-500' : 'text-emerald-500'}`}>
                {isCoinLoss ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                {Math.abs(coinDiff)}
             </div>
          </div>

          {/* REWARDS (If Any) */}
          {isVictory && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl text-center space-y-2">
              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">New Item Claimed</p>
              <div className="flex items-center justify-center gap-3">
                 <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Package className="text-emerald-500" size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase leading-none">Red Fury Skin</p>
                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase mt-0.5">Exclusive Reward</p>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Informational Footer (Visual Only) */}
        <div className="p-4 py-8 bg-zinc-900/50 border-t border-zinc-900 text-center">
           <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] italic">Acknowledge progression to dismiss</p>
        </div>
      </div>
    </div>
  );
};
