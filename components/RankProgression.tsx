
import React, { useState } from 'react';
import { ArrowLeft, Medal, Gem, Lock, Trophy, Shield, MapPin, Package, Library, Star, CheckCircle2, Zap } from 'lucide-react';
import { Modal } from './Modal';

interface RankProgressionProps {
  onClose: () => void;
  rank: number;
  xp: number;
}

const LEVEL_REWARDS = [
  { level: 1, free: { name: 'Starter Pack', icon: Package, type: 'ITEM' }, premium: { name: 'Gold Border', icon: Library, type: 'COSMETIC' } },
  { level: 2, free: { name: '500 Coins', icon: Zap, type: 'CURRENCY' }, premium: { name: 'Rare Variant', icon: Library, type: 'ART' } },
  { level: 3, free: { name: 'London Arena', icon: MapPin, type: 'UNLOCK' }, premium: { name: 'Silver Frame', icon: Library, type: 'COSMETIC' } },
  { level: 4, free: { name: 'Rank Badge', icon: Shield, type: 'STATUS' }, premium: { name: '100 Gems', icon: Gem, type: 'PREMIUM' } },
  { level: 5, free: { name: 'Account XP', icon: Star, type: 'BONUS' }, premium: { name: 'Epic Box', icon: Package, type: 'BUNDLE' } },
  { level: 6, free: { name: '200 Gems', icon: Gem, type: 'CURRENCY' }, premium: { name: 'Elite Avatar', icon: Medal, type: 'AVATAR' } },
  { level: 7, free: { name: 'Prestige Icon', icon: Trophy, type: 'STATUS' }, premium: { name: 'Epic Pack', icon: Package, type: 'BUNDLE' } },
  { level: 8, free: { name: 'Limited Box', icon: Package, type: 'ITEM' }, premium: { name: 'Mythic Banner', icon: Library, type: 'COSMETIC' } },
  { level: 9, free: { name: 'Coin Boost', icon: Zap, type: 'ECONOMY' }, premium: { name: 'Legendary Finisher', icon: Star, type: 'ART' } },
  { level: 10, free: { name: 'Master Pack', icon: Package, type: 'ITEM' }, premium: { name: 'World Series Pass', icon: MapPin, type: 'UNLOCK' } },
];

