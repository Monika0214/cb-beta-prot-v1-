
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
  const [isPoolPulsing, setIsPoolPulsing] = useState(false);
  
  const entryFee = region?.entryFee || 0;

  // Generate coin particles for both sides
  const coins = useMemo(() => {
    const particles: CoinParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push({ id: i, side: 'player', delay: i * 0.1 });
      particles.push({ id: i + 100, side: 'opponent', delay: i * 0.1 });
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
      
      // Short delay before the pool UI appears and starts filling
      setTimeout(() => setPoolAnimated(true), 500);
    }, 1200);

    return () => clearTimeout(searchTimer);
  }, [region, onDeductFee, internalFound]);

  useEffect(() => {
    if (poolAnimated) {
      // Step 1: Player's coins entry
      const firstStepDuration = 1000;
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
          
          // Step 2: Opponent's coins entry (slight delay)
          setTimeout(() => {
            const secondStepDuration = 1000;
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
              }
            };
            requestAnimationFrame(animateSecondStep);
          }, 400);
        }
      };
      
      const timer = setTimeout(() => {
        requestAnimationFrame(animateFirstStep);
      }, 300); 

      return () => clearTimeout(timer);
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
      
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 z-10">
        <h2 className="heading-font text-5xl font-black italic tracking-tighter text-red-600 uppercase">
          Match Found!
        </h2>
        
        {/* AVATAR & VS ROW */}
        <div className="w-full flex items-center justify-between relative min-h-[160px] z-20">
          
          {/* Player Identity */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className={`w-24 h-24 rounded-full border-4 transition-all duration-500 p-1 bg-zinc-900 shadow-2xl overflow-hidden relative ${poolAnimated ? 'border-yellow-500 scale-105' : 'border-white'}`}>
              <img src={PLAYER_AVATAR} className="w-full h-full rounded-full object-cover" alt="User" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
              )}
            </div>
            
            {/* Player Coin Spawner: Rooted to the bottom of the avatar ring */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 pointer-events-none">
              {poolAnimated && coins.filter(c => c.side === 'player').map((coin) => (
                <div
                  key={coin.id}
                  className="absolute"
                  style={{
                    animation: `coin-converge-left 1s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    animationDelay: `${coin.delay}s`,
                    opacity: 0
                  }}
                >
                  <Coins className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" size={18} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="heading-font text-xl font-bold text-white uppercase leading-none">PlayerOne</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. 5</p>
            </div>
          </div>

          <div className="heading-font text-4xl font-black text-zinc-800 italic relative z-10">VS</div>

          {/* Opponent Identity */}
          <div className="flex flex-col items-center gap-3 relative">
            <div className={`w-24 h-24 rounded-full border-4 transition-all duration-500 p-1 bg-zinc-900 shadow-2xl overflow-hidden relative ${poolAnimated ? 'border-yellow-500 scale-105' : 'border-red-600'}`}>
              <img src={opponent?.avatar} className="w-full h-full rounded-full object-cover" alt="Opponent" />
              {poolAnimated && (
                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Opponent Coin Spawner: Rooted to the bottom of the avatar ring */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 pointer-events-none">
              {poolAnimated && coins.filter(c => c.side === 'opponent').map((coin) => (
                <div
                  key={coin.id}
                  className="absolute"
                  style={{
                    animation: `coin-converge-right 1s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    animationDelay: `${coin.delay + 1.2}s`,
                    opacity: 0
                  }}
                >
                  <Coins className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" size={18} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="heading-font text-xl font-bold text-red-500 uppercase leading-none">{opponent?.name.split('_')[0]}</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase mt-1 tracking-widest">LV. {opponent?.level}</p>
            </div>
          </div>
        </div>

        {/* POOL UI BOX */}
        <div className={`w-full max-w-xs transition-all duration-700 transform ${poolAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} relative z-30`}>
           <div 
             className={`flex flex-col items-center justify-center gap-2 bg-zinc-900/80 border border-yellow-500/30 px-8 py-6 rounded-[3rem] shadow-[0_0_50px_rgba(234,179,8,0.1)] transition-all duration-300 ${isPoolPulsing ? 'scale-105 shadow-[0_0_70px_rgba(234,179,8,0.4)] border-yellow-400 brightness-110' : ''} relative overflow-hidden min-h-[140px]`}
           >
              {/* Pool Content Overlay */}
              <div className="flex flex-col items-center gap-1 relative z-30">
                 <div className="flex items-center gap-3">
                   <div className="relative">
                    <Coins size={36} className={`text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] ${isPoolPulsing ? 'scale-125' : ''} transition-transform duration-200`} />
                    {isPoolPulsing && (
                      <div className="absolute inset-0 bg-white/30 blur-lg rounded-full animate-ping" />
                    )}
                   </div>
                   <span className="heading-font text-5xl font-black text-white italic leading-none tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      POOL: {displayPool}
                   </span>
                 </div>
                 <p className="text-[11px] font-black text-yellow-500/90 uppercase tracking-[0.3em] drop-shadow-md">Stakes Locked & Final</p>
              </div>

              {/* Backglow inside pool */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none opacity-40" />
           </div>
        </div>

        {/* CONVERGING COIN ANIMATIONS */}
        <style>{`
          @keyframes coin-converge-left {
            0% { 
              opacity: 0; 
              transform: translate(0, 0) scale(0.6) rotate(0deg); 
            }
            15% { 
              opacity: 1; 
            }
            85% { 
              opacity: 1; 
            }
            100% { 
              opacity: 0; 
              transform: translate(110px, 150px) scale(0.4) rotate(120deg); 
            }
          }

          @keyframes coin-converge-right {
            0% { 
              opacity: 0; 
              transform: translate(0, 0) scale(0.6) rotate(0deg); 
            }
            15% { 
              opacity: 1; 
            }
            85% { 
              opacity: 1; 
            }
            100% { 
              opacity: 0; 
              transform: translate(-110px, 150px) scale(0.4) rotate(-120deg); 
            }
          }
        `}</style>

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
