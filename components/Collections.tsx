import React, { useMemo, useState } from 'react';
import { MOCK_CARDS, EMBLEMS } from '../constants';
import { Plus, Edit2, Zap, Trophy } from 'lucide-react';
import { PlayerCard, Squad, UserProfile } from '../types';
import { Card } from './Card';
import { CardPreview } from './CardPreview';

const RARITY_BORDERS: Record<string, string> = {
  Legendary: 'border-yellow-500',
  Epic: 'border-purple-600',
  Rare: 'border-blue-500',
  Common: 'border-zinc-700',
};

export const CollectionLevelIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 ${className}`} style={{ width: size, height: size }}>
      <Trophy size={size * 0.6} className="text-zinc-400" />
    </div>
  );
};

interface CollectionsProps {
  onEditSquad: (squadId: string) => void;
  activeTab: 'players' | 'squads';
  setActiveTab: (tab: 'players' | 'squads') => void;
  squads: Squad[];
  activeSquadId: string;
  onUpdateSquad: (squad: Squad) => void;
  userProfile: any;
  cardUpgrades: Record<string, number>;
  onUpgradeCard: (cardId: string, bitValue?: number) => void;
  customCards?: PlayerCard[];
}

export const Collections: React.FC<CollectionsProps> = ({ 
  onEditSquad, 
  activeTab, 
  setActiveTab, 
  squads, 
  activeSquadId, 
  onUpdateSquad,
  userProfile,
  cardUpgrades,
  onUpgradeCard,
  customCards
}) => {
  const [previewCard, setPreviewCard] = useState<PlayerCard | null>(null);

  const displayCards = customCards || MOCK_CARDS;

  const groupedCards = useMemo(() => {
    const groups: Record<number, PlayerCard[]> = {};
    displayCards.forEach(card => {
      const cost = card.cost;
      if (!groups[cost]) groups[cost] = [];
      groups[cost].push(card);
    });
    return groups;
  }, [displayCards]);

  const sortedCosts = useMemo(() => Object.keys(groupedCards).map(Number).sort((a, b) => a - b), [groupedCards]);

  const getCardStage = (cardId: string) => {
    const bitValue = cardUpgrades[cardId] || 0;
    // Count how many bits are set (1, 2, 4, 8)
    return [1, 2, 4, 8].filter(bit => bitValue & bit).length;
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pb-32">
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <button 
          onClick={() => setActiveTab('players')} 
          className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase ${
            activeTab === 'players' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          My Players
        </button>
        <button 
          onClick={() => setActiveTab('squads')} 
          className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase ${
            activeTab === 'squads' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          My Squads
        </button>
      </div>

      {activeTab === 'players' ? (
        <div className="flex flex-col gap-10">
          {sortedCosts.length > 0 ? sortedCosts.map((cost) => (
            <section key={cost} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                <Zap size={14} className="text-zinc-600" fill="currentColor" />
                <h3 className="heading-font text-2xl font-black italic text-zinc-500 uppercase tracking-widest">{cost} COST PLAYERS</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10">
                {groupedCards[cost].map((card) => {
                  const cardStage = getCardStage(card.id);
                  // Simulate some cards being upgradable for visual demo
                  const isUpgradable = card.id === '1' || card.id === '4' || card.id === '7';
                  
                  return (
                    <div key={card.id} className="flex flex-col gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={() => setPreviewCard(card)}>
                      <Card 
                        card={card} 
                        className="shadow-2xl" 
                        stage={cardStage} 
                        showSparkle={cardStage > 0}
                        upgradable={isUpgradable}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )) : (
            <div className="py-20 text-center text-zinc-600 heading-font text-xl uppercase italic">No players in collection.</div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {squads.map((squad) => {
            const count = squad.cards.length;
            const Icon = EMBLEMS[squad.emblemId || 'shield'] || Plus;
            return (
              <div 
                key={squad.id} 
                onClick={() => onEditSquad(squad.id)} 
                className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 flex flex-col h-[180px] overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group shrink-0"
              >
                <div className="flex justify-between items-start shrink-0 mb-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 text-zinc-500 transition-transform group-hover:scale-110">
                      <Icon size={24} />
                    </div>
                    <div>
                       <h4 className="heading-font text-2xl font-black text-white italic leading-none uppercase tracking-tight">{squad.name}</h4>
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">{count} / 12 CARDS</p>
                    </div>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-600 group-hover:text-white transition-colors shrink-0">
                    <Edit2 size={14} />
                  </div>
                </div>

                <div className="h-[74px] w-full shrink-0 overflow-hidden flex items-center">
                  {squad.cards.length > 0 ? (
                    <div 
                      className="flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar py-1 w-full flex-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {squad.cards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`w-12 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden shadow-lg ${RARITY_BORDERS[card.rarity] || RARITY_BORDERS.Common}`}
                        >
                          <img 
                            src={card.image} 
                            className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all" 
                            alt={card.name} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full py-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest italic text-center border border-dashed border-zinc-800 rounded-xl">
                      Empty Squad
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewCard && (
        <CardPreview 
          card={previewCard} 
          onClose={() => setPreviewCard(null)}
          userGems={userProfile.gems}
          userLevel={userProfile.level}
          cardUpgrades={cardUpgrades[previewCard.id] || 0}
          onUpgrade={(c, bit) => onUpgradeCard(c.id, bit)}
          squads={squads}
        />
      )}
    </div>
  );
};