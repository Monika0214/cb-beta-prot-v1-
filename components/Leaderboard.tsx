import React, { useState } from 'react';
import { Trophy, Medal, Zap } from 'lucide-react';

type TabType = 'played' | 'won';

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('played');

  // Top 10 Mock Data - No XP/Levels
  const MOCK_LEADERS = [
    { rank: 1, name: 'SkyWalker_99', value: activeTab === 'played' ? 1420 : 850, avatar: 'https://i.pravatar.cc/150?u=1' },
    { rank: 2, name: 'CricketKing', value: activeTab === 'played' ? 1380 : 810, avatar: 'https://i.pravatar.cc/150?u=2' },
    { rank: 3, name: 'BatMaster', value: activeTab === 'played' ? 1250 : 795, avatar: 'https://i.pravatar.cc/150?u=3' },
    { rank: 4, name: 'ShadowWiz', value: activeTab === 'played' ? 980 : 540, avatar: 'https://i.pravatar.cc/150?u=4' },
    { rank: 5, name: 'DhoniFan07', value: activeTab === 'played' ? 950 : 520, avatar: 'https://i.pravatar.cc/150?u=5' },
    { rank: 6, name: 'StormBringer', value: activeTab === 'played' ? 890 : 480, avatar: 'https://i.pravatar.cc/150?u=6' },
    { rank: 7, name: 'RunMachine', value: activeTab === 'played' ? 840 : 450, avatar: 'https://i.pravatar.cc/150?u=7' },
    { rank: 8, name: 'BrawlChampion', value: activeTab === 'played' ? 810 : 410, avatar: 'https://i.pravatar.cc/150?u=8' },
    { rank: 9, name: 'SpinDoc', value: activeTab === 'played' ? 780 : 390, avatar: 'https://i.pravatar.cc/150?u=9' },
    { rank: 10, name: 'FastFurious', value: activeTab === 'played' ? 750 : 370, avatar: 'https://i.pravatar.cc/150?u=10' },
  ];

  const localPlayer = { 
    rank: 154, 
    name: 'PlayerOne', 
    value: activeTab === 'played' ? 428 : 128, 
    avatar: 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=100&h=100' 
  };

  const getRankStyles = (rank: number) => {
    switch(rank) {
      case 1: return { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
      case 2: return { border: 'border-zinc-400/50', bg: 'bg-zinc-400/10', text: 'text-zinc-400' };
      case 3: return { border: 'border-amber-700/50', bg: 'bg-amber-700/10', text: 'text-amber-700' };
      default: return { border: 'border-zinc-800', bg: 'bg-zinc-900/40', text: 'text-zinc-600' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-500">
      {/* 1. TABS (STATIC TOP) */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('played')}
            className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase flex items-center justify-center gap-2 ${
              activeTab === 'played' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Zap size={16} fill={activeTab === 'played' ? 'white' : 'currentColor'} />
            MOST PLAYED
          </button>
          <button 
            onClick={() => setActiveTab('won')}
            className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase flex items-center justify-center gap-2 ${
              activeTab === 'won' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Trophy size={16} fill={activeTab === 'won' ? 'white' : 'currentColor'} />
            MOST WON
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE LEADERBOARD LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-3 pb-6">
        {MOCK_LEADERS.map((player) => {
          const styles = getRankStyles(player.rank);
          return (
            <div 
              key={player.rank}
              className={`p-4 rounded-[1.5rem] border flex items-center justify-between transition-all group ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 text-center">
                   {player.rank <= 3 ? (
                     <div className="flex flex-col items-center">
                       <Medal size={24} className={styles.text} />
                       <span className={`heading-font text-xs font-black ${styles.text}`}>{player.rank}</span>
                     </div>
                   ) : (
                     <span className="heading-font text-2xl font-black text-zinc-700">{player.rank}</span>
                   )}
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-900 group-hover:scale-105 transition-transform">
                  <img src={player.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="heading-font text-xl font-black italic text-white leading-none uppercase tracking-tight truncate max-w-[120px]">
                    {player.name}
                  </h4>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Global Player</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="heading-font text-2xl font-black text-white leading-none">{player.value}</p>
                 <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                   {activeTab === 'played' ? 'Matches' : 'Wins'}
                 </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. STICKY LOCAL PLAYER TILE (FIXED ABOVE NAV) */}
      {/* 
        POSITION ADJUSTMENT: 
        1. Increased pb from 104px to 118px to move the tile slightly upward.
        2. Removed the "Your Position" label group.
      */}
      <div className="shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent px-4 pb-[118px] pt-6 border-t border-zinc-900/50">
        <div className="p-4 rounded-[1.5rem] border-2 border-red-600 bg-red-600/10 backdrop-blur-md flex items-center justify-between shadow-[0_-10px_30px_rgba(220,38,38,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 text-center">
               <span className="heading-font text-2xl font-black text-red-600 italic">#{localPlayer.rank}</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-red-600 p-0.5 overflow-hidden bg-zinc-900 shadow-lg">
              <img src={localPlayer.avatar} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="heading-font text-xl font-black italic text-white leading-none uppercase tracking-tight">{localPlayer.name}</h4>
                <span className="bg-red-600 text-[8px] font-black px-2 py-0.5 rounded text-white tracking-widest">YOU</span>
              </div>
              <p className="text-[9px] font-black text-red-500/60 uppercase tracking-widest mt-1">Arena Challenger</p>
            </div>
          </div>
          <div className="text-right relative z-10">
             <p className="heading-font text-2xl font-black text-white leading-none">{localPlayer.value}</p>
             <p className="text-[8px] font-black text-red-600/60 uppercase tracking-widest mt-1">
               {activeTab === 'played' ? 'Matches' : 'Wins'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};