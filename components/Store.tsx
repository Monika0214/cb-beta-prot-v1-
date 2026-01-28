
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Coins, Gem, ShoppingBag, Frame, Package, PartyPopper } from 'lucide-react';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';
import { CardPreview } from './CardPreview';
import { PlayerCard, Squad } from '../types';

const TABS = [
  { id: 'coins', label: 'Coins', icon: Coins },
  { id: 'gems', label: 'Gems', icon: Gem },
  { id: 'cards', label: 'Cards', icon: ShoppingBag },
  { id: 'frames', label: 'Frames', icon: Frame },
  { id: 'inventories', label: 'Packs', icon: Package },
];

const VALID_TAB_IDS = TABS.map(t => t.id);
const SESSION_STORAGE_KEY = 'cb_store_last_tab';

const RARITY_PRICES: Record<string, number> = {
  Legendary: 3500,
  Epic: 1250,
  Rare: 450,
  Common: 150
};

const RARITY_THEMES: Record<string, { border: string, glow: string, bg: string }> = {
  Legendary: { border: 'border-yellow-500/50', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.1)]', bg: 'bg-yellow-500/5' },
  Epic: { border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.1)]', bg: 'bg-purple-500/5' },
  Rare: { border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.1)]', bg: 'bg-blue-500/5' },
  Common: { border: 'border-zinc-800', glow: 'shadow-none', bg: 'bg-zinc-900/40' }
};

