
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { PostMatchRewards } from './PostMatchRewards';

interface MatchResultProps {
  outcome: 'victory' | 'defeat' | 'draw' | 'declared';
  payout: number;
  energyReward: number;
  gemReward: number;
  onNavigate: (view: AppView) => void;
  onBack?: () => void;
  userProfile: any;
}

export const MatchResult: React.FC<MatchResultProps> = ({ 
  outcome, 
  payout, 
  energyReward, 
  gemReward, 
  onNavigate,
  userProfile
}) => {
  const [phase, setPhase] = useState<'animating' | 'ready'>('animating');
  const [showRewardsOverlay, setShowRewardsOverlay] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setPhase('ready');
    }, 800);

    const rewardTimer = setTimeout(() => {
      setShowRewardsOverlay(true);
    }, 1500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(rewardTimer);
    };
  }, []);

  const resultData = {
    victory: {
      title: 'YOU WON',
      sub: 'Dominance Established',
      color: 'text-emerald-500',
      streak: 'bg-emerald-500/10',
      aniClass: 'win-swoop'
    },
    defeat: {
      title: 'YOU LOST',
      sub: 'Try a Different Strategy',
      color: 'text-red-600',
      streak: 'bg-red-600/10',
      aniClass: 'loss-swoop'
    },
    draw: {
      title: 'MATCH TIED',
      sub: 'A Hard-Fought Deadlock',
      color: 'text-blue-500',
      streak: 'bg-blue-500/10',
      aniClass: 'tie-swoop'
    },
    declared: {
      title: 'MATCH DECLARED',
      sub: 'Tactical Retreat Successful',
      color: 'text-yellow-500',
      streak: 'bg-yellow-500/10',
      aniClass: 'dec-swoop'
    }
  }[outcome];

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden px-8 select-none">
      
      <div 
        className={`absolute inset-y-0 w-full ${resultData.streak} skew-x-[-20deg] ${resultData.aniClass}-streak z-0 pointer-events-none`} 
      />
      
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-1.5 h-1.5 bg-white rounded-full ${resultData.aniClass}-sparkle`}
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: '100%',
              animationDelay: `${Math.random() * 0.4}s`,
              opacity: 0
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes swoop-entry-bounce {
          0% { transform: translateX(100vw) scale(1.2); opacity: 0; }
          70% { transform: translateX(-10vw) scale(1.1); opacity: 1; }
          90% { transform: translateX(2vw) scale(0.98); }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes swoop-entry-heavy {
          0% { transform: translateX(100vw) scale(1.4); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes streak-swoop {
          0% { transform: translateX(100vw) skewX(-20deg); }
          100% { transform: translateX(-200vw) skewX(-20deg); }
        }
        @keyframes sparkle-fly {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateX(-200vw); opacity: 0; }
        }
        .win-swoop { animation: swoop-entry-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .loss-swoop { animation: swoop-entry-heavy 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .tie-swoop { animation: swoop-entry-bounce 0.8s ease-out forwards; }
        .dec-swoop { animation: swoop-entry-bounce 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        .win-swoop-streak { animation: streak-swoop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .loss-swoop-streak { animation: streak-swoop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .tie-swoop-streak { animation: streak-swoop 0.8s ease-out forwards; }
        .dec-swoop-streak { animation: streak-swoop 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        .win-swoop-sparkle { animation: sparkle-fly 1.2s ease-out forwards; }
        .loss-swoop-sparkle { animation: sparkle-fly 1.2s ease-out forwards; }
        .tie-swoop-sparkle { animation: sparkle-fly 1.2s ease-out forwards; }
        .dec-swoop-sparkle { animation: sparkle-fly 1.2s ease-out forwards; }
      `}</style>

      <div className={`text-center z-20 space-y-4 mb-24 pointer-events-none transition-all duration-700 ${showRewardsOverlay ? 'opacity-20 scale-95 blur-[2px]' : 'opacity-100 scale-100'}`}>
        <h1 className={`heading-font text-8xl font-black italic tracking-tighter leading-none ${resultData.color} ${resultData.aniClass}`}>
          {resultData.title}
        </h1>
        <p className={`text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] transition-opacity duration-700 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          {resultData.sub}
        </p>
      </div>

      {outcome === 'defeat' && !showRewardsOverlay && (
        <div className={`absolute inset-0 bg-black/40 pointer-events-none z-10 transition-opacity duration-1000 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`} />
      )}

      {showRewardsOverlay && (
        <PostMatchRewards 
          payout={payout}
          energyEarned={energyReward}
          gemsEarned={gemReward}
          userProfile={userProfile}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
