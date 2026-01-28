
import React from 'react';
import { Swords, Star, Zap, Shield, Activity, Target, Coins } from 'lucide-react';
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
  // Generate comparison stats based on match context
  const stats = [
    { label: 'Outs', player: '2', opponent: '4', icon: Target },
    { label: 'Cards Used', player: '5', opponent: '6', icon: Activity },
    { label: 'Avg. Ball Time', player: '2.4s', opponent: '3.1s', icon: Swords },
    { label: 'Cost Spent', player: '22⚡', opponent: '26⚡', icon: Zap },
  ];

  // Map players to their cards for visual highlights
  const mvpCard = MOCK_CARDS.find(c => c.name === 'Mithali Raj');
  const highScorerCard = MOCK_CARDS.find(c => c.name === 'S. Tendulkar');

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white animate-in fade-in duration-500 overflow-hidden relative">
      
      {/* Header Area */}
      <header className="p-6 bg-zinc-900/50 border-b border-zinc-800 text-center z-10">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1">Combat Analysis</p>
        <h1 className="heading-font text-4xl font-black italic tracking-tighter text-white">MATCH PERFORMANCE</h1>
      </header>

      {/* Main Content Area: Padding bottom to accommodate fixed action bar */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-[140px]">
        
        {/* Comparison Header */}
        <div className="flex items-center justify-between px-2">
           <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-zinc-800">
                <img src={PLAYER_AVATAR} className="w-full h-full object-cover" alt="User" />
              </div>
              <span className="heading-font text-lg font-bold uppercase text-white">YOU</span>
           </div>

           <div className="heading-font text-5xl font-black text-zinc-800 italic">VS</div>

           <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-red-600 overflow-hidden bg-zinc-800">
                <img src={match.opponent.avatar} className="w-full h-full object-cover" alt="Opponent" />
              </div>
              <span className="heading-font text-lg font-bold uppercase text-red-600">{match.opponent.name.split('_')[0]}</span>
           </div>
        </div>

        {/* Highlight Section (MVP/Finisher) */}
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col items-center text-center group">
              <div className="relative w-full mb-3">
                 {mvpCard && <Card card={mvpCard} className="w-full" />}
                 <div className="absolute -top-2 -left-2 bg-yellow-500 text-black p-1.5 rounded-full z-20 shadow-lg">
                    <Star size={16} fill="black" />
                 </div>
              </div>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Match MVP</p>
              <div className="mt-2 w-8 h-1 bg-red-600 rounded-full" />
           </div>
           <div className="flex flex-col items-center text-center group">
              <div className="relative w-full mb-3">
                 {highScorerCard && <Card card={highScorerCard} className="w-full" />}
                 <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full z-20 shadow-lg">
                    <Shield size={16} fill="white" />
                 </div>
              </div>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">High Scorer</p>
              <div className="mt-2 w-8 h-1 bg-red-600 rounded-full" />
           </div>
        </div>

        {/* Match Rewards Section */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center">Match Rewards</p>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-5 flex justify-around items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Coins size={14} className="text-yellow-500" />
                <span className="heading-font text-2xl font-black text-white">+{match.region.entryFee * 2}</span>
              </div>
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Coins</span>
            </div>
            
            <div className="w-[1px] h-8 bg-zinc-800/50" />
            
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-emerald-500" />
                <span className="heading-font text-2xl font-black text-white">+120</span>
              </div>
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">XP</span>
            </div>

            <div className="w-[1px] h-8 bg-zinc-800/50" />

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-blue-500" />
                <span className="heading-font text-2xl font-black text-white">+{match.region.energyReward} ⚡</span>
              </div>
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Energy</span>
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="space-y-4">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center">Core Statistics</p>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] overflow-hidden divide-y divide-zinc-800/50">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-5 group hover:bg-zinc-900/60 transition-colors">
                <div className="w-1/4 text-center">
                   <span className="heading-font text-3xl font-black text-white">{stat.player}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center gap-1">
                   <stat.icon size={12} className="text-zinc-700" />
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</span>
                </div>

                <div className="w-1/4 text-center">
                   <span className="heading-font text-3xl font-black text-red-600">{stat.opponent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR: Stable and Decisive */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 p-6 pb-10 z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-lg mx-auto w-full flex gap-4">
          <button 
            onClick={onExit}
            className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all active:scale-95"
          >
            Exit Battle
          </button>
          <button 
            onClick={onBrawlAgain}
            className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:scale-[0.98] active:border-b-0 transition-all group"
          >
            <Swords size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="heading-font text-2xl font-black italic uppercase tracking-wider">Brawl Again</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
