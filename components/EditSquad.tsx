
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Trash2, Shield, Plus, Check, Zap, Trophy, Swords, Target, Activity, Flame, X, Edit2, AlertCircle } from 'lucide-react';
import { MOCK_CARDS } from '../constants';
import { PlayerCard, Squad } from '../types';
import { Card } from './Card';
import { CardPreview } from './CardPreview';

interface EditSquadProps {
  squadId: string | null;
  squads: Squad[];
  onUpdateSquad: (squad: Squad) => void;
  onBack: () => void;
  // Adding missing props for CardPreview integration
  userCoins: number;
  userEnergy: number;
  userGems: number;
  userLevel?: number;
  cardUpgrades: Record<string, number>;
  onUpgrade: (cardId: string, coins: number, energy: number) => void;
}

const EMBLEM_OPTIONS = [
  { id: 'shield', icon: Shield },
  { id: 'trophy', icon: Trophy },
  { id: 'swords', icon: Swords },
  { id: 'target', icon: Target },
  { id: 'activity', icon: Activity },
  { id: 'flame', icon: Flame },
];

const COLOR_OPTIONS = [
  { id: 'red', class: 'text-red-600', bg: 'bg-red-600', shadow: 'shadow-red-900/50' },
  { id: 'blue', class: 'text-blue-500', bg: 'bg-blue-500', shadow: 'shadow-blue-900/50' },
  { id: 'purple', class: 'text-purple-500', bg: 'bg-purple-500', shadow: 'shadow-purple-900/50' },
  { id: 'yellow', class: 'text-yellow-500', bg: 'bg-yellow-500', shadow: 'shadow-yellow-900/50' },
  { id: 'emerald', class: 'text-emerald-500', bg: 'bg-emerald-500', shadow: 'shadow-emerald-900/50' },
];

