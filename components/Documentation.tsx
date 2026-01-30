
import React from 'react';
import { ArrowLeft, Swords, Coins, Zap, Gem, Trophy, Layers, Target, TrendingUp, Users, Shield, Book, ChevronRight, Activity } from 'lucide-react';

interface DocumentationProps {
  onBack: () => void;
}

export const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-500 select-text overflow-y-auto no-scrollbar pb-32">
      {/* 1. Header */}
      <header className="sticky top-0 z-[100] bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-6 py-6 flex items-center pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4">
          <h1 className="heading-font text-3xl font-black italic text-white uppercase tracking-tighter leading-none">DESIGNER CONSOLE</h1>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mt-1">PRODUCT ARCHITECTURE v1.0.1</p>
        </div>
      </header>

      <div className="p-6 space-y-12">
        
        {/* SECTION: PRODUCT VISION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
            <Target size={18} className="text-red-500" />
            <h2 className="heading-font text-2xl font-bold text-white uppercase italic tracking-widest">PRODUCT VISION</h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Cricket Brawl is a <span className="text-white font-bold">Fast-Paced Strategic Card Battler</span> built for the mobile generation. It merges the calculated tension of cricket with the addictive depth of squad building. The goal is to maximize "Momentum" through short, high-stakes sessions (Matches last ~2 minutes).
          </p>
        </section>

        {/* SECTION: CORE LOOP FLOWCHART */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
            <Activity size={18} className="text-blue-500" />
            <h2 className="heading-font text-2xl font-bold text-white uppercase italic tracking-widest">CORE LOOP (THE FLYWHEEL)</h2>
          </div>
          
          {/* FLOWCHART VISUALIZATION */}
          <div className="flex flex-col gap-4 relative">
             {/* Step 1: Entry */}
             <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 shrink-0">
                 <Swords size={20} />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-wider">1. THE BRAWL</h4>
                 <p className="text-[10px] text-zinc-500">Spend Coins + Energy to enter an Arena Match.</p>
               </div>
             </div>

             <div className="flex justify-center"><ChevronRight size={16} className="text-zinc-800 rotate-90" /></div>

             {/* Step 2: Mastery */}
             <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-yellow-600/20 border border-yellow-600/40 flex items-center justify-center text-yellow-500 shrink-0">
                 <Target size={20} />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-wider">2. OUTPLAY</h4>
                 <p className="text-[10px] text-zinc-500">Deploy cards across 3 stadiums. Win the majority to Victory.</p>
               </div>
             </div>

             <div className="flex justify-center"><ChevronRight size={16} className="text-zinc-800 rotate-90" /></div>

             {/* Step 3: Gain */}
             <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center text-emerald-500 shrink-0">
                 <TrendingUp size={20} />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-wider">3. REWARD CASCADES</h4>
                 <p className="text-[10px] text-zinc-500">Earn Coins, Energy, and occasional Gems. Gain Account XP.</p>
               </div>
             </div>

             <div className="flex justify-center"><ChevronRight size={16} className="text-zinc-800 rotate-90" /></div>

             {/* Step 4: Evolution */}
             <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-600/40 flex items-center justify-center text-purple-500 shrink-0">
                 <Layers size={20} />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-wider">4. EVOLVE SQUAD</h4>
                 <p className="text-[10px] text-zinc-500">Spend Energy on Tactical Unlocks. Re-invest Coins in Store.</p>
               </div>
             </div>

             {/* Back-link Loop arrow */}
             <div className="absolute -left-4 top-[10%] bottom-[10%] w-6 border-y-2 border-l-2 border-zinc-800 rounded-l-[3rem] pointer-events-none opacity-20" />
          </div>
        </section>

        {/* SECTION: ECONOMY TRIANGLE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
            <Coins size={18} className="text-amber-500" />
            <h2 className="heading-font text-2xl font-bold text-white uppercase italic tracking-widest">ECONOMY ARCHITECTURE</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Coins size={14} className="text-yellow-500" />
                  <span className="text-xs font-black text-white uppercase">Utility Coin (Soft)</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  The primary friction point. Used for entry fees and card purchases. High velocity, low retention.
                </p>
             </div>

             <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-blue-500" />
                  <span className="text-xs font-black text-white uppercase">Energy (Progression)</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Earned via match play. Used exclusively for "Tactical" and "Lore" unlocks in Card Preview. Represents player "Experience" with a specific card.
                </p>
             </div>

             <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Gem size={14} className="text-red-500" />
                  <span className="text-xs font-black text-white uppercase">Gems (Premium)</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  The hard currency. Acquired via IAP or rare match drops. Used for Packs, Frames, and instant card unlocks in Store.
                </p>
             </div>
          </div>
        </section>

        {/* SECTION: CARD STRATEGY MATRIX */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
            <Layers size={18} className="text-purple-500" />
            <h2 className="heading-font text-2xl font-bold text-white uppercase italic tracking-widest">CARD STRATEGY MATRIX</h2>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
             <table className="w-full text-left text-[10px] uppercase font-black tracking-widest">
               <thead>
                 <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500">
                   <th className="p-4">Rarity</th>
                   <th className="p-4">Avg Cost</th>
                   <th className="p-4">Avg Runs</th>
                   <th className="p-4">Scaling</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50">
                 <tr>
                   <td className="p-4 text-zinc-400">Common</td>
                   <td className="p-4 text-white">1-2</td>
                   <td className="p-4 text-white">40-60</td>
                   <td className="p-4 text-zinc-500">Low</td>
                 </tr>
                 <tr>
                   <td className="p-4 text-blue-500">Rare</td>
                   <td className="p-4 text-white">3-4</td>
                   <td className="p-4 text-white">65-75</td>
                   <td className="p-4 text-zinc-500">Med</td>
                 </tr>
                 <tr>
                   <td className="p-4 text-purple-500">Epic</td>
                   <td className="p-4 text-white">4-6</td>
                   <td className="p-4 text-white">80-88</td>
                   <td className="p-4 text-zinc-500">High</td>
                 </tr>
                 <tr>
                   <td className="p-4 text-yellow-500">Legendary</td>
                   <td className="p-4 text-white">7-8</td>
                   <td className="p-4 text-white">90-98</td>
                   <td className="p-4 text-zinc-500">Elite</td>
                 </tr>
               </tbody>
             </table>
          </div>
          <p className="text-[10px] text-zinc-600 italic px-2">
            *Runs increase by +5 for every 'Evolutionary Stage' unlocked in Card Preview.
          </p>
        </section>

        {/* SECTION: UI PRINCIPLES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
            <Shield size={18} className="text-zinc-500" />
            <h2 className="heading-font text-2xl font-bold text-white uppercase italic tracking-widest">DESIGN PRINCIPLES</h2>
          </div>
          
          <div className="space-y-4">
             <div className="flex gap-4">
                <div className="w-1 h-12 bg-red-600 rounded-full shrink-0" />
                <div>
                   <h5 className="text-xs font-black text-white uppercase">The Red Line</h5>
                   <p className="text-[10px] text-zinc-500">All primary interactions (Brawl, Unlock, Save) use #DC2626. Red is the color of action and urgency.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-1 h-12 bg-zinc-700 rounded-full shrink-0" />
                <div>
                   <h5 className="text-xs font-black text-white uppercase">Depth via Contrast</h5>
                   <p className="text-[10px] text-zinc-500">Backgrounds are Pure Black (#000000) or high-density Zinc. This allows the cards and reward particle effects to pop without distraction.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-1 h-12 bg-amber-500 rounded-full shrink-0" />
                <div>
                   <h5 className="text-xs font-black text-white uppercase">Anticipation Loops</h5>
                   <p className="text-[10px] text-zinc-500">The 3-second delay on Reward Collection CTAs is intentional. It allows the animated numbers to "tick up" creating a dopamine hit for the earned resources.</p>
                </div>
             </div>
          </div>
        </section>

      </div>

      {/* 3. Footer Branding */}
      <footer className="mt-auto px-6 py-12 flex flex-col items-center gap-4 opacity-30 border-t border-zinc-900">
         <Book size={32} className="text-zinc-800" />
         <div className="text-center">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">INTERNAL USE ONLY</p>
            <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest mt-1">NEXUS STUDIOS CRICKET BRAWL DEPT.</p>
         </div>
      </footer>
    </div>
  );
};