const FRAME_ITEMS = [
  { id: 'f1', name: 'BRONZE LEGACY', gemPrice: 150, asset: 'frame_bronze_legacy.png', color: '#B87333', glow: 'rgba(184, 115, 51, 0.4)' },
  { id: 'f2', name: 'SILVER STREAK', gemPrice: 300, asset: 'frame_silver_streak.png', color: '#C0C0C0', glow: 'rgba(192, 192, 192, 0.4)' },
  { id: 'f3', name: 'GOLD ELITE', gemPrice: 750, asset: 'frame_gold_elite.png', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' },
  { id: 'f4', name: 'ANGEL WHITE', gemPrice: 1200, asset: 'frame_angel_white.png', color: '#E0F2FE', glow: 'rgba(224, 242, 254, 0.5)' },
  { id: 'f5', name: 'ANGEL GOLD', gemPrice: 2500, asset: 'frame_angel_gold.png', color: '#FDE047', glow: 'rgba(253, 224, 71, 0.5)' },
  { id: 'f6', name: 'NEON PINK', gemPrice: 900, asset: 'frame_neon_pink.png', color: '#F472B6', glow: 'rgba(244, 114, 182, 0.6)' },
  { id: 'f7', name: 'NEON BLUE', gemPrice: 900, asset: 'frame_neon_blue.png', color: '#60A5FA', glow: 'rgba(96, 165, 250, 0.6)' },
];

interface StoreProps {
  initialTab?: string;
  ownedCardIds: string[];
  onPurchaseCard: (cardId: string, cost: number) => void;
  userGems: number;
  squads: Squad[];
  activeSquadId: string;
  onUpdateSquad: (squad: Squad) => void;
}

export const Store: React.FC<StoreProps> = ({ 
  initialTab, 
  ownedCardIds, 
  onPurchaseCard, 
  userGems
}) => {
  const [activeTab, setActiveTab] = useState('cards');
  const [previewCard, setPreviewCard] = useState<PlayerCard | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queryTab = new URLSearchParams(window.location.search).get('tab');
    const sessionTab = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    let targetTab = 'cards';
    if (initialTab && VALID_TAB_IDS.includes(initialTab)) {
      targetTab = initialTab;
    } else if (queryTab && VALID_TAB_IDS.includes(queryTab)) {
      targetTab = queryTab;
    } else if (sessionTab && VALID_TAB_IDS.includes(sessionTab)) {
      targetTab = sessionTab;
    }
    setActiveTab(targetTab);
  }, [initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    sessionStorage.setItem(SESSION_STORAGE_KEY, tabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.toString());
  };

  const storeCards = useMemo(() => {
    return MOCK_CARDS.filter(c => !ownedCardIds.includes(c.id));
  }, [ownedCardIds]);

  return (
    <div className="flex flex-col gap-6 px-4 pb-32 animate-in fade-in duration-500">
      {/* Featured Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-900 rounded-[2.5rem] p-6 flex items-center justify-between shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 space-y-1">
          <p className="text-red-200 text-[10px] font-black uppercase tracking-[0.3em]">Season Event</p>
          <h3 className="heading-font text-4xl font-black italic tracking-tighter text-white uppercase leading-none">ELITE DROPS</h3>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Limited Edition Variants Available</p>
          <button 
            onClick={() => handleTabChange('inventories')}
            className="mt-4 bg-white text-red-600 px-6 py-2 rounded-xl heading-font text-lg font-black uppercase italic shadow-xl active:scale-95 transition-all"
          >
            Explore
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
           <img src={MOCK_CARDS[0].image} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Tabs */}
      <div 
        ref={tabListRef}
        className="flex gap-2 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 overflow-x-auto no-scrollbar"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl heading-font text-xl font-bold transition-all uppercase flex items-center gap-2 ${
                isActive ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'cards' ? (
        storeCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 animate-in slide-in-from-bottom-4 duration-500">
            {storeCards.map((card) => {
              const price = RARITY_PRICES[card.rarity] || 150;
              const theme = RARITY_THEMES[card.rarity];
              
              return (
                <div 
                  key={card.id} 
                  className={`flex flex-col rounded-[2.2rem] overflow-hidden border-2 transition-all relative group shadow-2xl active:scale-95 ${theme.border} ${theme.glow} ${theme.bg}`}
                >
                  {/* Card Body -> Open Preview */}
                  <div 
                    onClick={() => setPreviewCard(card)}
                    className="p-3 pb-0 cursor-pointer"
                  >
                    <Card card={card} className="w-full border-0 pointer-events-none" />
                  </div>

                  {/* Red Footer CTA -> Unlock Flow */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPurchaseCard(card.id, price);
                    }}
                    className="mt-3 bg-red-600 hover:bg-red-500 border-t border-red-400/50 p-4 transition-colors flex items-center justify-center gap-2 group/cta active:scale-95"
                  >
                    <Gem size={14} className="text-white drop-shadow-sm" fill="currentColor" />
                    <span className="heading-font text-2xl font-black text-white leading-none tracking-tight group-hover/cta:scale-105 transition-transform">
                      {price} UNLOCK
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-6 animate-in zoom-in duration-700">
            <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 relative">
              <PartyPopper size={48} className="text-red-500 relative z-10" />
              <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full" />
            </div>
            <div className="space-y-2">
              <h3 className="heading-font text-5xl font-black italic text-white uppercase tracking-tighter">ALL CARDS UNLOCKED</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-[240px]">The ultimate collection is complete. New roster updates arriving soon.</p>
            </div>
          </div>
        )
      ) : activeTab === 'frames' ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 animate-in slide-in-from-bottom-4 duration-500">
          {FRAME_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col transition-all hover:border-red-600/30 shadow-2xl active:scale-95 group"
            >
              {/* Bold Frame Preview - High Contrast Logic */}
              <div className="p-8 pb-4 flex flex-col items-center gap-8">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  
                  {/* The Decisive Circular Ring (Requested Solution) */}
                  <div 
                    className="absolute inset-6 rounded-full border-[10px] shadow-[0_0_40px_rgba(0,0,0,0.9)] z-0"
                    style={{ 
                      borderColor: item.color,
                      boxShadow: `0 0 35px ${item.glow}`
                    }}
                  />
                  
                  {/* Subtle Inner Gradient for Depth */}
                  <div className="absolute inset-[34px] rounded-full bg-gradient-to-b from-zinc-800/20 to-zinc-950/60 pointer-events-none" />
                  
                  {/* Specific Frame Asset Overlay */}
                  <img 
                    src={`/assets/frames/${item.asset}`}
                    className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500"
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                  />
                </div>
                
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] text-center px-2">
                  {item.name}
                </span>
              </div>

              {/* Red Primary CTA Only - Diamonds Only Requirement */}
              <button 
                className="mt-2 bg-red-600 hover:bg-red-500 border-t border-red-400/50 p-4 transition-colors flex items-center justify-center gap-2 group/cta"
              >
                <Gem size={18} className="text-white drop-shadow-sm" fill="currentColor" />
                <span className="heading-font text-2xl font-black text-white leading-none tracking-tight group-hover/cta:scale-105 transition-transform">
                  BUY {item.gemPrice}
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            let amountValue = activeTab === 'coins' ? i * 1000 : i * 50;
            let displayLabel = activeTab === 'coins' ? `${amountValue.toLocaleString()}` : `${amountValue.toLocaleString()}`;
            let icon = activeTab === 'coins' ? <Coins className="text-yellow-500" /> : <Gem className="text-red-500" />;
            
            return (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col items-center group cursor-pointer hover:border-red-600/50 transition-all shadow-xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-4 text-red-500 shadow-inner border border-zinc-800/50">
                   <div className="relative z-10 flex flex-col items-center gap-1">
                     {icon}
                     <span className="heading-font text-xl font-black text-white">{displayLabel}</span>
                   </div>
                </div>
                <h5 className="heading-font text-lg font-black text-white uppercase text-center leading-none mb-4 tracking-tight">
                   {activeTab === 'coins' ? 'Coin' : 'Gem'} Pack {i}
                </h5>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 border-red-800 shadow-xl active:scale-95 active:border-b-0">
                  BUY ₹ {(i * 79).toFixed(0)}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Premium Preview Screen */}
      {previewCard && (
        <CardPreview 
          card={previewCard} 
          onClose={() => setPreviewCard(null)} 
          userGems={userGems}
          isStoreContext={true}
        />
      )}
    </div>
  );
};