export const EditSquad: React.FC<EditSquadProps> = ({ 
  squadId, 
  squads, 
  onUpdateSquad, 
  onBack,
  userCoins,
  userEnergy,
  userGems,
  userLevel = 1,
  cardUpgrades,
  onUpgrade
}) => {
  const SQUAD_SIZE = 12;
  const [previewCard, setPreviewCard] = useState<PlayerCard | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const squadIndex = useMemo(() => squads.findIndex(s => s.id === squadId), [squadId, squads]);
  const squadNumber = squadIndex + 1;

  const squad = useMemo(() => {
    return squads[squadIndex] || squads[0];
  }, [squadIndex, squads]);

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  
  const activeColor = useMemo(() => COLOR_OPTIONS.find(c => c.id === squad.color) || COLOR_OPTIONS[0], [squad.color]);
  const activeEmblem = useMemo(() => EMBLEM_OPTIONS.find(e => e.id === squad.emblemId) || EMBLEM_OPTIONS[0], [squad.emblemId]);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const toggleCard = (card: PlayerCard) => {
    const isAdded = squad.cards.some(c => c.id === card.id);
    if (isAdded) {
      onUpdateSquad({
        ...squad,
        cards: squad.cards.filter(c => c.id !== card.id),
        power: squad.power - Math.floor(card.runs * 0.8)
      });
    } else {
      if (squad.cards.length >= SQUAD_SIZE) {
        triggerFeedback("SQUAD FULL! (MAX 12)");
        return;
      }
      onUpdateSquad({
        ...squad,
        cards: [...squad.cards, card],
        power: squad.power + Math.floor(card.runs * 0.8)
      });
    }
  };

  const updateIdentity = (updates: Partial<Squad>) => {
    onUpdateSquad({ ...squad, ...updates });
  };

  const emptySlotsCount = SQUAD_SIZE - squad.cards.length;

  return (
    <div className="flex flex-col h-full bg-black animate-in slide-in-from-right duration-300 relative">
      {/* Squad Full Feedback Toast */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-in slide-in-from-top duration-300 border border-red-400">
           <AlertCircle size={18} />
           <span className="heading-font text-xl font-black italic tracking-widest uppercase">{feedback}</span>
        </div>
      )}

      <header className="sticky top-0 z-[70] bg-black/95 backdrop-blur-2xl border-b border-zinc-900 px-4 py-4 flex items-center shadow-2xl">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90 flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        
        <button 
          onClick={() => setIsIdentityModalOpen(true)}
          className="flex-1 flex items-center ml-4 group transition-all min-w-0"
        >
          <div className={`flex-shrink-0 flex items-center justify-center ${activeColor.class}`}>
             {(() => {
               const HeaderIcon = activeEmblem.icon;
               return <HeaderIcon size={22} />;
             })()}
          </div>
          <div className="flex flex-col ml-3 min-w-0">
            <h2 className="heading-font text-2xl font-black italic text-white uppercase tracking-tighter truncate leading-none">
              {squad.name}
            </h2>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">SQUAD {squadNumber}</span>
          </div>
          <div className="flex-shrink-0 ml-4 w-10 h-10 flex items-center justify-center">
             <Edit2 size={14} className="text-zinc-600 group-hover:text-red-600 transition-colors" />
          </div>
        </button>

        <button className="flex-shrink-0 p-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-600 hover:text-red-600 transition-colors ml-2">
          <Trash2 size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* SECTION 1: SQUAD SLOTS */}
        <section className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="heading-font text-xl font-black text-zinc-500 uppercase tracking-widest italic">Squad Lineup</h3>
            <div className="flex items-center gap-2">
               <Zap size={12} className="text-zinc-500" />
               <span className="text-[10px] font-black text-white uppercase">{squad.cards.length} / {SQUAD_SIZE} PLAYERS</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {squad.cards.map((card) => (
              <div 
                key={card.id} 
                className="relative group animate-in zoom-in duration-200 cursor-pointer"
                onClick={() => setPreviewCard(card)}
              >
                <Card card={card} className="shadow-lg" />
                {/* Visual overlay for squad cards - tapping body opens preview, tapping X removes */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleCard(card);
                     }}
                     className="p-2 bg-red-600 text-white rounded-full shadow-lg border border-red-400/50 transform group-hover:scale-110 active:scale-90 transition-transform pointer-events-auto"
                   >
                      <X size={14} />
                   </button>
                </div>
              </div>
            ))}
            {Array.from({ length: emptySlotsCount }).map((_, i) => (
              <div 
                key={`empty-${i}`}
                className="aspect-[3/4.2] bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center opacity-40"
              >
                <Plus size={16} className="text-zinc-700" />
              </div>
            ))}
          </div>

          {emptySlotsCount > 0 && (
            <div className="bg-zinc-900/30 p-3 rounded-2xl border border-zinc-800/50 text-center">
               <p className="text-[9px] font-black text-red-500/80 uppercase tracking-widest animate-pulse">
                 Add {emptySlotsCount} players to complete your squad (12 required)
               </p>
            </div>
          )}
        </section>

        {/* SECTION 2: PLAYER COLLECTION */}
        <section className="p-4 space-y-4 border-t border-zinc-900 mt-4">
          <h3 className="heading-font text-xl font-black text-zinc-500 uppercase tracking-widest italic">Collection</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {MOCK_CARDS.map((card) => {
              const isAdded = squad.cards.some(c => c.id === card.id);
              return (
                <div 
                  key={card.id} 
                  className={`relative cursor-pointer transition-all duration-300 group ${isAdded ? 'opacity-40 grayscale' : 'hover:scale-105 active:scale-95'}`}
                  onClick={() => setPreviewCard(card)}
                >
                  <Card card={card} className="shadow-xl" />
                  
                  {/* Secondary Add (+) button overlay - hit area limited to the button circle */}
                  {!isAdded && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleCard(card);
                         }}
                         className="p-3 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-400 transform group-hover:scale-110 active:scale-90 transition-transform pointer-events-auto"
                       >
                          <Plus size={18} />
                       </button>
                    </div>
                  )}

                  {isAdded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 rounded-xl backdrop-blur-[2px] pointer-events-none">
                      <div className="p-2 bg-emerald-600 rounded-full text-white shadow-lg border border-white/20">
                        <Check size={16} />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">In Squad</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {previewCard && (
        <CardPreview 
          card={previewCard} 
          onClose={() => setPreviewCard(null)} 
          userGems={userGems}
          userLevel={userLevel}
          cardUpgrades={cardUpgrades[previewCard.id] || 0}
          onUpgrade={(c) => onUpgrade(c.id, 0, 0)}
          squads={squads}
          activeSquadId={squad.id}
          onToggleSquad={(c) => {
            toggleCard(c);
          }}
        />
      )}

      {/* EDIT IDENTITY MODAL */}
      {isIdentityModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-950 border-t border-zinc-800 rounded-t-[2.5rem] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[90vh]">
            <header className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
              <button 
                onClick={() => setIsIdentityModalOpen(false)}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90"
              >
                <ArrowLeft size={20} />
              </button>
              <h3 className="heading-font text-2xl font-black italic text-white uppercase tracking-tighter">Edit Identity</h3>
              <button 
                onClick={() => setIsIdentityModalOpen(false)}
                className="heading-font text-xl font-black px-5 py-2 rounded-xl bg-red-600 text-white shadow-lg shadow-red-900/30 active:scale-95 transition-all"
              >
                DONE
              </button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-12">
              <div className="flex flex-col items-center justify-center py-6">
                <div className={`w-32 h-32 rounded-[2rem] bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center relative shadow-2xl transform transition-transform duration-500 ${activeColor.class}`}>
                   {(() => {
                     const PreviewIcon = activeEmblem.icon;
                     return <PreviewIcon size={64} className="drop-shadow-lg" />;
                   })()}
                   <div className="absolute inset-0 border border-white/5 rounded-[1.8rem] pointer-events-none" />
                </div>
                <div className="mt-6 text-center">
                  <h4 className="heading-font text-4xl font-black italic text-white leading-none uppercase tracking-tighter">{squad.name || 'NAME...'}</h4>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="heading-font text-xl font-black text-zinc-500 uppercase tracking-widest italic">Choose Icon</h4>
                <div className="grid grid-cols-3 gap-3">
                  {EMBLEM_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = squad.emblemId === opt.id;
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => updateIdentity({ emblemId: opt.id })}
                        className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all relative group ${
                          isSelected 
                            ? 'bg-zinc-900 border-red-600 shadow-xl' 
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <Icon size={28} className={isSelected ? 'text-red-600' : 'text-zinc-600 group-hover:text-zinc-400'} />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full p-0.5 border border-zinc-950 shadow-lg">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="heading-font text-xl font-black text-zinc-500 uppercase tracking-widest italic">Icon Color</h4>
                <div className="flex justify-between items-center px-2">
                  {COLOR_OPTIONS.map((opt) => {
                    const isSelected = squad.color === opt.id;
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => updateIdentity({ color: opt.id })}
                        className={`w-12 h-12 rounded-full border-4 transition-all relative flex items-center justify-center ${
                          isSelected 
                            ? 'border-white scale-110 shadow-xl' 
                            : 'border-zinc-900 hover:scale-105'
                        } ${opt.bg}`}
                      >
                        {isSelected && <Check size={20} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="heading-font text-xl font-black text-zinc-500 uppercase tracking-widest italic">Squad Name</h4>
                  <span className={`text-[10px] font-black tracking-widest ${squad.name.length >= 8 ? 'text-red-500' : 'text-zinc-600'}`}>
                    {squad.name.length} / 8
                  </span>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    value={squad.name}
                    onChange={(e) => updateIdentity({ name: e.target.value.slice(0, 8) })}
                    placeholder="NAME..."
                    className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 rounded-2xl px-5 py-4 heading-font text-3xl font-black italic tracking-widest text-white uppercase outline-none placeholder:text-zinc-800 transition-all shadow-inner"
                  />
                  {squad.name.length > 0 && (
                    <button 
                      onClick={() => updateIdentity({ name: '' })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
