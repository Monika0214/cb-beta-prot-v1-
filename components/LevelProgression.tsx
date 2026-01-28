import React, { useState, useMemo } from 'react';
import { Lock, CheckCircle2, Star, Zap, Gem, Package, Library, MapPin, Trophy } from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  icon: React.ElementType;
  type: string;
}

interface LevelRow {
  level: number;
  free: RewardItem;
  premium: RewardItem;
}

interface LevelProgressionProps {
  onClose: () => void;
  level: number;
  xp: number;
}

// Rewards ordered 1 to 10 for Top to Bottom rendering
const COLLECTION_LEVEL_DATA: LevelRow[] = [
  { level: 1, free: { id: 'cl_f1', name: 'Starter Box', icon: Package, type: 'ITEM' }, premium: { id: 'cl_p1', name: 'Premium Tag', icon: Library, type: 'COSMETIC' } },
  { level: 2, free: { id: 'cl_f2', name: '100 Energy', icon: Zap, type: 'RESOURCE' }, premium: { id: 'cl_p2', name: '500 Coins', icon: Zap, type: 'CURRENCY' } },
  { level: 3, free: { id: 'cl_f3', name: 'Card Slot', icon: Library, type: 'SLOT' }, premium: { id: 'cl_p3', name: 'Golden Bat', icon: Library, type: 'ART' } },
  { level: 4, free: { id: 'cl_f4', name: 'Rare Pack', icon: Package, type: 'ITEM' }, premium: { id: 'cl_p4', name: '250 Gems', icon: Gem, type: 'PREMIUM' } },
  { level: 5, free: { id: 'cl_f5', name: 'Dubai Arena', icon: MapPin, type: 'UNLOCK' }, premium: { id: 'cl_p5', name: 'Elite Emblem', icon: Trophy, type: 'STATUS' } },
  { level: 6, free: { id: 'cl_f6', name: '50 Gems', icon: Gem, type: 'CURRENCY' }, premium: { id: 'cl_p6', name: 'Epic Box', icon: Package, type: 'ITEM' } },
  { level: 7, free: { id: 'cl_f7', name: '200 Energy', icon: Zap, type: 'RESOURCE' }, premium: { id: 'cl_p7', name: 'Silver Glow', icon: Library, type: 'COSMETIC' } },
  { level: 8, free: { id: 'cl_f8', name: 'Epic Pack', icon: Package, type: 'ITEM' }, premium: { id: 'cl_p8', name: '1000 Coins', icon: Zap, type: 'CURRENCY' } },
  { level: 9, free: { id: 'cl_f9', name: 'Pro Frame', icon: Library, type: 'COSMETIC' }, premium: { id: 'cl_p9', name: 'Legendary Art', icon: Star, type: 'ART' } },
  { level: 10, free: { id: 'cl_f10', name: 'Grand Pack', icon: Package, type: 'ITEM' }, premium: { id: 'cl_p10', name: 'Global Pass', icon: MapPin, type: 'UNLOCK' } },
];

