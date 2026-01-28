import React, { useEffect, useState, useMemo } from 'react';
import { Swords, Loader2, MapPin, Coins } from 'lucide-react';
import { Region } from '../types';

interface MatchmakingProps {
  opponent?: { name: string; level: number; avatar: string; squadPower: number };
  region?: Region;
  onDeductFee?: (amount: number) => void;
  onStart?: () => void;
}

const PLAYER_AVATAR = 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=200&h=200';

interface CoinParticle {
  id: number;
  side: 'player' | 'opponent';
  delay: number;
}

export const Matchmaking: React.FC<MatchmakingProps> = ({ 
  opponent, 
  region, 
  onDeductFee,
  onStart 
}) => {
  const [internalFound, setInternalFound] = useState(false);
  const [poolAnimated, setPoolAnimated] = useState(false);
  const [displayPool, setDisplayPool] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [isPoolPulsing, setIsPoolPulsing] = useState(false);
  const [phase2Triggered, setPhase2Triggered] = useState(false);
  
  const entryFee = region?.entryFee || 0;

  const coins = useMemo(() => {
    const particles: CoinParticle[] = [];
    for (let i = 0; i < 10; i++) {
      particles.push({ id: i, side: 'player', delay: i * 0.08 });
      particles.push({ id: i + 100, side: 'opponent', delay: i * 0.08 });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (internalFound) return;

    const searchTimer = setTimeout(() => {
      setInternalFound(true);
      if (region && onDeductFee) {
        onDeductFee(region.entryFee);
      }
      
      setTimeout(() => {
        setShowLabels(true);
        setTimeout(() => setPoolAnimated(true), 200);
      }, 300);
    }, 800);

    return () => clearTimeout(searchTimer);
  }, [region, onDeductFee, internalFound]);

  useEffect(() => {
    if (poolAnimated) {
      // Phase 2 starts as global coins reach the pool rim
      const p2Timer = setTimeout(() => setPhase2Triggered(true), 600);

      const firstStepDuration = 600;
      const firstStepStart = Date.now();
      
      const animateFirstStep = () => {
        const now = Date.now();
        const progress = Math.min((now - firstStepStart) / firstStepDuration, 1);
        setDisplayPool(Math.floor(progress * entryFee));
        
        if (progress < 1) {
          requestAnimationFrame(animateFirstStep);
        } else {
          setIsPoolPulsing(true);
          setTimeout(() => setIsPoolPulsing(false), 250);
          
          setTimeout(() => {
            const secondStepDuration = 600;
            const secondStepStart = Date.now();
            
            const animateSecondStep = () => {
              const now = Date.now();
              const progress = Math.min((now - secondStepStart) / secondStepDuration, 1);
              setDisplayPool(entryFee + Math.floor(progress * entryFee));
              
              if (progress < 1) {
                requestAnimationFrame(animateSecondStep);
              } else {
                setIsPoolPulsing(true);
                setTimeout(() => setIsPoolPulsing(false), 250);
                setTimeout(() => setShowLabels(false), 400);
              }
            };
            requestAnimationFrame(animateSecondStep);
          }, 150);
        }
      };
      
      const timer = setTimeout(() => {
        requestAnimationFrame(animateFirstStep);
      }, 850); 

      return () => {
        clearTimeout(timer);
        clearTimeout(p2Timer);
      };
    }
  }, [poolAnimated, entryFee]);

  useEffect(() => {
    if (internalFound) {
      const transitionTimer = setTimeout(() => {
        onStart?.();
      }, 7000); 
      return () => clearTimeout(transitionTimer);
    }
  }, [internalFound, onStart]);

  if (!internalFound) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-zinc-950 px-8 text-center animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-red-600/20 flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={48} />
          </div>
          <Swords className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={24} />
        </div>
        
        <div className="space-y-2">
          <h2 className="heading-font text-3xl font-black italic text-white uppercase tracking-wider">Searching for Opponent...</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Querying Arena Servers</p>
        </div>

        <div className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-600">
               <MapPin size={18} />
             </div>
             <div className="text-left">
               <p className="text-[8px] font-black text-zinc-500 uppercase">Selected Arena</p>
               <p className="text-sm font-bold text-white uppercase tracking-wider">{region?.name || 'Mumbai Arena'}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-zinc-500 uppercase">Entry Fee</p>
             <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Coins size={12} />
                <span>{region?.entryFee || 0}</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative">
      
      {/* PHASE 1: GLOBAL COIN LAYER (Travel to the pool edge) */}
      <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
        {poolAnimated && coins.map((coin) => (
          <div
            key={`global-${coin.id}`}
            className="absolute"
            style={{
              left: coin.side === 'player' ? '18%' : '82%',
              top: '30%',
              opacity: 0,
              animation: `coin-travel-to-rim-${coin.side} 0.65s cubic-bezier(0.5, 0, 0.7, 0.4) forwards`,
              animationDelay: `${coin.delay}s`
            }}
          >
            <Coins className="text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,1)]" size={24} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes coin-travel-to-rim-player {
          0% { opacity: 0; transform: translate(0, 0) scale(1) rotate(0deg); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            opacity: 0; 
            transform: translate(calc(50vw - 18vw - 12px), 32vh) scale(0.7) rotate(90deg); 
          }
        }
        @keyframes coin-travel-to-rim-opponent {
          0% { opacity: 0; transform: translate(0, 0) scale(1) rotate(0deg); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            opacity: 0; 
            transform: translate(calc(-50vw + 18vw + 12px), 32vh) scale(0.7) rotate(-90deg); 
          }
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 z-10">
        <h2 className="heading-font text-5xl font-black italic tracking-tighter text-red-600 uppercase">
          Match Found!
        </h2>
        
        <div className="w-full flex items-center justify-between relative min-h-[160px]">
          {/* Player Identity */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-24 h-24 rounded-full border-4 border-white p-1 bg-zinc-900 shadow-2xl overflow-hidden relative">
              <img src={PLAYER_AVATAR} className="w-full h-full rounded-full object-cover" alt="User" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/20 animate-pulse pointer-events-none" />
              )}
            </div>
            <div className="text-center">
              <p className="heading-font text-xl font-bold text-white uppercase leading-none">PlayerOne</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. 5</p>
            </div>
          </div>

          <div className="heading-font text-4xl font-black text-zinc-800 italic relative z-10">VS</div>

          {/* Opponent Identity */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-24 h-24 rounded-full border-4 border-red-600 p-1 bg-zinc-900 shadow-2xl overflow-hidden relative">
              <img src={opponent?.avatar} className="w-full h-full rounded-full object-cover" alt="Opponent" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/20 animate-pulse pointer-events-none" />
              )}
            </div>
            <div className="text-center">
              <p className="heading-font text-xl font-bold text-red-500 uppercase leading-none">{opponent?.name.split('_')[0]}</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. {opponent?.level}</p>
            </div>
          </div>
        </div>

        {/* POOL UI CONTAINER (Strict Clipping Enforced) */}
        <div className={`w-full max-w-xs transition-all duration-700 transform ${poolAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} relative`}>
           <div className={`flex flex-col items-center justify-center gap-2 bg-yellow-600/20 border border-yellow-500/50 px-8 py-6 rounded-[3rem] shadow-[0_0_50px_rgba(234,179,8,0.2)] transition-all duration-300 ${isPoolPulsing ? 'scale-105 shadow-[0_0_70px_rgba(234,179,8,0.4)] border-yellow-400 brightness-110' : ''} relative overflow-hidden min-h-[140px]`}>
              
              {/* Pool Interior Background */}
              <div className="absolute inset-0 bg-zinc-950/70 pointer-events-none z-0" />

              {/* Depth Gradient Mask - Ensures coins "sink" into the pool */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-zinc-950/40" />

              {/* PHASE 2: INTERNAL CLIPPED COINS (Falling and Sinking) */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {phase2Triggered && coins.map((coin) => (
                  <div
                    key={`local-${coin.id}`}
                    className="absolute left-1/2"
                    style={{
                      top: '-15px', // Start exactly at the top rim
                      marginLeft: `${(Math.random() - 0.5) * 40}px`, // Reduced jitter to keep contained
                      opacity: 0,
                      animation: `coin-sink-vertical 0.65s cubic-bezier(0.3, 0.8, 0.4, 1) forwards`,
                      animationDelay: `${coin.delay}s`
                    }}
                  >
                    <Coins className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" size={18} />
                  </div>
                ))}
              </div>

              <style>{`
                @keyframes coin-sink-vertical {
                  0% { 
                    opacity: 0; 
                    transform: translateY(0px) scale(0.8); 
                  }
                  30% { 
                    opacity: 1; 
                  }
                  70% { 
                    opacity: 1; 
                    transform: translateY(40px) scale(0.6); 
                  }
                  100% { 
                    opacity: 0; 
                    transform: translateY(65px) scale(0.4); 
                  }
                }
              `}</style>

              {/* Central Pool Content */}
              <div className="flex flex-col items-center gap-1 relative z-30">
                 <div className="flex items-center gap-3">
                   <Coins size={32} className={`text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] ${isPoolPulsing ? 'scale-125' : ''} transition-transform duration-200`} />
                   <span className="heading-font text-5xl font-black text-white italic leading-none tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      POOL: {displayPool}
                   </span>
                 </div>
                 <p className="text-[11px] font-black text-yellow-500/80 uppercase tracking-[0.3em] drop-shadow-md">Stakes Locked & Final</p>
              </div>
           </div>
        </div>

        {/* Match Context Details */}
        <div className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-600">
               <MapPin size={18} />
             </div>
             <div className="text-left">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Location</p>
               <p className="text-sm font-bold text-white uppercase tracking-wider">{region?.name}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Status</p>
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
               COMMENCING...
             </p>
          </div>
        </div>
      </div>
      
      <div className="p-8 pb-12 text-center opacity-40">
        <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
          ESTABLISHING ARENA CONNECTION
        </p>
      </div>
    </div>
  );
};
