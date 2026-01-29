
import React, { useState, useMemo } from 'react';
import { ArrowRight, Coins, FlaskConical, Gem, X } from 'lucide-react';
import { AppView } from '../types';

interface ProgressionViewProps {
  outcome: 'victory' | 'defeat' | 'draw' | 'declared';
  oldXp: number;
  oldLevel: number;
  currentXp: number;
  currentLevel: number;
  payout: number; // Coins
  energyEarned?: number;
  gemsEarned?: number;
  onNavigate: (view: AppView) => void;
  onClose: () => void;
}

type RewardType = 'COINS' | 'ENERGY' | 'GEMS';

interface RewardStep {
  type: RewardType;
  amount: number;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  payout,
  energyEarned = 0,
  gemsEarned = 0,
  onNavigate,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Build the sequence of rewards to show one-by-one
  const steps = useMemo(() => {
    const list: RewardStep[] = [];
    if (payout > 0) list.push({ type: 'COINS', amount: payout });
    if (energyEarned > 0) list.push({ type: 'ENERGY', amount: energyEarned });
    if (gemsEarned > 0) list.push({ type: 'GEMS', amount: gemsEarned });
    return list;
  }, [payout, energyEarned, gemsEarned]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    onNavigate(AppView.MATCH_STATS);
  };

  if (!currentStep) {
    // Fallback if no rewards earned
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black animate-in slide-in-from-bottom duration-500">
        <button onClick={onClose} className="text-zinc-500 font-bold uppercase tracking-widest">
          CLOSE
        </button>
      </div>
    );
  }

  const isGems = currentStep.type === 'GEMS';

  return (
    <div className="h-full flex flex-col items-center justify-center bg-black animate-in slide-in-from-bottom duration-700 relative overflow-hidden select-none">
      
      {/* 1. Header */}
      <div className="absolute top-24 w-full text-center">
        <h1 className="heading-font text-2xl font-black text-zinc-500 tracking-[0.4em] uppercase">
          {isGems ? 'RARE REWARD' : 'MATCH COMPLETE'}
        </h1>
      </div>

      {/* 2. Reward Content */}
      <div key={currentStep.type} className="flex flex-col items-center gap-6 animate-in fade-in scale-in duration-500">
        
        {/* Reward Icon */}
        <div className="relative">
          {currentStep.type === 'COINS' && (
            <div className="p-8 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-2xl">
              <Coins size={80} className="text-yellow-500" strokeWidth={1.5} />
            </div>
          )}
          
          {currentStep.type === 'ENERGY' && (
            <div className="relative">
              <div className="p-8 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-2xl">
                <FlaskConical size={80} className="text-blue-400" strokeWidth={1.5} />
              </div>
              <span className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</span>
            </div>
          )}
          
          {currentStep.type === 'GEMS' && (
            <div className="p-8 bg-zinc-900/50 rounded-full border border-zinc-800 shadow-2xl">
              <Gem size={80} className="text-violet-500" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Reward Amount Text */}
        <div className="text-center space-y-2">
          <h2 className={`heading-font text-7xl font-black italic tracking-tighter uppercase ${
            currentStep.type === 'COINS' ? 'text-yellow-400' : 
            currentStep.type === 'ENERGY' ? 'text-blue-400' : 'text-violet-400'
          }`}>
            +{currentStep.amount} {currentStep.type}
          </h2>
        </div>
      </div>

      {/* 3. CTA */}
      <div className="fixed bottom-32 w-full flex justify-center">
        {isGems ? (
          <button 
            onClick={handleGoBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors heading-font text-2xl font-black italic uppercase tracking-widest active:scale-95"
          >
            GO BACK
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 text-white transition-colors heading-font text-2xl font-black italic uppercase tracking-widest group active:scale-95"
          >
            COLLECT REWARDS 
            <ArrowRight size={24} className="mt-1 transition-transform duration-300 group-hover:translate-x-2 animate-arrow-nudge" />
          </button>
        )}
      </div>

    </div>
  );
};
