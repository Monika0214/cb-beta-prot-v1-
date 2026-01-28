
import React, { useMemo } from 'react';
import { ArrowLeft, Gem, Lock, Check, Zap, Library, Sparkles, BookOpen } from 'lucide-react';
import { PlayerCard, Squad } from '../types';
import { Card } from './Card';

interface CardPreviewProps {
  card: PlayerCard;
  onClose: () => void;
  userGems: number;
  userLevel?: number;
  cardUpgrades?: number; // Number of upgrades already purchased for this card
  onUpgrade?: (card: PlayerCard) => void;
  // Contextual props
  isStoreContext?: boolean;
  squads?: Squad[];
  activeSquadId?: string;
  onToggleSquad?: (card: PlayerCard) => void;
}

const UPGRADE_DEFINITIONS = [
  { id: 'tactical', name: 'Tactical', levelReq: 1, icon: Zap },
  { id: 'lore', name: 'Lore', levelReq: 10, icon: BookOpen },
  { id: 'cosmetic', name: 'Cosmetic Border', levelReq: 20, icon: Library },
  { id: 'variant', name: 'Variant Art', levelReq: 35, icon: Sparkles },
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
  squads = [],
  activeSquadId,
  onToggleSquad
}) => {
  const gemCost = RARITY_PRICES[card.rarity] || 150;

  const getAbilityLabel = (type?: string) => {
    if (type === 'ON REVEAL') return 'ON REVEAL';
    if (type === 'ONGOING') return 'ONGOING';
    return 'NORMAL';
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSquad) {
      onToggleSquad(card);
    }
  };

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpgrade) onUpgrade(card);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center animate-in fade-in duration-300 overflow-hidden h-screen max-h-screen select-none">
      
      {/* Static Header */}
      <header className="w-full px-6 h-16 flex items-center justify-between shrink-0 relative z-10 border-b border-white/5">
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        
        {isStoreContext && (
          <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-1.5 rounded-xl border border-white/5">
            <Gem size={14} className="text-violet-500" fill="currentColor" />
            <span className="heading-font text-xl font-black text-white leading-none">
              {userGems.toLocaleString()}
            </span>
          </div>
        )}
      </header>

      {/* Main Container - Flex-1 with centered items, NO scrolling */}
      <div className="flex-1 w-full flex flex-col items-center justify-between py-6 px-6 gap-4 overflow-hidden">
        
        {/* Top: Minimal Card Art Preview */}
        <div className="shrink-0 transform scale-90 sm:scale-100">
          <Card 
            card={card} 
            minimal={true}
            className="w-48 shadow-[0_30px_80px_rgba(0,0,0,0.8)] border-4 border-white/5" 
          />
        </div>

        {/* Mid: Compact Ability Section */}
        <div className="flex flex-col items-center text-center max-w-sm space-y-2 shrink-0">
          <div className="bg-zinc-900/50 px-3 py-1 rounded-full border border-white/5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] leading-none">
              {getAbilityLabel(card.abilityType)}
            </span>
          </div>
          
          <p className="text-sm font-medium text-zinc-400 italic leading-relaxed px-4">
            “{card.abilityText || "Strategic ability details for match impact."}”
          </p>
        </div>

        {/* Bottom: 2x2 Upgrade Console (Collection Context) */}
        {!isStoreContext ? (
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-5 shrink-0 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              {UPGRADE_DEFINITIONS.map((upgrade, index) => {
                const isUnlocked = cardUpgrades > index;
                const isAvailable = !isUnlocked && userLevel >= upgrade.levelReq;
                const isLocked = !isUnlocked && !isAvailable;
                const Icon = upgrade.icon;

                return (
                  <div 
                    key={upgrade.id}
                    className={`flex flex-col p-4 rounded-3xl border transition-all duration-300 ${
                      isUnlocked 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : isAvailable 
                          ? 'bg-zinc-900 border-zinc-800' 
                          : 'bg-zinc-900/20 border-zinc-900 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${isUnlocked ? 'text-emerald-500' : isAvailable ? 'text-red-500' : 'text-zinc-700'}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate">
                        {upgrade.name}
                      </span>
                    </div>

                    <div className="mt-auto">
                      {isUnlocked ? (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <Check size={14} />
                          <span className="heading-font text-lg font-black uppercase">Unlocked</span>
                        </div>
                      ) : isAvailable ? (
                        <button 
                          onClick={handleUpgrade}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl heading-font text-xl font-black italic uppercase tracking-wider transition-all active:scale-95 shadow-lg border-b-2 border-red-800"
                        >
                          UNLOCK
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-700">
                          <Lock size={12} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">LV. {upgrade.levelReq} REQ.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Store Footer */
          <div className="w-full max-w-sm shrink-0">
             <div className="flex flex-col items-center gap-4 py-8">
               <div className="flex items-center gap-2">
                 <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Unlock Cost</span>
                 <Gem size={14} className="text-violet-500" fill="currentColor" />
                 <span className="heading-font text-3xl font-black text-zinc-100">{gemCost}</span>
               </div>
               <button 
                 className="w-full py-4 bg-red-600 text-white rounded-2xl heading-font text-2xl font-black italic uppercase tracking-widest shadow-xl active:scale-95 transition-all border-b-4 border-red-800"
               >
                 UNLOCK PLAYER
               </button>
             </div>
          </div>
        )}

        {/* Contextual Action Button (Add to Squad) */}
        {!isStoreContext && onToggleSquad && (
           <div className="w-full max-w-sm shrink-0 pb-4">
              <button 
                onClick={handleAction}
                className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl heading-font text-xl font-black italic uppercase tracking-widest hover:text-white transition-all active:scale-95"
              >
                {activeSquadId && squads.find(s => s.id === activeSquadId)?.cards.some(c => c.id === card.id) 
                  ? 'REMOVE FROM SQUAD' 
                  : 'ASSIGN TO SQUAD'
                }
              </button>
           </div>
        )}
      </div>

      {/* Modal Close Back-layer */}
      <div className="absolute inset-0 z-0" onClick={onClose} />
    </div>
  );
};
