
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Lock, Coins, Zap, CheckCircle2 } from 'lucide-react';
import { MOCK_REGIONS, ExtendedRegion } from '../constants';
import { Region } from '../types';

interface ArenaSelectorProps {
  userCoins: number;
  currentRegion: Region;
  userLevel: number;
  onConfirm: (region: Region) => void;
  onBack: () => void;
}

export const ArenaSelector: React.FC<ArenaSelectorProps> = ({ userCoins, currentRegion, userLevel, onConfirm, onBack }) => {
  const [pendingRegion, setPendingRegion] = useState<Region | null>(null);

  const handleRegionSelect = (region: ExtendedRegion) => {
    const isLocked = userLevel < region.unlockLevel;
    if (!isLocked) {
      setPendingRegion(region);
    }
  };

  const isConfirmDisabled = !pendingRegion;

  return (
    <div className="h-full flex flex-col bg-black animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-black border-b border-zinc-900 z-50 flex items-center px-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="heading-font text-3xl font-black italic text-white uppercase tracking-tighter ml-4">
          ARENA SELECTOR
        </h1>

        {/* MANDATORY CHANGE: User's current coin balance visibility */}
        <div className="ml-auto flex items-center bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5 gap-2 mr-2">
          <Coins size={14} className="text-amber-500" />
          <span className="heading-font text-xl font-black text-white leading-none">
            {userCoins.toLocaleString()}
          </span>
        </div>
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-24 pb-32">
        <div className="flex flex-col gap-4">
          {MOCK_REGIONS.map((region) => {
            const r = region as ExtendedRegion;
            const isLocked = userLevel < r.unlockLevel;
            const isPending = pendingRegion?.id === r.id;
            const isCurrent = currentRegion.id === r.id && !pendingRegion;
            const isActuallySelected = isPending || (isCurrent && !pendingRegion);

            return (
              <div 
                key={r.id}
                onClick={() => handleRegionSelect(r)}
                className={`relative flex flex-col p-6 rounded-[2.5rem] transition-all duration-200 border-2 overflow-hidden ${
                  isLocked 
                    ? 'bg-zinc-900/10 border-zinc-900' 
                    : isActuallySelected 
                      ? 'bg-red-600/10 border-red-600 shadow-[0_15px_40px_rgba(220,38,38,0.2)] ring-1 ring-red-600/30' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 cursor-pointer active:scale-[0.98]'
                }`}
              >
                {/* Row 1: Country + Flag & Status/Lock */}
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl overflow-hidden border border-white/5 shadow-inner ${isLocked ? 'grayscale opacity-50' : ''}`}>
                      <img src={r.flag} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex flex-col">
                       <h5 className={`heading-font text-3xl font-black leading-none uppercase tracking-tight truncate ${isLocked ? 'text-zinc-600' : 'text-zinc-100'}`}>
                        {r.country}
                      </h5>
                      {!isLocked && <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{r.name}</p>}
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700">
                      <Lock size={20} />
                    </div>
                  ) : isActuallySelected ? (
                    <div className="bg-red-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-900/20 shrink-0">
                      <CheckCircle2 size={16} className="text-white" />
                      <span className="heading-font text-lg font-black text-white leading-none tracking-widest uppercase">READY</span>
                    </div>
                  ) : null}
                </div>

                {/* Row 2: Details or Unlock Message */}
                <div className="mt-6 pt-5 border-t border-white/5">
                  {isLocked ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-0.5 w-6 bg-red-600/30" />
                        <p className="heading-font text-2xl font-black text-red-600 italic uppercase tracking-widest">
                          Unlocks at Level {r.unlockLevel}
                        </p>
                      </div>
                      
                      {/* CRITICAL: Display coin requirement even if locked, in disabled state */}
                      <div className="flex flex-col items-center gap-1 opacity-30 grayscale">
                        <div className="flex items-center gap-1.5">
                          <Coins size={14} className="text-zinc-500" />
                          <span className="heading-font text-2xl font-black text-zinc-500 leading-none">{r.entryFee}</span>
                        </div>
                        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ENTRY</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        {/* Entry Fee (Visible at a glance for unlocked) */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5">
                            <Coins size={14} className="text-amber-500" />
                            <span className="heading-font text-2xl font-black text-white leading-none">{r.entryFee}</span>
                          </div>
                          <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ENTRY</span>
                        </div>
                        
                        {/* Stadiums */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-purple-500" />
                            <span className="heading-font text-2xl font-black text-white leading-none">{r.stadiumCount}</span>
                          </div>
                          <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">STADIUMS</span>
                        </div>

                        {/* Energy */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5">
                            <Zap size={14} className="text-blue-500" />
                            <span className="heading-font text-2xl font-black text-white leading-none">+{r.energyReward}</span>
                          </div>
                          <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">ENERGY</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Confirm */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 z-50">
        <div className="max-w-lg mx-auto">
          <button 
            disabled={isConfirmDisabled}
            onClick={() => pendingRegion && onConfirm(pendingRegion)}
            className={`w-full py-5 rounded-2xl heading-font text-3xl font-black italic uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${
              isConfirmDisabled 
                ? 'bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed grayscale'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50 border-b-4 border-red-800'
            }`}
          >
            CONFIRM SELECTION
          </button>
        </div>
      </footer>
    </div>
  );
};
