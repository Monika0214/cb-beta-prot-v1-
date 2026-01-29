import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Gem, Lock, Check, Zap, Library, Sparkles, BookOpen, AlertCircle, Shield, Target, TrendingUp, Package } from 'lucide-react';
import { PlayerCard, Squad } from '../types';
import { Card } from './Card';

type InternalTab = 'PREVIEW' | 'TACTICAL' | 'LORE' | 'VARIANT' | 'BORDER';

interface CardPreviewProps {
  card: PlayerCard;
  onClose: () => void;
  userGems: number;
  userEnergy?: number; // Energy tracking for Tactical unlock
  userLevel?: number;
  cardUpgrades?: number; // Represented as a bitmask: 1=Tactical, 2=Lore, 4=Border, 8=Variant
  onUpgrade?: (card: PlayerCard, bitValue: number, energyCost?: number) => void;
  // Contextual props
  isStoreContext?: boolean;
  hideUpgrades?: boolean;
  squads?: Squad[];
  activeSquadId?: string;
  onToggleSquad?: (card: PlayerCard) => void;
  context?: 'my_players' | 'my_squads' | 'store' | 'edit_squad';
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
  userEnergy = 0,
  userLevel = 1,
  cardUpgrades = 0,
  onUpgrade,
  isStoreContext = false,
  hideUpgrades = false,
  squads = [],
  activeSquadId,
  onToggleSquad,
  context
}) => {
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [cardAnim, setCardAnim] = useState<boolean>(false);
  const [justUnlockedTactical, setJustUnlockedTactical] = useState(false);
  const [activeInternalTab, setActiveInternalTab] = useState<InternalTab>('PREVIEW');
  const [isConfirmingTactical, setIsConfirmingTactical] = useState(false);
  const [tacticalDot, setTacticalDot] = useState(false);
  
  const gemCost = RARITY_PRICES[card.rarity] || 150;

  const isTacticalUnlocked = (cardUpgrades & 1) !== 0;

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

  const handleUpgradeTap = (bitValue: number, energyCost: number = 0) => {
    if (onUpgrade) {
      onUpgrade(card, bitValue, energyCost);
      // Trigger short card feedback animation
      setCardAnim(true);
      setTimeout(() => setCardAnim(false), 600);
    }
  };

  const getAbilityLabel = (type?: string) => {
    if (type === 'ON REVEAL') return 'ON REVEAL';
    if (type === 'ONGOING') return 'ONGOING';
    return 'ABILITY';
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

  // Guard: Only show tabs for the My Players context
  const showTabs = context === 'my_players';

  // MANDATORY: Full list of 5 separate framed buttons in exact order
  const NAV_TABS: { id: InternalTab; label: string }[] = [
    { id: 'PREVIEW', label: 'Preview' },
    { id: 'TACTICAL', label: 'Tactical' },
    { id: 'LORE', label: 'Lore' },
    { id: 'BORDER', label: 'Border' },
    { id: 'VARIANT', label: 'Variant' },
  ];

  const handleTacticalUnlockConfirm = () => {
    // PHASE 2: Confirmation deductuct energy, updates bitmask
    handleUpgradeTap(1, 20); 
    setIsConfirmingTactical(false);
    // NEW UNLOCK FLOW: Stay on PREVIEW tab, set attention dot and play animation
    setJustUnlockedTactical(true); 
    setTacticalDot(true);
  };

  // One-time effect cleanup
  useEffect(() => {
    if (justUnlockedTactical) {
      const timer = setTimeout(() => setJustUnlockedTactical(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [justUnlockedTactical]);

  // CONSISTENCY FIX: Always hide side stacks on Preview tab as they are now in the horizontal row
  const shouldHideUpgradeStacks = hideUpgrades || activeInternalTab === 'TACTICAL' || activeInternalTab === 'PREVIEW';

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center animate-in fade-in duration-300 overflow-hidden h-screen max-h-screen select-none">
      
      {/* Compact Header */}
      <header className="w-full px-6 h-12 flex items-center justify-between shrink-0 relative z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        
        {(isStoreContext || showTabs) && (
          <div className="flex items-center gap-3">
            {showTabs && (
              <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                <Zap size={12} className="text-blue-500" fill="currentColor" />
                <span className="heading-font text-lg font-black text-white leading-none">
                  {userEnergy}
                </span>
              </div>
            )}
            {isStoreContext && (
              <div className="flex items-center gap-1.5 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                <Gem size={12} className="text-violet-500" fill="currentColor" />
                <span className="heading-font text-lg font-black text-white leading-none">
                  {userGems.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Console Area - Focused Centerpiece */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 relative pt-2 overflow-y-auto no-scrollbar pb-32">
        
        {/* MANDATORY: 5 INDIVIDUAL FRAMED BUTTONS (SINGLE ROW, NO SCROLL) */}
        {showTabs && (
          <div className="w-full max-w-sm mb-6 flex gap-1 shrink-0">
            {NAV_TABS.map((tab) => {
              const isActive = activeInternalTab === tab.id;
              
              // Locked indicator logic specifically for tab headers
              const def = UPGRADE_DEFINITIONS.find(u => 
                (tab.id === 'TACTICAL' && u.id === 'tactical') ||
                (tab.id === 'LORE' && u.id === 'lore') ||
                (tab.id === 'BORDER' && u.id === 'cosmetic') ||
                (tab.id === 'VARIANT' && u.id === 'variant')
              );
              
              // Internal bitmask check for unlock status
              const currentUpgradeBit = def ? (cardUpgrades & def.bit) : 0;
              const isLocked = def ? currentUpgradeBit === 0 : false;
              const isTacticalTab = tab.id === 'TACTICAL';

              return (
                <button
                  key={tab.id}
                  disabled={isLocked && tab.id !== 'PREVIEW'}
                  onClick={() => {
                    // CRITICAL PROGRESSION FIX: Tactical tab cannot be entered if locked
                    if (isTacticalTab && isLocked) return;
                    
                    // Clear attention indicator if entering Tactical
                    if (isTacticalTab) setTacticalDot(false);
                    
                    setActiveInternalTab(tab.id);
                  }}
                  className={`relative flex-1 py-2 rounded-xl border heading-font text-[11px] font-bold tracking-tighter uppercase transition-all flex items-center justify-center min-w-0 ${
                    isActive 
                      ? 'bg-red-600 border-red-500 text-white shadow-lg z-10' 
                      : isLocked && tab.id !== 'PREVIEW'
                        ? 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {/* ATTENTION INDICATOR - ONLY VISIBLE IF UNLOCKED AND HAS UNREAD CONTENT - HIGH VISIBILITY BEACON */}
                  {isTacticalTab && tacticalDot && !isLocked && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full z-20 border border-black/50 animate-expansive-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                  )}
                  
                  {isLocked && tab.id !== 'PREVIEW' && (
                    <Lock size={8} className={`mr-0.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-800'}`} />
                  )}
                  
                  <span className="truncate px-0.5">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main 3-Column Layout - Card stays fixed in position */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full shrink-0">
          
          {/* Left Stack: Tactical & Lore - Hidden on Preview and Tactical Tab */}
          {!shouldHideUpgradeStacks && (
            <div className="flex flex-col gap-4">
              {leftUpgrades.map((u) => (
                <UpgradeTile 
                  key={u.id} 
                  u={u} 
                  shake={shakeTrigger} 
                  onClick={() => {
                    if (u.id === 'tactical') {
                      if (isTacticalUnlocked) {
                        setTacticalDot(false);
                        setActiveInternalTab('TACTICAL');
                      }
                    } else if (u.isAvailable) {
                      handleUpgradeTap(u.bit);
                    }
                  }} 
                />
              ))}
            </div>
          )}

          {/* Central Card - Applied tactical-gain animation wrapper */}
          <div className={`shrink-0 transform scale-[0.85] sm:scale-95 z-10 transition-all duration-300 ${cardAnim ? 'animate-card-pop' : ''} ${justUnlockedTactical ? 'animate-tactical-gain' : ''}`}>
            <Card 
              card={card} 
              minimal={true}
              stage={activeStageCount}
              className={`w-40 border-4 transition-all duration-500 ${cardAnim ? 'border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.6)]' : 'border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)]'}`} 
            />
          </div>

          {/* Right Stack: Border & Variant - Hidden on Preview and Tactical Tab */}
          {!shouldHideUpgradeStacks && (
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

        {/* Dynamic Content Area BELOW card (Swaps based on tab) */}
        <div className="w-full flex flex-col items-center mt-6">
          {activeInternalTab === 'PREVIEW' ? (
            <div className="flex flex-col items-center text-center max-w-[340px] space-y-1.5 shrink-0 animate-in fade-in duration-300">
              <div className="bg-zinc-900/80 px-2 py-0.5 rounded-full border border-white/5">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] leading-none">
                  {getAbilityLabel(card.abilityType)}
                </span>
              </div>
              
              <p className="text-[11px] font-medium text-zinc-400 italic leading-snug px-6">
                “{card.abilityText || "Strategic ability details for match impact."}”
              </p>

              {squadUsage && (
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                  Used in squads: {squadUsage}
                </p>
              )}

              {/* CONSISTENT POSITION FOR UPGRADE CARDS (ALL PREVIEW STATES) */}
              {!isStoreContext && (
                <div className="flex justify-between items-center gap-3 mt-6 w-full px-4">
                  {upgrades.map((u) => (
                    <UpgradeTile 
                      key={u.id} 
                      u={u} 
                      shake={0} 
                      onClick={() => {
                        if (u.id === 'tactical' && isTacticalUnlocked) {
                          setTacticalDot(false);
                          setActiveInternalTab('TACTICAL');
                        }
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          ) : activeInternalTab === 'TACTICAL' && isTacticalUnlocked ? (
            /* TACTICAL TAB CONTENT (UNLOCKED STATE - PROGRESSION LIST UI) */
            <div className="flex flex-col w-full max-w-[320px] shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-400 px-4 gap-2.5 mt-8">
              
              {/* SECTION HEADER */}
              <h5 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-1 ml-1 self-start">
                Tactical Upgrades
              </h5>

              {/* Primary Unlocked Perk Card - Horizontal Layout - Compact Polish */}
              <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3.5 px-5 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <h4 className="heading-font text-xl font-bold text-white uppercase italic tracking-tighter leading-none">
                    Tactical Perk
                  </h4>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">
                    Activate for next brawl
                  </p>
                </div>
                
                <button className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl heading-font text-lg font-black italic uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20 border-b-2 border-red-800 shrink-0">
                  Open
                </button>
              </div>

              {/* Locked Upgrades - Progression List Style - Reduced Polish */}
              {[
                { name: 'Overdrive Strike', level: 15 },
                { name: 'Bastion Guard', level: 25 },
                { name: 'Critical Pulse', level: 40 },
              ].map((locked, i) => (
                <div 
                  key={i} 
                  className="w-full bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-3 flex items-center justify-between opacity-40 pointer-events-none"
                >
                  <div className="flex flex-col min-w-0">
                    <h4 className="heading-font text-lg font-bold text-zinc-600 uppercase italic tracking-tight leading-none">
                      {locked.name}
                    </h4>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest leading-none mt-1">
                      Unlocks at Level {locked.level}
                    </p>
                  </div>
                  
                  <div className="w-8 h-8 rounded-lg bg-zinc-950/30 border border-zinc-800/50 flex items-center justify-center text-zinc-800 shrink-0">
                    <Lock size={12} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center max-w-[240px] space-y-2 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="heading-font text-xl font-bold text-zinc-100 uppercase tracking-widest">
                {NAV_TABS.find(t => t.id === activeInternalTab)?.label}
              </h4>
              <p className="text-[11px] text-zinc-500 italic uppercase tracking-widest leading-relaxed">
                {activeInternalTab === 'TACTICAL' && !isTacticalUnlocked 
                  ? "Gain strategic advantages in match scenarios by unlocking Tactical traits."
                  : `Enhance your player's attributes and appearance with the ${activeInternalTab.toLowerCase()} upgrade system.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Streamlined Footer Actions - Primary CTAs Anchored to Bottom */}
      <footer className="w-full max-w-xs px-6 pb-12 flex flex-col gap-4 shrink-0 mt-auto">
        
        {/* UNIFIED CTA BLOCK FOR ALL PREVIEW STATES (FIXED POSITION) */}
        {!isStoreContext && activeInternalTab === 'PREVIEW' && (
          <div className="flex flex-col items-center justify-center w-full min-h-[72px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            {!isTacticalUnlocked ? (
              /* ENABLED STATE: UNLOCK TACTICAL */
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="flex items-center gap-1">
                  <Zap size={14} className="text-blue-500" fill="currentColor" />
                  <span className="heading-font text-lg font-black text-zinc-400 leading-none">20</span>
                </div>
                
                <button 
                  disabled={userEnergy < 20}
                  onClick={() => setIsConfirmingTactical(true)}
                  className={`w-full py-3 rounded-xl heading-font text-xl font-black italic uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                    userEnergy >= 20
                      ? 'bg-red-600 text-white shadow-red-900/40 border-b-2 border-red-800' 
                      : 'bg-zinc-800 text-zinc-600 border border-zinc-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Unlock Tactical
                </button>
              </div>
            ) : (
              /* DISABLED STATE: POST-UNLOCK PROGRESSION */
              <div className="pt-5 w-full">
                <button 
                  disabled
                  className="w-full py-3 rounded-xl heading-font text-lg font-black italic uppercase tracking-widest bg-zinc-900 text-zinc-600 border border-zinc-800 opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  Unlock Upgrade Lv.10
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECONDARY ACTIONS (SQUAD / STORE) */}
        {activeInternalTab === 'PREVIEW' && !isStoreContext && onToggleSquad && (
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

        {activeInternalTab === 'PREVIEW' && isStoreContext && (
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

      {/* CONFIRMATION POPUP FOR TACTICAL */}
      {isConfirmingTactical && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 border border-red-600/20">
              <Zap size={32} fill="currentColor" />
            </div>
            
            <h3 className="heading-font text-3xl font-black italic text-white uppercase mb-2 tracking-tighter">Tactical Upgrade</h3>
            
            <div className="flex items-center gap-2 mb-6 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <Zap size={16} className="text-blue-500" fill="currentColor" />
              <span className="heading-font text-2xl font-black text-zinc-100 italic">⚡ 20</span>
            </div>

            <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
              Unlock Tactical using 20 Energy?
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleTacticalUnlockConfirm}
                className="w-full py-4 bg-red-600 text-white rounded-xl heading-font text-xl font-black uppercase shadow-lg shadow-red-900/30 active:scale-[0.98] transition-all"
              >
                Unlock
              </button>
              <button 
                onClick={() => setIsConfirmingTactical(false)}
                className="w-full py-3 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Mini Upgrade Tile for refined layout */
interface UpgradeTileProps {
  u: any;
  shake: number;
  onClick: () => void;
  isSmall?: boolean; // Legacy prop, kept for compatibility if needed elsewhere
}

const UpgradeTile: React.FC<UpgradeTileProps> = ({ u, shake, onClick, isSmall = false }) => {
  const Icon = u.icon;

  // Specific overrides for states
  const isLore = u.id === 'lore';
  const isTactical = u.id === 'tactical';
  const isUnlocked = isLore ? false : u.isUnlocked;
  const isAvailable = isLore ? false : u.isAvailable;
  const isLocked = isLore ? true : u.isLocked;

  const [internalShake, setInternalShake] = useState(false);
  useEffect(() => {
    if (shake > 0 && isAvailable) {
      setInternalShake(true);
      const t = setTimeout(() => setInternalShake(false), 300);
      return () => clearTimeout(t);
    }
  }, [shake, isAvailable]);

  // Redefined size and typography for improved readability as requested
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); if (isUnlocked || isAvailable) onClick(); }}
      className={`flex flex-col items-center justify-center border transition-all duration-300 relative w-20 h-20 rounded-[1.4rem] p-2 ${
        internalShake ? 'animate-shake' : ''
      } ${
        isUnlocked 
          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-none' 
          : isAvailable 
            ? `bg-zinc-900 border-zinc-800/80 hover:border-red-600/40 cursor-pointer active:scale-95 shadow-lg` 
            : 'bg-zinc-950/80 border-zinc-900 opacity-80'
      } ${!isUnlocked && !isAvailable ? 'cursor-default opacity-40' : ''}`}
    >
      <div className={`p-1 rounded-lg mb-1 ${isUnlocked ? 'text-emerald-500' : isAvailable ? 'text-red-500' : 'text-zinc-500'}`}>
        <Icon size={14} />
      </div>
      
      <span className={`font-black uppercase tracking-tighter text-center leading-none text-[8px] ${isUnlocked ? 'text-emerald-600' : isAvailable ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {u.name}
      </span>

      <div className="mt-1 flex flex-col items-center gap-0.5">
        {isUnlocked ? (
          <Check size={10} className="text-emerald-500" />
        ) : isTactical ? (
          <div className="flex items-center gap-0.5 text-blue-400 mt-1">
             <Zap size={10} fill="currentColor" />
             <span className="heading-font font-black leading-none text-sm">20</span>
          </div>
        ) : isAvailable ? (
          <div className="bg-red-600/90 text-white px-2 py-0.5 rounded-md font-black tracking-widest uppercase text-[7px]">
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