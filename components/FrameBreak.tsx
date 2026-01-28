
import React, { useState, useMemo } from 'react';
import { PlayerCard } from '../types';
import { Card } from './Card';
import { Zap, Coins, Sparkles, ChevronRight } from 'lucide-react';
import { CollectionLevelIcon } from './Collections';

interface FrameBreakProps {
  card: PlayerCard;
  userCoins: number;
  userEnergy: number;
  onUpgrade: (card: PlayerCard, coins: number, energy: number) => void;
  onSkip: () => void;
}

export const FrameBreak: React.FC<FrameBreakProps> = ({ 
  card, 
  userCoins, 
  userEnergy, 
  onUpgrade, 
  onSkip 
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const upgradeCosts = useMemo(() => {
    switch (card.rarity) {
      case 'Common': return { coins: 100, energy: 10, next: 'Rare' };
      case 'Rare': return { coins: 300, energy: 25, next: 'Epic' };
      case 'Epic': return { coins: 800, energy: 50, next: 'Legendary' };
      default: return { coins: 0, energy: 0, next: 'Maxed' };
    }
  }, [card.rarity]);

  const canAfford = userCoins >= upgradeCosts.coins && userEnergy >= upgradeCosts.energy;

  const handleUpgradeClick = () => {
    if (!canAfford || isUpgrading) return;
    setIsUpgrading(true);
    // Mimic frame break animation timing
    setTimeout(() => {
      onUpgrade(card, upgradeCosts.coins, upgradeCosts.energy);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black backdrop-blur-xl flex flex-col items-center animate-in fade-in duration-300 px-6 overflow-hidden">
      
      {/* --- PREMIUM GRADIENT GLOW BACKGROUND --- */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1) translate(-50%, -50%); opacity: 0.3; }
          50% { transform: scale(1.3) translate(-40%, -60%); opacity: 0.6; }
        }
        @keyframes glow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .bg-glow-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }
      `}</style>
      
      <div className="bg-glow-container">
        <div 
          className="glow-orb w-[500px] h-[500px] bg-red-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'glow-pulse 8s infinite ease-in-out' }}
        />
        <div 
          className="glow-orb w-[400px] h-[400px] bg-red-900/30 top-[40%] left-[60%]"
          style={{ animation: 'glow-rotate 15s infinite linear' }}
        />
        <div 
          className="glow-orb w-[300px] h-[300px] bg-zinc-800/40 bottom-[20%] right-[10%]"
          style={{ animation: 'glow-pulse 6s infinite ease-in-out reverse' }}
        />
      </div>

      {/* 1. RESOURCE BAR (NOW AT TOP-MOST POSITION) */}
      <div className="mt-10 flex items-center gap-6 bg-zinc-900/90 border border-white/10 px-6 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-2">
          <Coins size={14} className="text-yellow-500" />
          <span className="heading-font text-lg font-black text-white">{userCoins}</span>
        </div>
        <div className="w-[1px] h-3 bg-zinc-800" />
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-blue-500" />
          <span className="heading-font text-lg font-black text-white">{userEnergy}</span>
        </div>
      </div>

      {/* 2. HEADER + COLLECTION ICON LINK (CONSISTENT) */}
      <header className="mt-4 text-center z-10 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <CollectionLevelIcon size={28} />
          <h2 className="heading-font text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            UPGRADE CARD
          </h2>
        </div>
        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1">BOOST COLLECTION PROGRESS</p>
      </header>

      {/* 3. CARD DISPLAY & RARITY (CENTERED) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8 z-10">
        <div className="relative flex flex-col items-center gap-6 perspective-1000">
          <div className={`relative transition-all duration-700 ${isUpgrading ? 'scale-110 rotate-y-180 brightness-150' : 'hover:scale-105'}`}>
            <Card card={card} className="w-48 shadow-[0_30px_80px_rgba(220,38,38,0.25)]" />
            
            {isUpgrading && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="text-white animate-spin-slow" size={80} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-black/60 border border-zinc-800 rounded-full px-5 py-1.5 shadow-xl backdrop-blur-sm">
             <span className="heading-font text-lg font-black italic text-zinc-500 uppercase">{card.rarity}</span>
             <ChevronRight className="text-zinc-700" size={14} />
             <span className="heading-font text-lg font-black italic text-red-500 uppercase">{upgradeCosts.next}</span>
          </div>
        </div>

        {/* 4. UPGRADE ACTION CONTAINER (UNIFIED BOX) */}
        <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-[2rem] p-5 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex items-center justify-around px-2">
             <div className="flex items-center gap-2">
                <Coins size={12} className="text-yellow-500" />
                <span className={`heading-font text-base font-bold uppercase ${userCoins >= upgradeCosts.coins ? 'text-zinc-200' : 'text-red-600'}`}>
                  {upgradeCosts.coins} REQ.
                </span>
             </div>
             <div className="flex items-center gap-2">
                <Zap size={12} className="text-blue-500" />
                <span className={`heading-font text-base font-bold uppercase ${userEnergy >= upgradeCosts.energy ? 'text-zinc-200' : 'text-red-600'}`}>
                  {upgradeCosts.energy} REQ.
                </span>
             </div>
          </div>

          <button 
            onClick={handleUpgradeClick}
            disabled={!canAfford || isUpgrading}
            className={`w-full h-13 rounded-xl heading-font text-xl font-black italic uppercase tracking-widest transition-all active:scale-[0.97] ${
              canAfford && !isUpgrading
               ? 'bg-red-600 text-white shadow-[0_8px_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800'
               : 'bg-zinc-800 text-zinc-600 border border-zinc-700 opacity-50 cursor-not-allowed'
            }`}
          >
            {isUpgrading ? 'BREAKING...' : 'UPGRADE FRAME'}
          </button>
        </div>

        {/* 5. SECONDARY ACTION (GHOST STYLE) */}
        <button 
          onClick={onSkip}
          disabled={isUpgrading}
          className="heading-font text-lg font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition-all pb-6 active:scale-95"
        >
          SHOW MATCH STATS
        </button>
      </div>
    </div>
  );
};
