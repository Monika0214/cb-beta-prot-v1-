
import React, { useEffect, useState, useMemo } from 'react';
import { Swords, Loader2, MapPin, Coins, ArrowDownRight } from 'lucide-react';
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
  
  const entryFee = region?.entryFee || 0;
  const targetPool = entryFee * 2;

  const coins = useMemo(() => {
    const particles: CoinParticle[] = [];
    for (let i = 0; i < 6; i++) {
      particles.push({ id: i, side: 'player', delay: i * 0.08 });
      particles.push({ id: i + 10, side: 'opponent', delay: i * 0.08 });
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
      const firstStepDuration = 400;
      const firstStepStart = Date.now();
      
      const animateFirstStep = () => {
        const now = Date.now();
        const progress = Math.min((now - firstStepStart) / firstStepDuration, 1);
        setDisplayPool(Math.floor(progress * entryFee));
        
        if (progress < 1) {
          requestAnimationFrame(animateFirstStep);
        } else {
          setIsPoolPulsing(true);
          setTimeout(() => setIsPoolPulsing(false), 200);
          
          setTimeout(() => {
            const secondStepDuration = 400;
            const secondStepStart = Date.now();
            
            const animateSecondStep = () => {
              const now = Date.now();
              const progress = Math.min((now - secondStepStart) / secondStepDuration, 1);
              setDisplayPool(entryFee + Math.floor(progress * entryFee));
              
              if (progress < 1) {
                requestAnimationFrame(animateSecondStep);
              } else {
                setIsPoolPulsing(true);
                setTimeout(() => setIsPoolPulsing(false), 200);
                setTimeout(() => setShowLabels(false), 400);
              }
            };
            requestAnimationFrame(animateSecondStep);
          }, 150);
        }
      };
      
      const timer = setTimeout(() => {
        requestAnimationFrame(animateFirstStep);
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [poolAnimated, entryFee, targetPool]);

  useEffect(() => {
    if (internalFound) {
      // Increased delay: 2500ms (original) + 4000ms (extra) = 6500ms
      const transitionTimer = setTimeout(() => {
        onStart?.();
      }, 6500); 
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
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 z-10">
        <h2 className="heading-font text-5xl font-black italic tracking-tighter text-red-600">
          MATCH FOUND!
        </h2>
        
        {/* Match Comparison Section */}
        <div className="w-full flex items-center justify-between relative">
          
          {/* Animated Coin Particles */}
          {poolAnimated && coins.map((coin) => (
            <div
              key={coin.id}
              className="absolute z-20 pointer-events-none"
              style={{
                left: coin.side === 'player' ? '15%' : '85%',
                top: '50%',
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0.6)',
                animation: `coin-flow-${coin.side} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${coin.delay}s`
              }}
            >
              <Coins className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" size={24} />
            </div>
          ))}

          <style>{`
            @keyframes coin-flow-player {
              0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { 
                opacity: 0; 
                transform: translate(calc(50vw - 15vw - 64px), 110px) scale(0.35); 
              }
            }
            @keyframes coin-flow-opponent {
              0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { 
                opacity: 0; 
                transform: translate(calc(-50vw + 15vw + 64px), 110px) scale(0.35); 
              }
            }
          `}</style>

          {/* Player */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-24 h-24 rounded-full border-4 border-white p-1 bg-zinc-900 shadow-2xl overflow-hidden relative">
              <img src={PLAYER_AVATAR} className="w-full h-full rounded-full object-cover" alt="User" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
              )}
            </div>
            
            {/* Entry Fee Label */}
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-300 ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2'}`}>
              <Coins size={10} className="text-yellow-500" />
              <span className="heading-font text-sm font-black text-yellow-500 tracking-tighter">-{entryFee}</span>
            </div>

            <div className="text-center">
              <p className="heading-font text-xl font-bold text-white uppercase leading-none">PlayerOne</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. 5</p>
            </div>
          </div>

          <div className="heading-font text-4xl font-black text-zinc-800 italic relative z-10">VS</div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-24 h-24 rounded-full border-4 border-red-600 p-1 bg-zinc-900 shadow-2xl overflow-hidden relative">
              <img src={opponent?.avatar} className="w-full h-full rounded-full object-cover" alt="Opponent" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Entry Fee Label */}
            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-300 ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2'}`}>
              <Coins size={10} className="text-yellow-500" />
              <span className="heading-font text-sm font-black text-yellow-500 tracking-tighter">-{entryFee}</span>
            </div>

            <div className="text-center">
              <p className="heading-font text-xl font-bold text-red-500 uppercase leading-none">{opponent?.name}</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. {opponent?.level}</p>
            </div>
          </div>
        </div>

        {/* REPOSITIONED: Pool Formation Overlay (DIRECTLY BELOW PLAYERS) */}
        <div className={`w-full max-w-xs transition-all duration-700 transform ${poolAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <div className={`flex flex-col items-center gap-2 bg-yellow-600/20 border border-yellow-500/50 px-8 py-4 rounded-[2rem] shadow-[0_0_40px_rgba(234,179,8,0.2)] transition-all duration-300 ${isPoolPulsing ? 'scale-105 shadow-[0_0_60px_rgba(234,179,8,0.4)] border-yellow-400' : ''}`}>
              <div className="flex items-center gap-3">
                 <Coins size={24} className={`text-yellow-500 ${isPoolPulsing ? 'animate-bounce' : ''}`} />
                 <span className="heading-font text-4xl font-black text-white italic leading-none tracking-tight">
                    POOL: {displayPool}
                 </span>
              </div>
              <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Stakes Locked & Irreversible</p>
           </div>
        </div>

        {/* Arena details card - Bottom-aligned with Pool */}
        <div className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-600">
               <MapPin size={18} />
             </div>
             <div className="text-left">
               <p className="text-[8px] font-black text-zinc-500 uppercase">Arena</p>
               <p className="text-sm font-bold text-white uppercase tracking-wider">{region?.name}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-zinc-500 uppercase">Match ID</p>
             <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
               #BRWL-2025-X
             </p>
          </div>
        </div>
      </div>
      
      <div className="p-8 pb-12 text-center opacity-40">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          ENTERING ARENA...
        </p>
      </div>
    </div>
  );
};
