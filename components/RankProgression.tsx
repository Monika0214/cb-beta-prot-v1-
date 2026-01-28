import React, { useState, useMemo } from 'react';
import { ArrowLeft, Lock, CheckCircle2, Trophy, Gem, Zap, Star, Package, Library, MapPin, Medal, Shield } from 'lucide-react';
import { Modal } from './Modal';

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

interface RankProgressionProps {
  onClose: () => void;
  rank: number;
  xp: number;
}

const LEVEL_REWARDS: LevelRow[] = [
  { level: 1, free: { id: 'f1', name: 'Starter Pack', icon: Package, type: 'ITEM' }, premium: { id: 'p1', name: 'Gold Border', icon: Library, type: 'COSMETIC' } },
  { level: 2, free: { id: 'f2', name: '500 Coins', icon: Zap, type: 'CURRENCY' }, premium: { id: 'p2', name: 'Rare Variant', icon: Library, type: 'ART' } },
  { level: 3, free: { id: 'f3', name: 'London Arena', icon: MapPin, type: 'UNLOCK' }, premium: { id: 'p3', name: 'Silver Frame', icon: Library, type: 'COSMETIC' } },
  { level: 4, free: { id: 'f4', name: 'Rank Badge', icon: Shield, type: 'STATUS' }, premium: { id: 'p4', name: '100 Gems', icon: Gem, type: 'PREMIUM' } },
  { level: 5, free: { id: 'f5', name: 'Account XP', icon: Star, type: 'BONUS' }, premium: { id: 'p5', name: 'Epic Box', icon: Package, type: 'BUNDLE' } },
  { level: 6, free: { id: 'f6', name: '200 Gems', icon: Gem, type: 'CURRENCY' }, premium: { id: 'p6', name: 'Elite Avatar', icon: Medal, type: 'AVATAR' } },
  { level: 7, free: { id: 'f7', name: 'Prestige Icon', icon: Trophy, type: 'STATUS' }, premium: { id: 'p7', name: 'Epic Pack', icon: Package, type: 'BUNDLE' } },
  { level: 8, free: { id: 'f8', name: 'Limited Box', icon: Package, type: 'ITEM' }, premium: { id: 'p8', name: 'Mythic Banner', icon: Library, type: 'COSMETIC' } },
  { level: 9, free: { id: 'f9', name: 'Coin Boost', icon: Zap, type: 'ECONOMY' }, premium: { id: 'p9', name: 'Legendary Finisher', icon: Star, type: 'ART' } },
  { level: 10, free: { id: 'f10', name: 'Master Pack', icon: Package, type: 'ITEM' }, premium: { id: 'p10', name: 'World Series Pass', icon: MapPin, type: 'UNLOCK' } },
];

