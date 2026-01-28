
import React, { useState, useMemo } from 'react';
import { ArrowLeft, UserPlus, Swords, Trophy, Zap, MoreVertical } from 'lucide-react';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';

interface PlayerProfileProps {
  user: {
    userId: string;
    name: string;
    level: number;
    isFriend: boolean;
    avatar?: string;
  };
  onBack: () => void;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'players' | 'stats'>('players');

  // MOCK DATA for comparison
  const statsComparison = {
    matches: { player: 1520, opponent: 1240 },
    winRate: { player: 68, opponent: 64 },
    totalWins: { player: 1034, opponent: 794 },
    totalRuns: { player: 45200, opponent: 38100 },
    avgRuns: { player: 29.7, opponent: 30.7 }
  };

  const h2hStats = {
    encounters: 20,
    wins: { local: 12, opponent: 8 },
    runs: { local: 580, opponent: 512 }
  };

  // Collection logic
  const groupedCards = useMemo(() => {
    const rarityRank: Record<string, number> = { Legendary: 0, Epic: 1, Rare: 2, Common: 3 };
    const groups = MOCK_CARDS.slice(0, 12).reduce((acc, card) => {
      const cost = card.cost;
      if (!acc[cost]) acc[cost] = [];
      acc[cost].push(card);
      return acc;
    }, {} as Record<number, any[]>);

    Object.values(groups).forEach(group => {
      group.sort((a, b) => rarityRank[a.rarity] - rarityRank[b.rarity]);
    });
    return groups;
  }, []);

  const sortedCosts = useMemo(() => Object.keys(groupedCards).map(Number).sort((a, b) => a - b), [groupedCards]);

  const ComparisonRow = ({ label, left, right, suffix = "" }: { label: string, left: number, right: number, suffix?: string }) => {
    const leftWin = left > right;
    return (
      <div className="flex items-center justify-between py-4 border-b border-zinc-900/50">
        <div className={`w-1/3 text-left heading-font text-2xl font-black ${leftWin ? 'text-white' : 'text-zinc-600'}`}>
          {left}{suffix}
        </div>
        <div className="flex-1 text-center">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        </div>
        <div className={`w-1/3 text-right heading-font text-2xl font-black ${!leftWin ? 'text-red-600' : 'text-zinc-600'}`}>
          {right}{suffix}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black flex flex-col animate-in fade-in slide-in-from-right duration-400">
      
      {/* HEADER */}
      <div className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 pt-10 pb-3 px-4 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="w-12 h-12 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-900">
            <img src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`} className="w-full h-full object-cover" alt="" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[16px] text-white uppercase truncate tracking-tight leading-none">{user.name}</h2>
              <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-1.5 py-0.5 rounded border border-red-500/20 uppercase">LVL {user.level}</span>
            </div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">Arena Challenger</p>
          </div>

          <button className="p-1.5 text-zinc-600 hover:text-white">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          {user.isFriend ? (
            <>
              <button className="flex-[2] py-3 bg-red-600 text-white rounded-xl heading-font text-xl font-black italic uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Swords size={18} />
                BRAWL
              </button>
              <button className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl heading-font text-sm font-black uppercase tracking-widest active:scale-95 transition-all">
                CHAT
              </button>
            </>
          ) : (
            <button className="w-full py-3 bg-red-600 text-white rounded-xl heading-font text-2xl font-black italic uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
              <UserPlus size={20} />
              ADD FRIEND
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="px-4 py-2 border-b border-zinc-900/50">
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase ${
              activeTab === 'players' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Players
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase ${
              activeTab === 'stats' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'players' ? (
          <div className="p-4 space-y-8 animate-in fade-in duration-300">
            {sortedCosts.map((cost) => (
              <section key={cost} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-900">
                  <Zap size={12} className="text-yellow-500" fill="currentColor" />
                  <h3 className="heading-font text-xl font-black italic text-zinc-500 uppercase tracking-widest">COST {cost}</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                  {groupedCards[cost].map((card: any) => (
                    <Card key={card.id} card={card} className="shadow-lg grayscale-[30%]" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-10 animate-in fade-in duration-300">
            <section className="bg-zinc-900/30 border border-zinc-900 rounded-[2rem] px-6 py-2 shadow-inner">
              <ComparisonRow label="Matches Played" left={statsComparison.matches.player} right={statsComparison.matches.opponent} />
              <ComparisonRow label="Win Rate" left={statsComparison.winRate.player} right={statsComparison.winRate.opponent} suffix="%" />
              <ComparisonRow label="Total Wins" left={statsComparison.totalWins.player} right={statsComparison.totalWins.opponent} />
              <ComparisonRow label="Total Runs" left={statsComparison.totalRuns.player} right={statsComparison.totalRuns.opponent} />
              <ComparisonRow label="Avg. Runs" left={statsComparison.avgRuns.player} right={statsComparison.avgRuns.opponent} />
            </section>
            
            <section className="text-center space-y-4">
              <h3 className="heading-font text-3xl font-black italic text-red-600 uppercase tracking-tighter">HEAD TO HEAD</h3>
              <div className="bg-zinc-900/50 border-2 border-red-600/20 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-left">
                     <span className="heading-font text-4xl font-black text-white italic leading-none">{h2hStats.wins.local}</span>
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">YOUR WINS</p>
                  </div>
                  <Trophy size={24} className="text-red-600 opacity-50" />
                  <div className="text-right">
                     <span className="heading-font text-4xl font-black text-red-600 italic leading-none">{h2hStats.wins.opponent}</span>
                     <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">THEIR WINS</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
