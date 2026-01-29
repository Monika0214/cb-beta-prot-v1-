
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight, Coins, FlaskConical, Gem, Activity } from 'lucide-react';
import { AppView } from '../types';

interface PostMatchRewardsProps {
  payout: number;
  energyEarned: number;
  gemsEarned: number;
  userProfile: {
    name: string;
    avatar: string;
    coins: number;
    gems: number;
    energyDrinks: number;
  };
  onNavigate: (view: AppView) => void;
}

type RewardType = 'COINS' | 'ENERGY' | 'GEMS' | 'MATCH';

interface RewardStep {
  type: RewardType;
  amount: number | string;
}

/**
 * AnimatedNumber component for the "Carrom-Pass" style tick-up effect.
 */
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;

    const start = prevValueRef.current;
    const end = value;
    const duration = 1500; // Premium slow-and-steady duration
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Power ease-out for a smooth finish
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easedProgress);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export const PostMatchRewards: React.FC<PostMatchRewardsProps> = ({
  payout,
  energyEarned,
  gemsEarned,
  userProfile,
  onNavigate,
}) => {
  // Initialize header balances to state BEFORE rewards were added
  const [headerCoins, setHeaderCoins] = useState(userProfile.coins - payout);
  const [headerEnergy, setHeaderEnergy] = useState(userProfile.energyDrinks - energyEarned);
  const [headerGems, setHeaderGems] = useState(userProfile.gems - gemsEarned);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Mandatory Reward Flow Order: COINS -> ENERGY -> GEMS
  const steps = useMemo(() => {
    const list: RewardStep[] = [];
    if (payout > 0) list.push({ type: 'COINS', amount: payout });
    if (energyEarned > 0) list.push({ type: 'ENERGY', amount: energyEarned });
    if (gemsEarned > 0) list.push({ type: 'GEMS', amount: gemsEarned });
    
    if (list.length === 0) {
      list.push({ type: 'MATCH', amount: 'COMPLETED' });
    }
    return list;
  }, [payout, energyEarned, gemsEarned]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Initial Entrance: Reveal content after a short slide-up delay
  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setContentVisible(true);
    }, 400);
    return () => clearTimeout(entranceTimer);
  }, []);

  /**
   * CRITICAL LOGIC: 
   * 1. Update header balance IMMEDIATELY when content becomes visible (on reveal).
   * 2. Start the 3-second timer for the CTA button after reveal.
   */
  useEffect(() => {
    if (contentVisible && currentStep) {
      // 1. Immediate Balance Update on Reveal
      if (currentStep.type === 'COINS') setHeaderCoins(prev => prev + (currentStep.amount as number));
      if (currentStep.type === 'ENERGY') setHeaderEnergy(prev => prev + (currentStep.amount as number));
      if (currentStep.type === 'GEMS') setHeaderGems(prev => prev + (currentStep.amount as number));

      // 2. Anticipation Delay: Wait 3 seconds before showing CTA
      const ctaTimer = setTimeout(() => {
        setCtaVisible(true);
      }, 3000);

      return () => clearTimeout(ctaTimer);
    }
  }, [contentVisible, currentStepIndex, currentStep]);

  const handleNextStep = () => {
    if (!ctaVisible) return;

    if (isLastStep) {
      // Final step: Close and go to stats
      onNavigate(AppView.MATCH_STATS);
    } else {
      // Transition to next reward step
      setContentVisible(false);
      setCtaVisible(false);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setContentVisible(true);
      }, 400);
    }
  };

  const handleSkip = () => {
    onNavigate(AppView.MATCH_STATS);
  };

  const isGems = currentStep?.type === 'GEMS';
  const isEnergy = currentStep?.type === 'ENERGY';
  const isCoins = currentStep?.type === 'COINS';
  const isMatch = currentStep?.type === 'MATCH';

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center select-none overflow-hidden">
      
      {/* Backdrop Dim Layer */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-700" 
        onClick={handleSkip}
      />

      {/* Reward Sheet (Modal Popup) - Slides up from bottom */}
      <div 
        className="relative w-full max-w-lg bg-zinc-950 rounded-t-[2.5rem] h-[82vh] border-t border-zinc-900 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-full duration-[600ms] ease-out flex flex-col overflow-hidden"
      >
        
        {/* PERSISTENT HEADER: Balance HUD style */}
        <div className="shrink-0 flex items-center justify-between px-8 py-6 border-b border-zinc-900/50 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-zinc-700 overflow-hidden bg-zinc-900">
              <img src={userProfile.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{userProfile.name}</span>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Status: Claiming</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Coins size={12} className="text-yellow-500/80" />
              <span className="heading-font text-xl font-black tracking-tight text-zinc-100">
                <AnimatedNumber value={headerCoins} />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical size={12} className="text-blue-400/80" />
              <span className="heading-font text-xl font-black tracking-tight text-zinc-100">
                <AnimatedNumber value={headerEnergy} />
              </span>
            </div>
          </div>
        </div>

        {/* Modal Handle & Skip */}
        <div className="shrink-0 flex flex-col items-center pt-3 pb-2 relative">
          <div className="w-10 h-1 bg-zinc-800 rounded-full mb-1 opacity-40" />
          <button 
            onClick={handleSkip}
            className="absolute top-1 right-8 text-zinc-600 hover:text-white transition-colors font-black text-[9px] uppercase tracking-[0.3em] py-2 opacity-60 hover:opacity-100"
          >
            SKIP
          </button>
        </div>

        {/* Reward Reveal Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 relative">
          
          {/* Subtle Dynamic Ambient Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 transition-all duration-1000 ${
              isCoins ? 'bg-yellow-500' : isEnergy ? 'bg-blue-500' : isGems ? 'bg-violet-500' : 'bg-red-500'
            }`} />
          </div>

          {/* Reveal Content Wrapper */}
          <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}>
            
            <div className="mb-10 text-center z-10">
              <h1 className="heading-font text-sm font-black text-zinc-600 tracking-[0.5em] uppercase">
                {isGems ? 'RARE REWARD' : isMatch ? 'BRAWL STATUS' : 'BRAWL REWARDS'}
              </h1>
            </div>

            <div key={currentStep?.type} className="flex flex-col items-center gap-10 relative z-10">
              
              {/* Physical Icon with weighted bounce */}
              <div className={`relative flex items-center justify-center ${contentVisible ? 'animate-reward-bounce' : ''}`}>
                <style>{`
                  @keyframes reward-bounce {
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                    40% { transform: scale(1.08) translateY(-10px); opacity: 1; }
                    70% { transform: scale(0.96) translateY(4px); }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                  }
                  .animate-reward-bounce {
                    animation: reward-bounce 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                  }
                `}</style>

                {isCoins && (
                  <div className="p-7 bg-zinc-900/60 rounded-full border border-yellow-500/20 shadow-lg">
                    <Coins size={100} className="text-yellow-500/90" strokeWidth={1} />
                  </div>
                )}
                
                {isEnergy && (
                  <div className="relative p-7 bg-zinc-900/60 rounded-full border border-blue-500/20 shadow-lg">
                    <FlaskConical size={100} className="text-blue-400/90" strokeWidth={1} />
                    <span className="absolute -top-1 -right-1 text-4xl animate-pulse">✨</span>
                  </div>
                )}
                
                {isGems && (
                  <div className="p-7 bg-zinc-900/60 rounded-full border border-violet-500/20 shadow-lg">
                    <Gem size={100} className="text-violet-500/90" strokeWidth={1} />
                  </div>
                )}

                {isMatch && (
                  <div className="p-7 bg-zinc-900/60 rounded-full border border-zinc-800 shadow-lg">
                    <Activity size={100} className="text-zinc-700" strokeWidth={1} />
                  </div>
                )}
              </div>

              {/* Amount Label */}
              <div className="text-center space-y-3">
                <h2 className={`heading-font text-6xl font-black italic tracking-tighter uppercase leading-none ${
                  isCoins ? 'text-yellow-400' : 
                  isEnergy ? 'text-blue-400' : 
                  isGems ? 'text-violet-400' : 'text-zinc-400'
                }`}>
                  {isMatch ? '' : '+'}{currentStep?.amount} {isMatch ? '' : currentStep?.type}
                </h2>
                {isMatch && (
                   <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">BETTER LUCK NEXT TIME</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA: Appear after 3-second reveal delay */}
        <div className="shrink-0 pb-16 pt-4 flex justify-center z-10 h-28 items-center">
          <button 
            onClick={handleNextStep}
            disabled={!ctaVisible}
            className={`flex items-center gap-3 text-zinc-400 hover:text-white transition-all duration-700 heading-font text-2xl font-black italic uppercase tracking-[0.2em] group active:scale-95 py-4 ${
              ctaVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            {isLastStep ? 'FINISH' : 'COLLECT'}
            <ArrowRight size={24} className="mt-1 transition-transform duration-700 group-hover:translate-x-2 animate-slow-nudge" />
            <style>{`
              @keyframes slow-nudge {
                0%, 100% { transform: translateX(0); opacity: 0.6; }
                50% { transform: translateX(5px); opacity: 1; }
              }
              .animate-slow-nudge {
                animation: slow-nudge 3s infinite ease-in-out;
              }
            `}</style>
          </button>
        </div>

      </div>
    </div>
  );
};