export const RankProgression: React.FC<RankProgressionProps> = ({ onClose, rank, xp }) => {
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [claimedFree, setClaimedFree] = useState<string[]>(['f1']); // Mock: Level 1 already claimed
  const [claimedPremium, setClaimedPremium] = useState<string[]>([]);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const nextLevel = rank + 1;
  const levelInterval = 2000;
  const remainingXp = Math.max(0, levelInterval - xp);
  const progressPercent = (xp / levelInterval) * 100;

  const handleClaim = (rewardId: string, track: 'free' | 'premium', level: number) => {
    if (rank < level) return;
    if (track === 'premium' && !isPremiumActive) {
      setIsPurchaseModalOpen(true);
      return;
    }

    if (track === 'free') {
      if (claimedFree.includes(rewardId)) return;
      setClaimedFree([...claimedFree, rewardId]);
    } else {
      if (claimedPremium.includes(rewardId)) return;
      setClaimedPremium([...claimedPremium, rewardId]);
    }
  };

  const renderRewardCard = (reward: RewardItem, level: number, track: 'free' | 'premium') => {
    const isUnlocked = rank >= level;
    const isClaimed = track === 'free' ? claimedFree.includes(reward.id) : claimedPremium.includes(reward.id);
    const isPremiumLocked = track === 'premium' && !isPremiumActive;
    
    // Reward States
    const state = !isUnlocked 
      ? 'LOCKED' 
      : isClaimed 
        ? 'CLAIMED' 
        : (track === 'premium' && isPremiumLocked) ? 'PREMIUM_REQUIRED' : 'READY';

    return (
      <div 
        onClick={() => handleClaim(reward.id, track, level)}
        className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 w-full max-w-[140px] cursor-pointer active:scale-95 ${
          state === 'LOCKED' 
            ? 'bg-zinc-900/20 border-zinc-800/50 opacity-40 grayscale' 
            : state === 'CLAIMED'
              ? 'bg-zinc-900/40 border-emerald-500/20 opacity-60'
              : state === 'PREMIUM_REQUIRED'
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
          <span className="heading-font text-[12px] font-black italic text-zinc-100 truncate leading-none uppercase">
            {reward.name}
          </span>
          <span className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter mt-1">
            {reward.type}
          </span>
        </div>

        {/* State Indicators */}
        <div className="absolute top-1.5 right-1.5">
          {state === 'LOCKED' && <Lock size={8} className="text-zinc-700" />}
          {state === 'CLAIMED' && <CheckCircle2 size={12} className="text-emerald-500" />}
          {state === 'READY' && (
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}
          {state === 'PREMIUM_REQUIRED' && <Lock size={8} className="text-amber-500/50" />}
        </div>
        
        {state === 'READY' && (
          <div className="absolute inset-0 border-2 border-red-500/30 rounded-2xl animate-pulse pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-300 overflow-hidden">
      {/* 1. STICKY TOP SECTION: XP PROGRESS */}
      <header className="sticky top-0 z-[100] bg-black/95 backdrop-blur-2xl border-b border-zinc-900 shrink-0">
        <div className="px-6 py-4 flex items-center">
          <button onClick={onClose} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <h2 className="heading-font text-3xl font-black italic text-zinc-100 tracking-tighter ml-4 uppercase">PROGRESS</h2>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col items-center">
          <div className="w-full max-w-sm flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-amber-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.05)]">
                <span className="heading-font text-4xl font-black italic text-white leading-none tracking-tighter">{rank}</span>
                <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mt-0.5">LVL</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white italic heading-font leading-none">{xp} / {levelInterval} XP</p>
                  <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mt-1">RANK: AMATEUR</p>
                </div>
                <p className="heading-font text-xl font-black text-amber-500 tracking-tight leading-none uppercase">
                  {remainingXp} XP to Level {nextLevel}
                </p>
              </div>
              
              <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-[1200ms]" 
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE CONTENT: DUAL-TRACK PASS */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-6">
        <div className="flex justify-between items-center px-8 mb-8">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">FREE TRACK</span>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">PREMIUM TRACK</span>
        </div>

        <section className="px-4 pb-32 relative">
          <div className="relative flex flex-col gap-10">
            {/* Center spine rail */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-zinc-900 z-0" />
            
            {/* Level rows: Level 1 at TOP */}
            {LEVEL_REWARDS.map((m) => {
              const isUnlocked = rank >= m.level;
              return (
                <div key={m.level} className="relative flex items-center justify-between min-h-[70px]">
                  {/* Free Slot */}
                  <div className="flex-1 flex justify-end pr-8 z-10">
                    {renderRewardCard(m.free, m.level, 'free')}
                  </div>

                  {/* Node */}
                  <div className={`relative z-20 w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500 shrink-0 ${
                    isUnlocked 
                      ? 'bg-amber-500 border-zinc-950 text-zinc-950 scale-100' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-800 scale-90'
                  }`}>
                    <span className="heading-font text-lg font-black italic leading-none">{m.level}</span>
                  </div>

                  {/* Premium Slot */}
                  <div className="flex-1 flex justify-start pl-8 z-10">
                    {renderRewardCard(m.premium, m.level, 'premium')}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. STICKY FOOTER: PREMIUM PASS UPSELL (IF NOT PURCHASED) */}
      {!isPremiumActive && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-[110]">
          <button 
            onClick={() => setIsPurchaseModalOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-4 rounded-2xl heading-font text-2xl font-black italic uppercase tracking-widest shadow-[0_15px_40px_rgba(251,191,36,0.2)] active:scale-[0.98] transition-all border-b-4 border-amber-700"
          >
            UNLOCK PREMIUM PASS • ₹799
          </button>
        </div>
      )}

      {/* Purchase Modal */}
      <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title="PREMIUM PASS">
        <div className="flex flex-col items-center text-center gap-6 py-4">
           <div className="w-24 h-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center border border-amber-500/20 shadow-2xl shadow-amber-900/20">
              <Trophy size={48} className="text-amber-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
           </div>
           
           <div className="space-y-2 px-6">
              <h3 className="heading-font text-4xl font-black italic text-white uppercase tracking-tighter">ELITE SEASON PASS</h3>
              <p className="text-zinc-400 text-[12px] font-medium leading-relaxed px-2">Access premium rewards at every level. Unlock exclusive stadium variants, rare cards, and massive gem drops.</p>
           </div>

           <div className="w-full space-y-4 px-2 pt-4">
              <button 
                onClick={() => { setIsPremiumActive(true); setIsPurchaseModalOpen(false); }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-5 rounded-2xl heading-font text-3xl font-black italic uppercase tracking-[0.05em] shadow-[0_15px_40px_rgba(251,191,36,0.2)] active:scale-[0.98] transition-all border-b-4 border-amber-700"
              >
                 ACTIVATE PASS • ₹799
              </button>
           </div>
        </div>
      </Modal>
    </div>
  );
};