import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Swords, Users, MapPin, Shield, Trophy, Target, Activity, Flame, AlertCircle, Edit2, AlertTriangle, Plus, Lock, Zap, Coins, CheckCircle2 } from 'lucide-react';
import { MOCK_REGIONS, MOCK_SQUADS, EMBLEMS, ExtendedRegion } from '../constants';
import { Modal } from './Modal';
import { Region, Squad, AppView } from '../types';

interface HomeProps {
  setView: (view: AppView, tab?: string) => void;
  startBrawl: (region: Region) => void;
  squads: Squad[];
  activeSquadId: string;
  onSelectSquad: (id: string) => void;
  onEditSquad: (id: string) => void;
  userLevel?: number;
  selectedRegion: Region;
}

const CAROUSEL_ITEMS = [
  { 
    title: 'DHONI CARD RELEASED', 
    cta: 'Buy Card', 
    tab: 'cards',
    img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    title: 'UNLOCK MUMBAI ARENA', 
    cta: 'Unlock Stadium', 
    tab: 'coins',
    img: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    title: 'FLASH EVENT: WORLD CUP', 
    cta: 'View Event', 
    tab: 'inventories',
    img: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=1200' 
  }
];

export const Home: React.FC<HomeProps> = ({ setView, startBrawl, squads, activeSquadId, onSelectSquad, onEditSquad, userLevel = 10, selectedRegion }) => {
  const [isSquadSelectorOpen, setIsSquadSelectorOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollRef = useRef<number | null>(null);

  const activeSquad = useMemo(() => {
    return squads.find(s => s.id === activeSquadId) || squads[0];
  }, [squads, activeSquadId]);

  const SquadIcon = useMemo(() => {
    return EMBLEMS[activeSquad.emblemId || 'shield'] || Users;
  }, [activeSquad.emblemId]);

  const isIncomplete = activeSquad.cards.length < 12;

  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = window.setInterval(() => {
        setActiveIndex(prev => (prev + 1) % CAROUSEL_ITEMS.length);
      }, 4800);
    };

    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden grain-texture">
      
      {/* 1. HERO CAROUSEL */}
      <section className="relative w-full flex-1 overflow-hidden">
        <div 
          className="flex h-full carousel-transition"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {CAROUSEL_ITEMS.map((item, i) => (
            <div key={i} className="min-w-full h-full relative overflow-hidden shrink-0">
              <div className="absolute inset-0 z-0">
                <img 
                    src={item.img} 
                    className="w-full h-full object-cover grayscale-[20%]" 
                    alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* POSITION ADJUSTMENT: bottom-52 increased to bottom-64 for more upward clearance */}
              <div className={`absolute inset-x-0 bottom-64 p-10 z-10 transition-opacity duration-300 ${activeIndex === i ? 'opacity-100 animate-hero-entry' : 'opacity-0'}`}>
                <h3 className="heading-font text-[36px] font-black text-white italic tracking-tight uppercase leading-[1.1] drop-shadow-[0_10px_10px_rgba(0,0,0,0.9)] max-w-[85%]">
                  {item.title}
                </h3>
                
                <div style={{ height: '14px' }} />

                <button 
                  onClick={() => setView(AppView.STORE, item.tab)}
                  className="bg-red-600 text-white font-black px-10 rounded-2xl text-[10px] transition-all uppercase tracking-[0.2em] border border-red-400/30 shadow-2xl btn-press h-[46px] flex items-center justify-center shrink-0"
                >
                  {item.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* POSITION ADJUSTMENT: Indicators moved to bottom-64 to match the content block */}
        <div className="absolute bottom-64 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {CAROUSEL_ITEMS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-450 ${activeIndex === i ? 'w-10 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'w-2 bg-zinc-800'}`} 
            />
          ))}
        </div>
      </section>

      {/* 2. STANDARDIZED ACTION SHELF */}
      <div className="fixed bottom-[92px] left-1/2 -translate-x-1/2 w-full max-w-lg px-2 z-[50] animate-action-shelf">
        <div className="flex items-center justify-center gap-2 w-full h-[84px] px-2 bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          
          <button 
            onClick={() => setIsSquadSelectorOpen(true)}
            className="w-[86px] h-[64px] bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all btn-press group shrink-0"
          >
            <div className="relative text-zinc-500 group-hover:text-red-500 transition-colors">
              <SquadIcon size={20} />
              {isIncomplete && (
                <div className="absolute -top-1.5 -right-1.5 animate-subtle-pulse">
                  <AlertCircle size={10} className="text-yellow-500 fill-black" />
                </div>
              )}
            </div>
            <span className="heading-font text-[11px] font-bold text-white tracking-tight truncate w-full px-1 uppercase leading-none text-center">
              {activeSquad.name.slice(0, 8)}
            </span>
          </button>

          <button 
            onClick={() => startBrawl(selectedRegion)}
            className="w-[130px] h-[68px] bg-red-600 border-b-4 border-red-800 rounded-2xl flex items-center justify-center gap-2 transition-all btn-press animate-brawl-pulse shadow-[0_8px_20px_rgba(220,38,38,0.3)] shrink-0"
          >
            <Swords size={24} className="text-white drop-shadow-sm shrink-0" />
            <span className="heading-font text-[24px] font-black italic tracking-tighter text-white leading-none">BRAWL</span>
          </button>

          <button 
            onClick={() => setView(AppView.ARENA_SELECTOR)}
            className="w-[86px] h-[64px] bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all btn-press group shrink-0"
          >
            <MapPin size={20} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
            <span className="heading-font text-[11px] font-bold text-white tracking-tight uppercase leading-none text-center">
              ARENA
            </span>
          </button>

        </div>
      </div>

      <Modal isOpen={isSquadSelectorOpen} onClose={() => setIsSquadSelectorOpen(false)} title="Assigned Squad">
        <div className="grid gap-2 py-1">
          {squads.map((squad) => {
            const count = squad.cards.length;
            const isSquadIncomplete = count < 12;
            const Icon = EMBLEMS[squad.emblemId || 'shield'] || Users;
            const isActive = activeSquadId === squad.id;

            return (
              <div 
                key={squad.id}
                onClick={() => {
                  onSelectSquad(squad.id);
                  setIsSquadSelectorOpen(false);
                }}
                className={`px-5 py-4 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  isActive ? 'bg-red-600/10 border-red-600 shadow-lg' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isActive ? 'bg-red-600 text-white border-red-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500 group-hover:text-red-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <h5 className={`heading-font text-2xl font-black uppercase italic leading-none transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}>
                    {squad.name}
                  </h5>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {isSquadIncomplete && (
                      <AlertTriangle size={14} className="text-yellow-500 animate-subtle-pulse" />
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      isSquadIncomplete ? 'text-yellow-500/80' : 'text-zinc-500'
                    }`}>
                      {count} / 12
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSquad(squad.id);
                      setIsSquadSelectorOpen(false);
                    }}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          <div 
            onClick={() => {
              onEditSquad('new');
              setIsSquadSelectorOpen(false);
            }}
            className="px-5 py-3.5 rounded-[1.5rem] border-2 border-dashed border-zinc-800 bg-zinc-900/5 flex items-center justify-center gap-4 group cursor-pointer hover:border-red-600/30 transition-all btn-press"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-red-500 transition-all group-hover:scale-105">
              <Plus size={20} />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="heading-font text-xl font-black italic text-zinc-500 uppercase leading-none group-hover:text-zinc-400 transition-colors">
                CREATE NEW SQUAD
              </span>
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none mt-1 group-hover:text-zinc-600 transition-colors">
                Start with an empty lineup
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};