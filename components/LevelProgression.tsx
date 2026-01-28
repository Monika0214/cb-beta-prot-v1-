import React from 'react';
import { Gift, Star, ShieldCheck, ArrowLeft } from 'lucide-react';

interface LevelProgressionProps {
  onClose: () => void;
  level?: number;
  xp?: number;
}

export const LevelProgression: React.FC<LevelProgressionProps> = ({ 
  onClose, 
  level = 5, 
  xp = 1200
}) => {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const currentLevel = level;
  const maxLevelXp = 2000;
  const progressPercent = (xp / maxLevelXp) * 100;

  return (
    <div className="flex flex-col min-h-full bg-black animate-in fade-in duration-300">
      {/* 1. HEADER (Simple & Focused) */}
      <div className="sticky top-0 z-50 px-6 py-6 border-b border-zinc-900 flex items-center bg-black/95 backdrop-blur-xl">
        <button 
          onClick={onClose}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="heading-font text-3xl font-black italic text-amber-500 tracking-tighter ml-4 uppercase">COLLECTION LEVEL</h2>
      </div>

      <div className="flex-1 pb-12">
        {/* 2. COLLECTION LEVEL MODULE (HERO SECTION - GOLD THEME) */}
        <section className="px-6 py-10">
          <div className="bg-zinc-950 border border-amber-500/20 rounded-[3rem] p-10 flex flex-col items-center relative overflow-hidden shadow-[0_0_60px_rgba(251,191,36,0.05)]">
            {/* Soft Ambient Gold Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <p className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.5em] mb-6">CURRENT STANDING</p>
            
            <div className="relative mb-10 flex flex-col items-center">
               <div className="heading-font text-[10rem] font-black italic text-white leading-none tracking-tighter drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]">
                 {currentLevel}
               </div>
               <div className="absolute -bottom-4 bg-amber-500 px-6 py-1 rounded-lg border-2 border-zinc-950 shadow-xl shadow-amber-900/40">
                 <span className="heading-font text-2xl font-black italic text-zinc-950 uppercase tracking-widest">LEVEL</span>
               </div>
            </div>

            {/* XP PROGRESS BAR (GOLD) */}
            <div className="w-full space-y-4 pt-4">
              <div className="relative h-5 bg-zinc-900 rounded-full border border-zinc-800 p-1 overflow-hidden shadow-inner">
                 <div 
                   className="h-full bg-amber-500 rounded-full relative shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-[1200ms] ease-out" 
                   style={{ width: `${progressPercent}%` }}
                 >
                   {/* Premium Minimal Pulse */}
                   <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                 </div>
              </div>
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{xp} / {maxLevelXp} XP</span>
                 <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em]">PROGRESS TO LV.{currentLevel + 1}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LEVEL REWARD TRACK */}
        <section className="px-6 py-4 space-y-8">
          <div className="flex items-center gap-4 px-2">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">SYSTEM REWARDS</span>
            <div className="flex-1 h-[1px] bg-zinc-900/50" />
          </div>

          <div className="relative flex flex-col gap-8">
            {/* Central Track Rail */}
            <div className="absolute left-[26px] top-0 bottom-0 w-1 bg-zinc-900 z-0" />
            
            {levels.reverse().map((lv) => {
              const isCurrent = lv === currentLevel;
              const isPast = lv < currentLevel;
              const isFuture = lv > currentLevel;

              return (
                <div key={lv} className={`flex items-center gap-8 relative z-10 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                  {/* Level Orb */}
                  <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-amber-500 border-black text-zinc-950 scale-110 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
                      : isPast
                        ? 'bg-zinc-800 border-black text-emerald-500'
                        : 'bg-zinc-900 border-black text-zinc-700'
                  }`}>
                    <span className="heading-font text-2xl font-black italic">{lv}</span>
                  </div>

                  {/* Reward Card Tile */}
                  <div className={`flex-1 p-6 rounded-[2rem] border transition-all duration-500 ${
                    isCurrent 
                      ? 'bg-zinc-900/60 border-amber-500/40 text-white shadow-lg' 
                      : isPast
                        ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400 opacity-60'
                        : 'bg-transparent border-zinc-900 text-zinc-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${lv % 3 === 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                           {lv % 3 === 0 ? <Gift size={24} /> : <Star size={24} />}
                        </div>
                        <div className="flex flex-col">
                           <h4 className="heading-font text-2xl font-black italic uppercase leading-none">
                             {lv % 3 === 0 ? 'Legendary Box' : 'Bonus Pack'}
                           </h4>
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mt-1.5">
                             {isPast ? 'Already Claimed' : isCurrent ? 'Active Milestone' : 'Unlocks at Lv. ' + lv}
                           </p>
                        </div>
                      </div>
                      {isPast && <ShieldCheck size={22} className="text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};