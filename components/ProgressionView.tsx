import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
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

type RevealPhase = 'IDLE' | 'SHAKING' | 'REVEALED' | 'COLLECTING' | 'FINISHED';

/**
 * MANDATORY VISUAL ASSETS
 * Using 3D high-fidelity renders that match the realistic sports tone.
 */
const BAG_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2855/2855325.png'; // Realistic Sports Kit/Duffel Bag
const COIN_IMAGE = 'https://cdn-icons-png.flaticon.com/512/5434/5434418.png'; // High-quality 3D Metallic Gold Coin
const ENERGY_IMAGE = 'https://cdn-icons-png.flaticon.com/512/1047/1047466.png'; // Realistic 3D Sports Bottle
const GEM_IMAGE = 'https://cdn-icons-png.flaticon.com/512/535/535928.png'; // High-depth 3D Cut Ruby

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  outcome,
  payout,
  energyEarned = 2,
  gemsEarned = 0,
  onNavigate,
}) => {
  const [phase, setPhase] = useState<RevealPhase>('IDLE');
  const [rewardIndex, setRewardIndex] = useState(0);
  const [showCollectCta, setShowCollectCta] = useState(false);

  // Construct reward sequence based on earnings
  const rewardsSequence = useMemo(() => {
    const list = [];
    if (payout > 0) list.push({ type: 'COINS', amount: payout, img: COIN_IMAGE, color: 'text-yellow-400' });
    if (energyEarned > 0) list.push({ type: 'ENERGY', amount: energyEarned, img: ENERGY_IMAGE, color: 'text-blue-400' });
    if (gemsEarned > 0) list.push({ type: 'GEMS', amount: gemsEarned, img: GEM_IMAGE, color: 'text-violet-400' });
    return list;
  }, [payout, energyEarned, gemsEarned]);

  const currentReward = rewardsSequence[rewardIndex];

  useEffect(() => {
    if (rewardsSequence.length === 0) {
      setPhase('FINISHED');
      return;
    }
    triggerReveal();
  }, [rewardsSequence]);

  const triggerReveal = () => {
    setPhase('SHAKING');
    setShowCollectCta(false);
    
    // Pacing: Intense shake before burst
    setTimeout(() => {
      setPhase('REVEALED');
      // Reward visible for 3s before CTA appears
      setTimeout(() => {
        setShowCollectCta(true);
      }, 3000);
    }, 1200);
  };

  const handleCollect = () => {
    setPhase('COLLECTING');
    setShowCollectCta(false);

    // Collection animation
    setTimeout(() => {
      if (rewardIndex < rewardsSequence.length - 1) {
        setRewardIndex(prev => prev + 1);
        setPhase('IDLE');
        setTimeout(triggerReveal, 500);
      } else {
        setPhase('FINISHED');
      }
    }, 600);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden select-none">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] animate-radial-glow z-0" />

      {/* Main Experience Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center">
        
        {/* Header - Minimal Match Copy */}
        <div className={`mb-12 transition-opacity duration-700 ${phase === 'FINISHED' ? 'opacity-100' : 'opacity-80'}`}>
          <h1 className="heading-font text-6xl font-black italic text-white tracking-tighter uppercase">
            {phase === 'FINISHED' ? 'STASH UPDATED' : 'MATCH COMPLETE'}
          </h1>
        </div>

        {/* The Reveal Stage */}
        <div className="relative w-full h-[400px] flex items-center justify-center">
          
          {/* Cricket Kit Bag (Physical Source) */}
          <div className={`relative z-20 transition-all duration-700 ${phase === 'FINISHED' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            <img 
              src={BAG_IMAGE} 
              className={`w-52 h-52 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${
                phase === 'IDLE' ? 'animate-bag-idle' : 
                phase === 'SHAKING' ? 'animate-bag-shake' : ''
              }`}
              alt="Cricket Kit Bag"
            />
            
            {/* Particles Bursting from Bag */}
            {phase === 'REVEALED' && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-particle-burst"
                    style={{
                      '--tw-translate-x': `${(Math.random() - 0.5) * 500}px`,
                      '--tw-translate-y': `${(Math.random() - 0.5) * 500}px`,
                      animationDelay: `${Math.random() * 0.15}s`
                    } as any}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Current Reward (3D Hero Element) - Layered IN FRONT of Bag */}
          {currentReward && (phase === 'REVEALED' || phase === 'COLLECTING') && (
            <div className={`absolute z-30 flex flex-col items-center gap-6 ${phase === 'COLLECTING' ? 'animate-reward-collect' : 'animate-reward-reveal'}`}>
               <div className="relative group">
                  <img 
                    src={currentReward.img} 
                    className="w-40 h-40 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform" 
                    alt="Physical Reward" 
                  />
                  {/* Subtle Shimmer for 3D depth */}
                  <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-50 animate-pulse pointer-events-none" />
               </div>
               <div className="space-y-1">
                  <h2 className={`heading-font text-7xl font-black italic tracking-tighter ${currentReward.color} drop-shadow-2xl`}>
                    +{currentReward.amount}
                  </h2>
                  <p className="text-[14px] font-black text-white/50 uppercase tracking-[0.5em]">
                    {currentReward.type}
                  </p>
               </div>
            </div>
          )}

          {/* Final State Summary */}
          {phase === 'FINISHED' && (
            <div className="animate-in zoom-in fade-in duration-700 flex flex-col items-center gap-8">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                 <Sparkles className="text-white" size={36} />
              </div>
              <div className="space-y-4">
                 <div className="flex gap-4">
                    {rewardsSequence.map((r, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 bg-zinc-900/40 p-5 rounded-[2rem] border border-zinc-800 w-28">
                        <img src={r.img} className="w-12 h-12 object-contain" alt="" />
                        <span className={`heading-font text-3xl font-black ${r.color}`}>{r.amount}</span>
                      </div>
                    ))}
                 </div>
                 <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mt-6">SAFE STORAGE UPDATED</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - CTA as Text Only */}
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
          {showCollectCta && phase === 'REVEALED' && (
            <button 
              onClick={handleCollect}
              className="w-full py-4 text-white heading-font text-4xl font-black italic uppercase tracking-widest transition-all animate-in slide-in-from-bottom-8 duration-500 active:scale-[0.98] hover:text-red-500 drop-shadow-lg"
            >
              COLLECT REWARDS
            </button>
          )}

          {phase === 'FINISHED' && (
            <button 
              onClick={() => onNavigate(AppView.MATCH_STATS)}
              className="w-full py-4 text-zinc-500 hover:text-white heading-font text-2xl font-black italic uppercase tracking-widest transition-all animate-in zoom-in duration-500 active:scale-95 border border-zinc-800 rounded-2xl"
            >
              BACK TO STATS
            </button>
          )}
        </div>

      </div>
    </div>
  );
};