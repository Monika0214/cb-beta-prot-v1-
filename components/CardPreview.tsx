
import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Gem, Lock, Check, Zap, Library, Sparkles, BookOpen } from 'lucide-react';
import { PlayerCard, Squad } from '../types';
import { Card } from './Card';

interface CardPreviewProps {
  card: PlayerCard;
  onClose: () => void;
  userGems: number;
  userLevel?: number;
  cardUpgrades?: number; // Represented as a bitmask: 1=Tactical, 2=Lore, 4=Border, 8=Variant
  onUpgrade?: (card: PlayerCard, bitValue: number) => void;
  // Contextual props
  isStoreContext?: boolean;
  hideUpgrades?: boolean;
  squads?: Squad[];
  activeSquadId?: string;
  onToggleSquad?: (card: PlayerCard) => void;
}

const UPGRADE_DEFINITIONS = [
  { id: 'tactical', name: 'Tactical', levelReq: 1, icon: Zap, side: 'left', bit: 1 },
  { id: 'lore', name: 'Lore', levelReq: 10, icon: BookOpen, side: 'left', bit: 2 },
  { id: 'cosmetic', name: 'Border', levelReq: 20, icon: Library, side: 'right', bit: 4 },
  { id: 'variant', name: 'Variant', levelReq: 35, icon: Sparkles, side: 'right', bit: 8 },
];

