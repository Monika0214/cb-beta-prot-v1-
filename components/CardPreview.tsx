
import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Gem, ChevronRight, Zap, Target, Sparkles, TrendingUp, ShieldInfo, Users, Info } from 'lucide-react';
import { PlayerCard, Squad } from '../types';
import { Card } from './Card';

interface CardPreviewProps {
  card: PlayerCard;
  squads: Squad[];
  activeSquadId: string;
  onUpdateSquad: (squad: Squad) => void;
  onClose: () => void;
  userCoins: number;
  userEnergy: number;
  currentStage: number; // 0 to 4
  onUpgrade: (cardId: string, coins: number, energy: number) => void;
  hideSquadActions?: boolean;
}

interface StageDetail {
  id: number;
  title: string;
  description: string;
  gemCost: number;
  unlockLevel: number;
  statPreview: string;
}

const STAGES: StageDetail[] = [
  { id: 1, title: 'Tactical Edge', description: 'Increases base run potency for high-stakes balls.', gemCost: 250, unlockLevel: 1, statPreview: '+5 Runs' },
  { id: 2, title: 'Ability Surge', description: 'Enhances ability trigger efficiency and consistency.', gemCost: 500, unlockLevel: 5, statPreview: 'Ability+' },
  { id: 3, title: 'Visual Prestige', description: 'Unlocks the Radiant Aura and Emerald Frame.', gemCost: 1000, unlockLevel: 10, statPreview: 'Visuals' },
  { id: 4, title: 'Legendary Form', description: 'The ultimate evolution. Exclusive art and stats.', gemCost: 2500, unlockLevel: 20, statPreview: 'Max Stats' },
];

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  card, 
  squads, 
  activeSquadId, 
  onUpdateSquad, 
  onClose,
  userCoins, 
  currentStage, 
  onUpgrade,
  hideSquadActions = false
}) => {
  const SQUAD_SIZE = 12;
  const [selectedStageIdx, setSelectedStageIdx] = useState(Math.min(currentStage, 3));
  const [animatingUpgrade, setAnimatingUpgrade] = useState(false);

  const targetSquad = useMemo(() => squads.find(s => s.id === activeSquadId) || squads[0], [squads, activeSquadId]);
  const isInTargetSquad = useMemo(() => targetSquad?.cards.some(c => c.id === card.id) || false, [targetSquad, card.id]);
  const isFull = (targetSquad?.cards.length || 0) >= SQUAD_SIZE;

  const usedInSquads = useMemo(() => {
    return squads.filter(s => s.cards.some(c => c.id === card.id)).map(s => s.name);
  }, [squads, card.id]);

  const handleUpgradeClick = () => {
    const nextToUpgrade = STAGES[currentStage];
    if (!nextToUpgrade || userCoins < nextToUpgrade.gemCost || animatingUpgrade) return;
    
    setAnimatingUpgrade(true);
    setTimeout(() => {
      onUpgrade(card.id, nextToUpgrade.gemCost, 0);
      setAnimatingUpgrade(false);
      if (currentStage < 3) {
        setSelectedStageIdx(currentStage + 1);
      }
    }, 900);
  };

  const selectedStage = STAGES[selectedStageIdx];
  const isSelectedStageCompleted = currentStage > selectedStageIdx;
  const isSelectedStageCurrent = currentStage === selectedStageIdx;
  const isSelectedStageLocked = currentStage < selectedStageIdx;

  const currentRuns = card.runs + (currentStage * 5);
  const nextRuns = currentRuns + 5;

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-950 flex flex-col items-center justify-center animate-in fade-in duration-300 overflow-hidden h-screen max-h-screen">
      <div className={`absolute inset-0 transition-all duration-1000 ${animatingUpgrade ? 'bg-red-600/20' : 'bg-black opacity-80'}`} />
      
      <div className="w-full max-w-lg h-full flex flex-col relative overflow-hidden z-10">
        
        {/* HEADER */}
        <header className="px-6 h-[64px] flex items-center justify-between shrink-0 bg-transparent">
          <button onClick={onClose} className="p-3 -ml-3 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 shadow-xl">
            <Gem size={14} className="text-violet-400" />
            <span className="heading-font text-xl font-black text-white">{userCoins}</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto no-scrollbar gap-6 pb-10">
          
          {/* 1. HERO PREVIEW */}
          <div className="relative py-4 flex flex-col items-center w-full">
            <div className={`transition-all duration-700 ${animatingUpgrade ? 'scale-110 brightness-150 rotate-y-180' : 'scale-100'}`}>
              <Card 
                card={card} 
                stage={currentStage} 
                className="w-44 shadow-[0_40px_100px_rgba(0,0,0,0.8)]" 
              />
            </div>
            
            {/* ABILITY TRIGGER LABEL */}
            <div className="mt-8 flex flex-col items-center gap-2">
               <div className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-widest bg-red-600/10 px-2 py-0.5 rounded italic">
                    {card.abilityType || 'PASSIVE'}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-300 tracking-tight uppercase">
                    {card.name.split(' ')[0]}'s Impact
                  </span>
               </div>
               <p className="text-[10px] text-zinc-500 font-medium text-center px-8 leading-tight">
                 {card.abilityText || "Increases team morale and momentum during critical over phases."}
               </p>
            </div>

            {/* SQUAD USAGE */}
            <div className="mt-6 flex items-center gap-3 bg-zinc-900/40 px-5 py-2.5 rounded-2xl border border-white/5">
               <Users size={14} className="text-zinc-600" />
               <div className="flex flex-col">
                  <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Active Squads</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                    {usedInSquads.length > 0 ? usedInSquads.join(', ') : 'NOT USED IN ANY SQUAD'}
                  </p>
               </div>
            </div>
          </div>

          {/* 2. PROGRESSION TRACK (HORIZONTAL TABS) */}
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between gap-3 bg-zinc-900/50 p-2 rounded-3xl border border-zinc-800">
               {STAGES.map((stg, idx) => {
                 const isCompleted = currentStage > idx;
                 const isCurrent = currentStage === idx;
                 const isSelected = selectedStageIdx === idx;
                 const isLocked = currentStage < idx;

                 return (
                   <button 
                     key={stg.id}
                     onClick={() => setSelectedStageIdx(idx)}
                     className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all relative border ${
                       isSelected 
                         ? 'bg-zinc-800 border-red-600 shadow-lg scale-105' 
                         : 'bg-transparent border-transparent'
                     }`}
                   >
                     <div className={`mb-1 transition-colors ${
                       isCompleted ? 'text-emerald-500' : isCurrent ? 'text-red-600 animate-pulse' : 'text-zinc-700'
                     }`}>
                        {isCompleted ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                     </div>
                     <span className={`heading-font text-sm font-black italic transition-colors ${
                       isSelected ? 'text-white' : 'text-zinc-600'
                     }`}>STG {stg.id}</span>
                   </button>
                 );
               })}
            </div>

            {/* 3. STAGE DETAIL PANEL */}
            <div className="w-full bg-zinc-900/80 border border-zinc-800 p-6 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="heading-font text-2xl font-black text-white italic leading-none uppercase tracking-tight">
                      {selectedStage.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">
                      {isSelectedStageCompleted ? 'MILESTONE ACHIEVED' : isSelectedStageLocked ? `REQUIRES PLAYER LVL ${selectedStage.unlockLevel}` : 'ACTIVE EVOLUTION'}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded mb-1.5">PREVIEW</p>
                     <p className="heading-font text-xl font-black text-white italic">{selectedStage.statPreview}</p>
                  </div>
               </div>
               
               <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                 {selectedStage.description}
               </p>

               {isSelectedStageCurrent && (
                 <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Current Potency</span>
                          <span className="heading-font text-2xl font-black text-zinc-400 italic leading-none">{currentRuns}</span>
                       </div>
                       <ChevronRight size={16} className="text-zinc-800 mt-2" />
                       <div className="flex flex-col">
                          <span className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">Upgraded Potency</span>
                          <span className="heading-font text-2xl font-black text-red-600 italic leading-none">{nextRuns}</span>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>

        </div>

        {/* 4. PRIMARY CTA FOOTER */}
        <footer className="p-6 bg-black border-t border-zinc-900 shrink-0 space-y-4">
           {isSelectedStageCurrent ? (
             <button 
               onClick={handleUpgradeClick}
               disabled={userCoins < selectedStage.gemCost || animatingUpgrade}
               className={`w-full py-5 rounded-2xl heading-font text-3xl font-black italic uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                 userCoins >= selectedStage.gemCost && !animatingUpgrade
                   ? 'bg-red-600 text-white shadow-[0_15px_40px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:scale-[0.98]'
                   : 'bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed opacity-50'
               }`}
             >
                {animatingUpgrade ? (
                   <div className="flex items-center justify-center gap-3">
                      <Sparkles className="animate-spin" size={24} />
                      EVOLVING...
                   </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>UNLOCK UPGRADE</span>
                    <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-xl">
                       <Gem size={14} className="text-violet-400" />
                       <span className="text-xl">{selectedStage.gemCost}</span>
                    </div>
                  </div>
                )}
             </button>
           ) : isSelectedStageLocked ? (
             <div className="w-full py-5 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-800 flex items-center justify-center gap-3 heading-font text-2xl font-black italic uppercase">
                <Lock size={20} />
                LOCKED UNTIL PREVIOUS COMPLETION
             </div>
           ) : (
             <div className="w-full py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-3 heading-font text-2xl font-black italic uppercase">
                <CheckCircle2 size={20} />
                UPGRADE ALREADY UNLOCKED
             </div>
           )}

           {!hideSquadActions && !animatingUpgrade && (
             <button 
                onClick={() => { 
                  onUpdateSquad({ 
                    ...targetSquad, 
                    cards: isInTargetSquad ? targetSquad.cards.filter(c => c.id !== card.id) : [...targetSquad.cards, card], 
                    power: targetSquad.power + (isInTargetSquad ? -50 : 50) 
                  }); 
                  onClose(); 
                }} 
                disabled={!isInTargetSquad && isFull} 
                className={`w-full py-3.5 rounded-xl heading-font text-xl font-black italic uppercase tracking-widest transition-all ${
                  isInTargetSquad 
                    ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' 
                    : isFull 
                      ? 'bg-zinc-900 text-zinc-800 border border-zinc-800 cursor-not-allowed opacity-40' 
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
             >
               {isInTargetSquad ? 'REMOVE FROM SQUAD' : isFull ? 'SQUAD FULL' : 'ADD TO SQUAD'}
             </button>
           )}
        </footer>
      </div>
    </div>
  );
};
