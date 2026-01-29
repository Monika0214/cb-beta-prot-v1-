
import React from 'react';
import { Swords, Star, Zap, Shield, Activity, Target, LayoutGrid, X, Share2 } from 'lucide-react';
import { MatchState } from '../types';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';

interface MatchStatsProps {
  match: MatchState;
  onBrawlAgain: () => void;
  onExit: () => void;
  onBack: () => void;
}

const PLAYER_AVATAR = 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=100&h=100';

export const MatchStats: React.FC<MatchStatsProps> = ({ match, onBrawlAgain, onExit, onBack }) => {
  // Stats required by prompt
  const stats = [
    { label: 'Cards Played', player: '6', opponent: '5', icon: Activity },
    { label: 'Outs', player: '2', opponent: '1', icon: Target },
    { label: 'Avg. Ball Time', player: '2.8s', opponent: '3.4s', icon: Activity },
    { label: 'Cost Spent', player: '18⚡', opponent: '22⚡', icon: Zap },
  ];

  const mvpCard = MOCK_CARDS.find(c => c.name === 'Mithali Raj');
  const highScorerCard = MOCK_CARDS.find(c => c.name === 'S. Tendulkar');

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white animate-in fade-in duration-500 overflow-hidden relative">
      
      {/* Top Header Navigation */}
      <div className="fixed top-0 left-0 right-0 h-[52px] bg-black border-b border-zinc-800/50 flex items-center justify-between px-4 z-[70]">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-all active:scale-90">
          <X size={20} />
        </button>
        <h1 className="heading-font text-2xl font-bold text-zinc-100 uppercase tracking-wider">
          MATCH STATS
        </h1>
        <button className="p-2 -mr-2 text-zinc-400 hover:text-white transition-all active:scale-90">
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-[140px] pt-20">
        
        {/* Player Headers */}
        <div className="flex items-center justify-between px-2">
           <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-zinc-800 p-0.5">
                <img src={PLAYER_AVATAR} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
              <span className="heading-font text-xl font-black uppercase text-white tracking-tight">YOU</span>
           </div>

           <div className="heading-font text-5xl font-black text-zinc-800 italic">VS</div>

           <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-red-600 overflow-hidden bg-zinc-800 p-0.5">
                <img src={match.opponent.avatar} className="w-full h-full rounded-full object-cover" alt="Opponent" />
              </div>
              <span className="heading-font text-xl font-black uppercase text-red-600 tracking-tight">{match.opponent.name.split('_')[0]}</span>
           </div>
        </div>

        {/* High Impact Cards (MVP / High Scorer) */}
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col items-center text-center">
              <div className="relative w-full mb-3">
                 {mvpCard && <Card card={mvpCard} className="w-full scale-90" minimal />}
                 <div className="absolute top-2 left-2 bg-yellow-500 text-black p-1.5 rounded-full z-20 shadow-lg border-2 border-zinc-950">
                    <Star size={14} fill="black" />
                 </div>
              </div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Match MVP</p>
           </div>
           <div className="flex flex-col items-center text-center">
              <div className="relative w-full mb-3">
                 {highScorerCard && <Card card={highScorerCard} className="w-full scale-90" minimal />}
                 <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full z-20 shadow-lg border-2 border-zinc-950">
                    <Shield size={14} fill="white" />
                 </div>
              </div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">High Scorer</p>
           </div>
        </div>

        {/* COMPARISON TABLE: [ Player A ] STAT NAME [ Player B ] */}
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] overflow-hidden divide-y divide-zinc-800/50 shadow-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-6">
                <div className="w-20 text-center">
                   <span className="heading-font text-3xl font-black text-white italic">{stat.player}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center gap-1">
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</span>
                </div>

                <div className="w-20 text-center">
                   <span className="heading-font text-3xl font-black text-red-600 italic">{stat.opponent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS - NEW REFINED ROW LAYOUT */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-zinc-950 border-t border-zinc-900 px-6 pt-4 pb-10 z-50 flex flex-row gap-4 items-center justify-between">
        <button 
          onClick={onBrawlAgain}
          className="flex-1 h-11 bg-black border border-zinc-800 rounded-xl font-black uppercase text-[10px] tracking-[0.15em] text-zinc-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Swords size={14} />
          BRAWL AGAIN
        </button>
        <button 
          onClick={onExit}
          className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center"
        >
          <span className="heading-font text-xl font-black italic uppercase tracking-wider">MAIN MENU</span>
        </button>
      </footer>
    </div>
  );
};
