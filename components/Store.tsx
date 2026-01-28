
import React, { useState, useEffect, useRef } from 'react';
import { Coins, Gem, ShoppingBag, Frame, Package, Star, TrendingUp } from 'lucide-react';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';

const TABS = [
  { id: 'coins', label: 'Coins', icon: Coins },
  { id: 'gems', label: 'Gems', icon: Gem },
  { id: 'cards', label: 'Cards', icon: ShoppingBag },
  { id: 'frames', label: 'Frames', icon: Frame },
  { id: 'inventories', label: 'Packs', icon: Package },
];

const VALID_TAB_IDS = TABS.map(t => t.id);
const SESSION_STORAGE_KEY = 'cb_store_last_tab';

interface StoreProps {
  initialTab?: string;
}

export const Store: React.FC<StoreProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState('cards');
  const tabListRef = useRef<HTMLDivElement>(null);

  // ON MOUNT: Determine initial tab based on Prop -> URL -> Session -> Default
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

    // Accessibility: Focus the active tab container when opened programmatically
    if ((initialTab || queryTab) && tabListRef.current) {
      tabListRef.current.focus();
    }
  }, [initialTab]);

  // Sync tab changes with Session Storage and URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    sessionStorage.setItem(SESSION_STORAGE_KEY, tabId);
    
    // Update URL without reloading (bookmarkable state)
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="flex flex-col gap-6 px-4 pb-32 animate-in fade-in duration-500">
      {/* Featured Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-900 rounded-3xl p-6 flex items-center justify-between shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 space-y-1">
          <p className="text-red-200 text-[10px] font-black uppercase tracking-[0.3em]">Special Offer</p>
          <h3 className="heading-font text-4xl font-black italic tracking-tighter text-white uppercase leading-none">STARTER PACK</h3>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Get 5 Rare Players + 1000 Coins</p>
          <button 
            onClick={() => handleTabChange('inventories')}
            className="mt-4 bg-white text-red-600 px-6 py-2 rounded-xl heading-font text-lg font-black uppercase italic shadow-xl active:scale-95 transition-all"
          >
            Buy Now
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 group-hover:opacity-60 transition-opacity">
           <img src={MOCK_CARDS[2].image} className="w-full h-full object-cover grayscale" alt="" />
        </div>
      </div>

      {/* Unified Tab UI Consistency - Segmented Control Style */}
      <div 
        ref={tabListRef}
        tabIndex={-1}
        className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar outline-none focus-within:ring-2 focus-within:ring-red-600/50"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg heading-font text-lg font-bold transition-all uppercase flex items-center gap-2 ${
                isActive ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        {activeTab === 'cards' ? (
          MOCK_CARDS.map((card) => (
            <div key={card.id} className="flex flex-col gap-3 group animate-in slide-in-from-bottom-4 duration-300">
              <Card card={card} />
              <button className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-red-600 hover:to-red-700 text-zinc-400 hover:text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-800 hover:border-red-400 shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <Coins size={14} className="text-yellow-500" />
                {card.cost * 100} Coins
              </button>
            </div>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((i) => {
            let label = activeTab === 'coins' ? `${i * 1000}` : activeTab === 'gems' ? `${i * 50}` : `Premium ${activeTab.slice(0, -1)} ${i}`;
            let icon = activeTab === 'coins' ? <Coins className="text-yellow-500" /> : <Gem className="text-red-500" />;

            return (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col items-center group cursor-pointer hover:border-red-600/50 transition-all shadow-xl shadow-black/40 animate-in slide-in-from-bottom-4 duration-300">
                <div className="w-24 h-24 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 text-red-500 shadow-inner border border-zinc-800/50 overflow-hidden relative">
                   <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
                   <div className="scale-150 opacity-20 group-hover:scale-175 group-hover:opacity-40 transition-all duration-700">
                     {icon}
                   </div>
                   <div className="relative z-10 flex flex-col items-center gap-2">
                     {icon}
                     <span className="heading-font text-2xl font-black text-white">{label}</span>
                   </div>
                </div>
                <h5 className="heading-font text-xl font-black text-white uppercase text-center leading-none mb-2 tracking-tight italic">
                   Bundle Pack {i}
                </h5>
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-5 tracking-[0.3em]">Limited Daily Pack</p>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-400/30 shadow-xl active:scale-95">
                  $ {(i * 0.99).toFixed(2)}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
