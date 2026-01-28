
import React from 'react';
import { Swords, Star, Zap, Shield, Activity, Target, LayoutGrid } from 'lucide-react';
import { MatchState } from '../types';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';

interface MatchStatsProps {
  match: MatchState;
  onBrawlAgain: () => void;
  onExit: () => void;
}

const PLAYER_AVATAR = 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=100&h=100';

export const MatchStats: React.FC<MatchStatsProps> = ({ match, onBrawlAgain, onExit }) => {
  // Enhanced Comparison Stats
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
      
      <header className="p-6 bg-zinc-900/50 border-b border-zinc-800 text-center z-10">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1">Arena Comparison</p>
        <h1 className="heading-font text-4xl font-black italic tracking-tighter text-white">MATCH STATISTICS</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-[140px]">
        
        {/* Identifiers */}
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

        {/* HIGHLIGHTS */}
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

        {/* COMPARISON TABLE */}
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] overflow-hidden divide-y divide-zinc-800/50 shadow-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-6">
                <div className="w-20 text-center">
                   <span className="heading-font text-3xl font-black text-white italic">{stat.player}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center gap-1">
                   <stat.icon size={14} className="text-zinc-600" />
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

      {/* FOOTER ACTIONS */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 p-6 pb-12 z-50">
        <div className="max-w-lg mx-auto w-full flex gap-4">
          <button 
            onClick={onExit}
            className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <LayoutGrid size={16} />
            MAIN MENU
          </button>
          <button 
            onClick={onBrawlAgain}
            className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:scale-[0.98] transition-all"
          >
            <Swords size={20} />
            <span className="heading-font text-2xl font-black italic uppercase tracking-wider">BRAWL AGAIN</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
