
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

export const Home: React.FC<HomeProps> = ({ setView, startBrawl, squads, activeSquadId, onSelectSquad, onEditSquad, userLevel = 5 }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(MOCK_REGIONS[0]); 
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isSquadSelectorOpen, setIsSquadSelectorOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lockedFeedback, setLockedFeedback] = useState<string | null>(null);
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

  const handleRegionTap = (region: ExtendedRegion) => {
    const isLocked = (userLevel || 0) < region.unlockLevel;
    if (isLocked) {
      setLockedFeedback(`Reach Level ${region.unlockLevel} to unlock this arena.`);
      setTimeout(() => setLockedFeedback(null), 2000);
    } else {
      setSelectedRegion(region);
      setIsRegionModalOpen(false);
    }
  };

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

              <div className={`absolute inset-x-0 bottom-44 p-10 z-10 transition-opacity duration-300 ${activeIndex === i ? 'opacity-100 animate-hero-entry' : 'opacity-0'}`}>
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

        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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
            onClick={() => setIsRegionModalOpen(true)}
            className="w-[86px] h-[64px] bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all btn-press group shrink-0"
          >
            <MapPin size={20} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
            <span className="heading-font text-[11px] font-bold text-white tracking-tight uppercase leading-none text-center">
              ARENA
            </span>
          </button>

        </div>
      </div>

      <Modal isOpen={isRegionModalOpen} onClose={() => setIsRegionModalOpen(false)} title="Arena Selector">
        <div className="flex flex-col max-h-[75vh] relative no-scrollbar">
          
          {/* Locked Arena Feedback Toast */}
          {lockedFeedback && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[110] bg-zinc-950 border border-red-600/50 px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <p className="heading-font text-lg font-black text-red-500 italic uppercase tracking-widest text-center">{lockedFeedback}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 py-2 px-1">
            {MOCK_REGIONS.map((region) => {
              const r = region as ExtendedRegion;
              const isLocked = (userLevel || 0) < r.unlockLevel;
              const isSelected = selectedRegion.id === r.id;

              return (
                <div 
                  key={r.id}
                  onClick={() => handleRegionTap(r)}
                  className={`relative flex flex-col p-6 rounded-[2.5rem] transition-all duration-200 border-2 overflow-hidden ${
                    isLocked 
                      ? 'bg-zinc-900/10 border-zinc-900' 
                      : isSelected 
                        ? 'bg-red-600/5 border-red-600 shadow-[0_15px_40px_rgba(220,38,38,0.15)] ring-1 ring-red-600/30' 
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  {/* Row 1: Country + Flag & Status/Lock */}
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 shrink-0 rounded-2xl overflow-hidden border border-white/5 shadow-inner ${isLocked ? 'grayscale opacity-50' : ''}`}>
                        <img src={r.flag} className="w-full h-full object-cover" alt="" />
                      </div>
                      <h5 className={`heading-font text-3xl font-black leading-none uppercase tracking-tight truncate ${isLocked ? 'text-zinc-600' : 'text-zinc-100'}`}>
                        {r.country}
                      </h5>
                    </div>
                    
                    {!isLocked ? (
                      <div className="bg-red-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-900/20 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="heading-font text-lg font-black text-white leading-none tracking-widest">LIVE</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700">
                        <Lock size={20} />
                      </div>
                    )}
                  </div>

                  {/* Row 2: Unlock Message or Sub-heading */}
                  <div className="mt-4 min-h-[40px] flex items-center">
                    {isLocked ? (
                      <div className="flex items-center gap-3">
                        <div className="h-0.5 w-6 bg-red-600/30" />
                        <p className="heading-font text-2xl font-black text-red-600 italic uppercase tracking-widest">
                          Unlocks at Level {r.unlockLevel}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">
                        {r.rewardHint}
                      </p>
                    )}
                  </div>

                  {/* Row 3: Stats Grid */}
                  <div className={`mt-6 pt-5 border-t ${isLocked ? 'border-zinc-900' : 'border-white/5'} flex items-center justify-between`}>
                    <div className="flex items-center gap-8">
                      {/* Entry Fee */}
                      <div className="flex flex-col items-center gap-1">
                         <div className="flex items-center gap-1.5">
                           <Coins size={14} className={isLocked ? 'text-zinc-700' : 'text-amber-500'} />
                           <span className={`heading-font text-3xl font-black leading-none ${isLocked ? 'text-zinc-700' : 'text-white'}`}>{r.entryFee}</span>
                         </div>
                         <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ENTRY</span>
                      </div>
                      
                      {/* Stadiums */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className={isLocked ? 'text-zinc-700' : 'text-purple-500'} />
                          <span className={`heading-font text-3xl font-black leading-none ${isLocked ? 'text-zinc-700' : 'text-white'}`}>{r.stadiumCount}</span>
                        </div>
                        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">STADIUMS</span>
                      </div>

                      {/* Energy */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5">
                           <Zap size={14} className={isLocked ? 'text-zinc-700' : 'text-blue-500'} />
                           <span className={`heading-font text-3xl font-black leading-none ${isLocked ? 'text-zinc-700' : 'text-white'}`}>
                            +{r.energyReward}
                           </span>
                        </div>
                        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ENERGY</span>
                      </div>
                    </div>

                    {!isLocked && isSelected && (
                      <div className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-2xl bg-red-600/10 border border-red-600/30 shrink-0">
                        <CheckCircle2 size={18} />
                        <span className="heading-font text-xl font-black uppercase tracking-tighter">READY</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

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