export const LevelProgression: React.FC<LevelProgressionProps> = ({ level, xp }) => {
  // Premium is disabled for purchase in this view as requested
  const [isPremiumActive] = useState(false);
  const [claimedFree, setClaimedFree] = useState<string[]>(['cl_f1']);
  const [claimedPremium, setClaimedPremium] = useState<string[]>([]);

  const nextLevel = level + 1;
  const maxLevelXp = 2000;
  const remainingXp = Math.max(0, maxLevelXp - xp);
  const progressPercent = (xp / maxLevelXp) * 100;

  const handleClaim = (reward: RewardItem, track: 'free' | 'premium', reqLevel: number) => {
    if (level < reqLevel) return;
    if (track === 'premium' && !isPremiumActive) return;

    if (track === 'free') {
      if (claimedFree.includes(reward.id)) return;
      setClaimedFree(prev => [...prev, reward.id]);
    } else {
      if (claimedPremium.includes(reward.id)) return;
      setClaimedPremium(prev => [...prev, reward.id]);
    }
  };

  const renderRewardTile = (reward: RewardItem, reqLevel: number, track: 'free' | 'premium') => {
    const isUnlocked = level >= reqLevel;
    const isClaimed = track === 'free' ? claimedFree.includes(reward.id) : claimedPremium.includes(reward.id);
    const isPremiumLocked = track === 'premium' && !isPremiumActive;

    const state = !isUnlocked 
      ? 'LOCKED' 
      : isClaimed 
        ? 'CLAIMED' 
        : (track === 'premium' && isPremiumLocked) ? 'PREMIUM_LOCKED' : 'READY';

    return (
      <div 
        onClick={() => handleClaim(reward, track, reqLevel)}
        className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 w-full max-w-[140px] cursor-pointer active:scale-95 ${
          state === 'LOCKED' 
            ? 'bg-zinc-900/20 border-zinc-800/50 opacity-40 grayscale' 
            : state === 'CLAIMED'
              ? 'bg-zinc-900/40 border-emerald-500/20 opacity-60'
              : state === 'PREMIUM_LOCKED'
                ? 'bg-zinc-900/60 border-amber-500/10'
                : 'bg-zinc-800 border-white/10 shadow-lg'
        }`}
      >
        <div className={`p-2 rounded-xl shrink-0 ${
          state === 'LOCKED' ? 'bg-zinc-950 text-zinc-800' : 
          track === 'premium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          <reward.icon size={16} />
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="heading-font text-[11px] font-black italic text-zinc-100 truncate leading-none uppercase">
            {reward.name}
          </span>
          <span className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter mt-1">
            {reward.type}
          </span>
        </div>

        <div className="absolute top-1.5 right-1.5">
          {state === 'LOCKED' && <Lock size={8} className="text-zinc-700" />}
          {state === 'CLAIMED' && <CheckCircle2 size={12} className="text-emerald-500" />}
          {state === 'READY' && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          )}
          {state === 'PREMIUM_LOCKED' && <Lock size={8} className="text-amber-500/50" />}
        </div>
        
        {state === 'READY' && (
          <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-2xl animate-pulse pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-300 overflow-hidden">
      
      {/* --- XP PROGRESS SECTION (COMPONENT SUB-HEADER) --- */}
      <div className="shrink-0 bg-black/95 backdrop-blur-2xl border-b border-zinc-900">
        <div className="px-6 pb-6 pt-6 flex flex-col items-center">
          <div className="w-full max-w-sm flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-amber-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                <span className="heading-font text-5xl font-black italic text-white leading-none tracking-tighter">{level}</span>
                <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mt-0.5">LEVEL</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white italic heading-font leading-none">{xp} / {maxLevelXp} XP</p>
                  <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mt-1">STATUS: MASTER</p>
                </div>
                <p className="heading-font text-xl font-black text-amber-500 tracking-tight leading-none uppercase">
                  {remainingXp} XP to Level {nextLevel}
                </p>
              </div>
              
              <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-[1200ms]" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-20">
        <div className="flex justify-between items-center px-10 mb-8">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">FREE PASS</span>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">PREMIUM PASS</span>
        </div>

        <section className="px-4 relative">
          <div className="relative flex flex-col gap-10">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-zinc-900 z-0" />
            
            {COLLECTION_LEVEL_DATA.map((row) => {
              const isUnlocked = level >= row.level;
              return (
                <div key={row.level} className="relative flex items-center justify-between min-h-[70px]">
                  <div className="flex-1 flex justify-end pr-8 z-10">
                    {renderRewardTile(row.free, row.level, 'free')}
                  </div>

                  <div className={`relative z-20 w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500 shrink-0 ${
                    isUnlocked 
                      ? 'bg-amber-500 border-zinc-950 text-zinc-950 scale-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-800 scale-90'
                  }`}>
                    <span className="heading-font text-lg font-black italic leading-none">{row.level}</span>
                  </div>

                  <div className="flex-1 flex justify-start pl-8 z-10">
                    {renderRewardTile(row.premium, row.level, 'premium')}
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