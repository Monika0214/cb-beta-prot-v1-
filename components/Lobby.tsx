
import React, { useState } from 'react';
import { ChevronRight, Users, MapPin, Swords, Package, Target, Edit2, TrendingUp, ShieldAlert } from 'lucide-react';
import { MOCK_REGIONS, MOCK_SQUADS, MOCK_CARDS } from '../constants';
import { Modal } from './Modal';
import { Region, Squad, AppView } from '../types';
import { Card } from './Card';

interface LobbyProps {
  setView: (view: AppView) => void;
  startBrawl: (region: Region) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ setView, startBrawl }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(MOCK_REGIONS[0]);
  const [selectedSquad, setSelectedSquad] = useState<Squad>(MOCK_SQUADS[0]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* 1. New Launches Carousel */}
      <section className="relative w-full">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-0 no-scrollbar">
          {[
            { title: 'DHONI CARD RELEASED', desc: 'Limited Edition Finisher', cta: 'Buy Card', img: MOCK_CARDS[0].image },
            { title: 'UNLOCK MUMBAI ARENA', desc: 'New High Stakes Turf', cta: 'Unlock Stadium', img: MOCK_CARDS[2].image },
            { title: 'FLASH EVENT: WORLD CUP', desc: 'Exclusive Rewards Live', cta: 'View Event', img: MOCK_CARDS[1].image }
          ].map((launch, i) => (
            <div key={i} className="min-w-full snap-center relative aspect-[16/10] overflow-hidden group">
              <img 
                src={launch.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={launch.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h3 className="heading-font text-5xl font-black text-white leading-none mb-1 italic tracking-tighter drop-shadow-2xl">
                  {launch.title}
                </h3>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6 drop-shadow-lg">{launch.desc}</p>
                <button 
                  onClick={() => setView(AppView.STORE)}
                  className="w-fit bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-xl text-xs transition-all uppercase tracking-[0.2em] border border-red-400/30 shadow-2xl shadow-red-900/50 active:scale-95"
                >
                  {launch.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Region Selection Section */}
      <section className="px-4 space-y-3">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Current Arena</p>
        <button 
          onClick={() => setIsRegionModalOpen(true)}
          className="w-full bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-[2rem] p-6 flex items-center justify-between active:scale-[0.98] transition-all hover:border-zinc-700 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-red-600 border border-zinc-700 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
               <img src={selectedRegion.image} className="w-full h-full object-cover opacity-60" alt="" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h4 className="heading-font text-3xl font-black text-white leading-none tracking-tight">{selectedRegion.name}</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">ENTRY: {selectedRegion.entryFee}c</span>
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20">{selectedRegion.playersCount} LIVE</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                  selectedRegion.risk === 'Low' ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' : 
                  selectedRegion.risk === 'Medium' ? 'bg-orange-600/10 text-orange-500 border-orange-500/20' : 'bg-red-600/10 text-red-600 border-red-600/20'
                }`}>
                  {selectedRegion.risk} RISK
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={24} className="text-zinc-700 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
        </button>
      </section>

      {/* 3. Squad Quick Selector */}
      <section className="px-4 space-y-3">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Assigned Squad</p>
        <div className="w-full bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-[2rem] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-red-600 border border-zinc-700 shadow-inner">
                <Users size={24} />
              </div>
              <div>
                <h4 className="heading-font text-2xl font-black text-white leading-none uppercase tracking-tight italic">{selectedSquad.name}</h4>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">POWER SCORE: {selectedSquad.power}</p>
              </div>
            </div>
            <div className="flex -space-x-3">
              {selectedSquad.cards.map((c, i) => (
                <div key={i} className="w-10 h-14 rounded-lg overflow-hidden border-2 border-zinc-900 shadow-xl">
                   <img src={c.image} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsSquadModalOpen(true)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700"
            >
              Select Squad
            </button>
            <button 
              onClick={() => setView(AppView.COLLECTIONS)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700 flex items-center justify-center gap-2"
            >
              <Edit2 size={12} />
              Edit Squad
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRIMARY BRAWL CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-50">
        <button 
          onClick={() => startBrawl(selectedRegion)}
          className="w-full h-20 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] shadow-[0_15px_50px_rgba(220,38,38,0.5)] flex items-center justify-center gap-4 active:scale-95 transition-all group border-b-4 border-red-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
          <Swords size={32} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
          <span className="heading-font text-5xl font-black italic tracking-tighter uppercase leading-none">Brawl</span>
          <div className="absolute -right-4 -top-4 w-12 h-24 bg-white/5 rotate-12" />
        </button>
      </div>

      {/* Popups */}
      <Modal isOpen={isRegionModalOpen} onClose={() => setIsRegionModalOpen(false)} title="Select Region">
        <div className="grid gap-3 py-2">
          {MOCK_REGIONS.map((region) => (
            <div 
              key={region.id}
              onClick={() => { setSelectedRegion(region); setIsRegionModalOpen(false); }}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${
                selectedRegion.id === region.id ? 'bg-red-600/10 border-red-600 shadow-xl' : 'bg-zinc-800/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-700">
                    <img src={region.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h5 className="heading-font text-2xl font-black text-white uppercase italic tracking-tight">{region.name}</h5>
                    <div className="flex gap-2 mt-1">
                       <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">{region.entryFee} Coins</span>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${
                         region.risk === 'Low' ? 'text-blue-500' : region.risk === 'Medium' ? 'text-orange-500' : 'text-red-600'
                       }`}>• {region.risk} Risk</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[14px] font-black text-white heading-font">{region.playersCount}</p>
                   <p className="text-[8px] font-black text-zinc-500 uppercase">Players</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={isSquadModalOpen} onClose={() => setIsSquadModalOpen(false)} title="Select Squad">
        <div className="grid gap-3 py-2">
          {MOCK_SQUADS.map((squad) => (
            <div 
              key={squad.id}
              onClick={() => { setSelectedSquad(squad); setIsSquadModalOpen(false); }}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${
                selectedSquad.id === squad.id ? 'bg-red-600/10 border-red-600 shadow-xl' : 'bg-zinc-800/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div>
                   <h5 className="heading-font text-3xl font-black text-white uppercase italic leading-none">{squad.name}</h5>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">POWER: {squad.power}</p>
                </div>
                <div className="flex -space-x-4">
                  {squad.cards.map((c, i) => (
                    <div key={i} className="w-10 h-14 rounded-lg overflow-hidden border-2 border-zinc-900 shadow-2xl">
                       <img src={c.image} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