export const RankProgression: React.FC<RankProgressionProps> = ({ onClose, rank, xp }) => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  const nextLevel = rank + 1;
  const levelInterval = 2000; 
  const remainingXp = Math.max(0, levelInterval - xp);
  const progressPercent = (xp / levelInterval) * 100;

  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-300 overflow-hidden">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 px-6 py-6 border-b border-zinc-900 flex items-center bg-black/95 backdrop-blur-xl shrink-0">
        <button 
          onClick={onClose}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="heading-font text-3xl font-black italic text-zinc-100 tracking-tighter ml-4 uppercase">RANK PROGRESSION</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 2. COMPACT RANK SUMMARY (TOP) */}
        <section className="px-6 py-6 flex flex-col items-center shrink-0 border-b border-zinc-900/50 bg-zinc-950/30">
          <div className="w-full max-w-sm flex items-center justify-between gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-amber-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.05)]">
                <span className="heading-font text-4xl font-black italic text-white leading-none tracking-tighter">
                  {rank}
                </span>
                <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mt-0.5">LVL</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white italic heading-font leading-none">{xp} / {levelInterval} XP</p>
                  <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mt-1">Status: Master</p>
                </div>
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                  {remainingXp} XP TO LVL {nextLevel}
                </p>
              </div>
              
              <div className="relative h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-[1200ms]" 
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. VERTICAL TREE LAYOUT (TOP TO BOTTOM CLIMB) */}
        <section className="px-4 py-8 relative">
          <div className="flex justify-between items-center mb-8 px-4">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">FREE PASS</span>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">PREMIUM PASS</span>
          </div>

          <div className="relative flex flex-col gap-12 pb-32">
            {/* Spine connecting levels */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-zinc-900 z-0" />
            
            {LEVEL_REWARDS.map((m) => {
              const isUnlocked = rank >= m.level;
              const isNext = rank === m.level - 1;

              return (
                <div key={m.level} className="relative flex items-center justify-center min-h-[80px]">
                  
                  {/* LEFT TRACK: FREE */}
                  <div className={`absolute left-0 right-[calc(50%+34px)] flex justify-end transition-opacity duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-zinc-900/40 border border-zinc-800/50 p-2.5 rounded-xl w-full max-w-[130px] flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isUnlocked ? 'bg-zinc-800 text-white' : 'bg-zinc-950 text-zinc-800'}`}>
                        <m.free.icon size={14} />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="heading-font text-[12px] font-black text-zinc-100 italic truncate leading-none uppercase">{m.free.name}</span>
                         <span className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter mt-1">{m.free.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTER SPINE NODE: LEVEL NUMBER */}
                  <div className={`relative z-10 w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                    isUnlocked 
                      ? 'bg-amber-500 border-zinc-950 text-zinc-950 scale-100' 
                      : isNext
                        ? 'bg-zinc-950 border-amber-500/40 text-amber-500 scale-110 ring-2 ring-amber-500/5'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-800 scale-90'
                  }`}>
                    <span className="heading-font text-xl font-black italic leading-none">{m.level}</span>
                    <span className="text-[6px] font-black uppercase tracking-tighter -mt-0.5">LVL</span>
                  </div>

                  {/* RIGHT TRACK: PREMIUM */}
                  <div 
                    onClick={() => setIsPremiumModalOpen(true)}
                    className={`absolute left-[calc(50%+34px)] right-0 flex justify-start cursor-pointer group transition-opacity duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className={`bg-zinc-900/60 border border-amber-500/5 p-2.5 rounded-xl w-full max-w-[130px] flex items-center gap-2.5 relative overflow-hidden group-hover:bg-zinc-900 transition-colors ${isUnlocked ? 'animate-shimmer' : ''}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isUnlocked ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-950 text-amber-900/40'}`}>
                        <m.premium.icon size={14} />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="heading-font text-[12px] font-black text-amber-500 italic truncate leading-none uppercase">{m.premium.name}</span>
                         <span className="text-[6px] font-black text-amber-600/40 uppercase tracking-tighter mt-1">{m.premium.type}</span>
                      </div>
                      {!isUnlocked && <Lock size={8} className="text-zinc-800 ml-auto" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Monetisation Modal */}
      <Modal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} title="PREMIUM PASS">
        <div className="flex flex-col items-center text-center gap-6 py-4">
           <div className="w-24 h-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center border border-amber-500/20 shadow-2xl shadow-amber-900/20">
              <Trophy size={48} className="text-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
           </div>
           
           <div className="space-y-2 px-6">
              <h3 className="heading-font text-4xl font-black italic text-white uppercase tracking-tighter">ELITE SEASON PASS</h3>
              <p className="text-zinc-400 text-[12px] font-medium leading-relaxed px-2">Unleash the full potential of your career. Unlock legendary card variants, exclusive stadium frames, and elite currency rewards at every level.</p>
           </div>

           <div className="w-full space-y-3 px-2">
              <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                 <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                 <span className="text-[11px] font-black text-zinc-200 uppercase tracking-widest text-left">Mythic Player Variants & Skins</span>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                 <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                 <span className="text-[11px] font-black text-zinc-200 uppercase tracking-widest text-left">Exclusive "Elite" Social Status</span>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                 <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                 <span className="text-[11px] font-black text-zinc-200 uppercase tracking-widest text-left">Bonus 2,500 Gems & 50,000 Coins</span>
              </div>
           </div>

           <div className="w-full space-y-4 px-2 pt-4">
              <button 
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-5 rounded-2xl heading-font text-3xl font-black italic uppercase tracking-[0.05em] shadow-[0_15px_40px_rgba(251,191,36,0.2)] active:scale-[0.98] transition-all border-b-4 border-amber-700"
              >
                 PURCHASE ₹799
              </button>
              <button 
                onClick={() => setIsPremiumModalOpen(false)}
                className="w-full text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-colors py-2"
              >
                 NOT NOW
              </button>
           </div>
        </div>
      </Modal>
    </div>
  );
};