const RARITY_PRICES: Record<string, number> = {
  Legendary: 3500,
  Epic: 1250,
  Rare: 450,
  Common: 150
};

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  card, 
  onClose,
  userGems,
  userLevel = 1,
  cardUpgrades = 0,
  onUpgrade,
  isStoreContext = false,
  hideUpgrades = false,
  squads = [],
  activeSquadId,
  onToggleSquad
}) => {
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [helperText, setHelperText] = useState<string | null>(null);
  const [cardAnim, setCardAnim] = useState<boolean>(false);
  
  const gemCost = RARITY_PRICES[card.rarity] || 150;

  const upgrades = useMemo(() => {
    return UPGRADE_DEFINITIONS.map((u) => {
      const isUnlocked = (cardUpgrades & u.bit) !== 0;
      const isAvailable = !isUnlocked && userLevel >= u.levelReq;
      const isLocked = !isUnlocked && !isAvailable;
      return { ...u, isUnlocked, isAvailable, isLocked };
    });
  }, [cardUpgrades, userLevel]);

  const leftUpgrades = upgrades.filter(u => u.side === 'left');
  const rightUpgrades = upgrades.filter(u => u.side === 'right');

  const handleUpgradeTap = (bitValue: number) => {
    if (onUpgrade) {
      onUpgrade(card, bitValue);
      // Trigger card feedback animation
      setCardAnim(true);
      setTimeout(() => setCardAnim(false), 600);
    }
  };

  const getAbilityLabel = (type?: string) => {
    if (type === 'ON REVEAL') return 'ON REVEAL';
    if (type === 'ONGOING') return 'ONGOING';
    return 'NORMAL';
  };

  const squadUsage = useMemo(() => {
    return squads
      .filter(s => s.cards.some(c => c.id === card.id))
      .map((s, i) => (i + 1).toString())
      .join(', ');
  }, [squads, card.id]);

  const activeStageCount = useMemo(() => {
    return [1, 2, 4, 8].filter(bit => cardUpgrades & bit).length;
  }, [cardUpgrades]);

  const isInSquad = useMemo(() => {
    return activeSquadId && squads.find(s => s.id === activeSquadId)?.cards.some(c => c.id === card.id);
  }, [activeSquadId, squads, card.id]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center animate-in fade-in duration-300 overflow-hidden h-screen max-h-screen select-none">
      
      {/* Compact Header */}
      <header className="w-full px-6 h-12 flex items-center justify-between shrink-0 relative z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        
        {isStoreContext && (
          <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
            <Gem size={12} className="text-violet-500" fill="currentColor" />
            <span className="heading-font text-lg font-black text-white leading-none">
              {userGems.toLocaleString()}
            </span>
          </div>
        )}
      </header>

      {/* Hero Console Area - Focused Centerpiece */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-4 relative">
        
        {/* Main 3-Column Layout */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
          
          {/* Left Stack: Tactical & Lore */}
          {!hideUpgrades && (
            <div className="flex flex-col gap-4">
              {leftUpgrades.map((u) => (
                <UpgradeTile 
                  key={u.id} 
                  u={u} 
                  shake={shakeTrigger} 
                  onClick={() => handleUpgradeTap(u.bit)} 
                />
              ))}
            </div>
          )}

          {/* Central Card */}
          <div className={`shrink-0 transform scale-[0.85] sm:scale-95 z-10 transition-all duration-300 ${cardAnim ? 'animate-card-pop' : ''}`}>
            <Card 
              card={card} 
              minimal={true}
              stage={activeStageCount}
              className={`w-40 border-4 transition-all duration-500 ${cardAnim ? 'border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.6)]' : 'border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)]'}`} 
            />
          </div>

          {/* Right Stack: Border & Variant */}
          {!hideUpgrades && (
            <div className="flex flex-col gap-4">
              {rightUpgrades.map((u) => (
                <UpgradeTile 
                  key={u.id} 
                  u={u} 
                  shake={shakeTrigger} 
                  onClick={() => handleUpgradeTap(u.bit)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Ability Section - Compact and Attached */}
        <div className="flex flex-col items-center text-center max-w-[240px] mt-4 space-y-1.5 shrink-0">
          <div className="bg-zinc-900/80 px-2 py-0.5 rounded-full border border-white/5">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] leading-none">
              {getAbilityLabel(card.abilityType)}
            </span>
          </div>
          
          <p className="text-[11px] font-medium text-zinc-400 italic leading-snug px-2">
            “{card.abilityText || "Strategic ability details for match impact."}”
          </p>

          {squadUsage && (
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
              Used in squads: {squadUsage}
            </p>
          )}
        </div>
      </div>

      {/* Streamlined Footer Actions */}
      <footer className="w-full max-w-xs px-6 pb-10 flex flex-col gap-2 shrink-0">
        {!isStoreContext && onToggleSquad && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSquad(card); }}
            className={`w-full py-3 rounded-xl heading-font text-[13px] font-black italic uppercase tracking-widest transition-all active:scale-95 ${
              isInSquad 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 border border-red-400/20' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'
            }`}
          >
            {isInSquad ? 'REMOVE FROM SQUAD' : 'ASSIGN TO SQUAD'}
          </button>
        )}

        {isStoreContext && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">Unlock Cost</span>
              <Gem size={12} className="text-violet-500" fill="currentColor" />
              <span className="heading-font text-2xl font-black text-white leading-none">{gemCost}</span>
            </div>
            <button className="w-full py-3.5 bg-red-600 text-white rounded-xl heading-font text-xl font-black italic uppercase tracking-widest shadow-xl active:scale-95 border-b-4 border-red-800">
              UNLOCK PLAYER
            </button>
          </div>
        )}
      </footer>

      {/* Modal Close Back-layer */}
      <div className="absolute inset-0 z-0" onClick={onClose} />
    </div>
  );
};

/* Mini Upgrade Tile for refined layout */
const UpgradeTile = ({ u, shake, onClick }: { u: any, shake: number, onClick: () => void }) => {
  const Icon = u.icon;
  const isUnlocked = u.isUnlocked;
  const isAvailable = u.isAvailable;
  const isLocked = u.isLocked;

  // Use local internal shake to trigger animation when parent shake counter changes
  const [internalShake, setInternalShake] = useState(false);
  useEffect(() => {
    if (shake > 0 && isAvailable) {
      setInternalShake(true);
      const t = setTimeout(() => setInternalShake(false), 300);
      return () => clearTimeout(t);
    }
  }, [shake, isAvailable]);

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); if (isAvailable) onClick(); }}
      className={`flex flex-col items-center justify-center p-2 w-20 h-20 rounded-[1.4rem] border transition-all duration-300 relative ${
        internalShake ? 'animate-shake' : ''
      } ${
        isUnlocked 
          ? 'bg-emerald-500/5 border-emerald-500/20' 
          : isAvailable 
            ? 'bg-zinc-900 border-red-600/40 animate-pulse-red hover:border-red-500 cursor-pointer active:scale-95' 
            : 'bg-zinc-950/80 border-zinc-900 opacity-80'
      }`}
    >
      <div className={`p-1 rounded-lg mb-1 ${isUnlocked ? 'text-emerald-500' : isAvailable ? 'text-red-500' : 'text-zinc-500'}`}>
        <Icon size={14} />
      </div>
      
      <span className={`text-[7px] font-black uppercase tracking-tighter text-center leading-none ${isUnlocked ? 'text-emerald-600' : isAvailable ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {u.name}
      </span>

      <div className="mt-1 flex flex-col items-center gap-0.5">
        {isUnlocked ? (
          <Check size={10} className="text-emerald-500" />
        ) : isAvailable ? (
          <div className="bg-red-600/90 text-white px-2 py-0.5 rounded-md text-[7px] font-black tracking-widest uppercase">
            UNLOCK
          </div>
        ) : (
          <div className="flex items-center gap-0.5 text-zinc-500">
            <Lock size={7} />
            <span className="text-[6px] font-black uppercase">LV {u.levelReq}</span>
          </div>
        )}
      </div>
    </div>
  );
};
