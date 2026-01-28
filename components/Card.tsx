import React, { useState, useEffect } from 'react';
import { PlayerCard } from '../types';
import { Lock, Check, Sparkles } from 'lucide-react';

interface CardProps {
  card: PlayerCard;
  className?: string;
  style?: React.CSSProperties;
  isLocked?: boolean;
  progressionState?: 'unlocked' | 'next' | 'locked';
  stage?: number;
  minimal?: boolean;
  showSparkle?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=400&h=600';

const memoryCache: Record<string, string> = {};
let lastRequestTime = 0;
const REQUEST_INTERVAL = 200;

export const Card: React.FC<CardProps> = ({ 
  card, 
  className = "", 
  style, 
  isLocked = false,
  progressionState,
  stage = 0,
  minimal = false,
  showSparkle = false
}) => {
  const [imgSrc, setImgSrc] = useState<string>(card.image || FALLBACK_IMAGE);

  useEffect(() => {
    let isMounted = true;
    const playerName = card.name;

    const resolvePlayerImage = async () => {
      if (memoryCache[playerName]) {
        setImgSrc(memoryCache[playerName]);
        return;
      }

      const cacheKey = `cb_wiki_img_${playerName.replace(/\s+/g, '_')}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { url, ts } = JSON.parse(cached);
          const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - ts < SEVEN_DAYS) {
            memoryCache[playerName] = url;
            setImgSrc(url);
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      const now = Date.now();
      const timeToWait = Math.max(0, lastRequestTime + REQUEST_INTERVAL - now);
      lastRequestTime = now + timeToWait;
      
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }

      try {
        const apiTitle = playerName === 'S. Tendulkar' ? 'Sachin Tendulkar' : playerName;
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(apiTitle)}&pithumbsize=400&pilicense=free&format=json&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const pages = data?.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          const source = page?.thumbnail?.source;
          
          if (source && isMounted) {
            memoryCache[playerName] = source;
            localStorage.setItem(cacheKey, JSON.stringify({ url: source, ts: Date.now() }));
            setImgSrc(source);
          }
        }
      } catch (err) {
        console.warn(`Could not load Wikipedia image for ${playerName}, using fallback.`);
      }
    };

    resolvePlayerImage();
    return () => { isMounted = false; };
  }, [card.name]);

  const effectiveIsLocked = progressionState === 'locked' || isLocked;
  const isUnlockedBW = progressionState === 'unlocked';
  const isNextUnlock = progressionState === 'next';

  const rarityColors = {
    Legendary: effectiveIsLocked ? 'border-zinc-800' : 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    Epic: effectiveIsLocked ? 'border-zinc-800' : 'border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)]',
    Rare: effectiveIsLocked ? 'border-zinc-800' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    Common: 'border-zinc-700 shadow-none'
  };

  const nextGlow = isNextUnlock ? 'shadow-[0_0_40px_rgba(220,38,38,0.7)] border-red-500 ring-2 ring-red-500/50 scale-105' : '';
  const bwStyle = isUnlockedBW ? 'grayscale contrast-75 brightness-75' : '';
  const lockedStyle = effectiveIsLocked ? 'grayscale brightness-[0.2] border-zinc-800' : '';

  // Evolutionary Visuals
  const stageGlow = stage >= 1 ? 'shadow-[0_0_30px_rgba(220,38,38,0.4)]' : '';
  const stageBorder = stage >= 3 ? 'animate-shimmer border-red-500' : '';

  return (
    <div 
      className={`relative aspect-[3/4.2] bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all flex flex-col ${rarityColors[card.rarity || 'Common']} ${className} ${bwStyle} ${lockedStyle} ${nextGlow} ${stageGlow} ${stageBorder}`}
      style={style}
    >
      {/* EVOLUTIONARY AURAS */}
      {stage >= 2 && (
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent animate-pulse pointer-events-none z-[5]" />
      )}
      {stage >= 4 && (
        <div className="absolute inset-0 z-[6] pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-white/5 to-red-600/10 animate-shimmer" />
        </div>
      )}

      {/* PERSISTENT SPARKLE OVERLAY (ONLY FOR UPGRADED CARDS) */}
      {showSparkle && stage > 0 && !effectiveIsLocked && (
        <>
          <div className="sparkle-layer" />
          <div className="sparkle-layer sparkle-layer-stagger" />
        </>
      )}

      {/* LOCKED PULSE GLOW */}
      {effectiveIsLocked && (
        <div className="absolute inset-0 border-2 border-red-600/10 rounded-xl animate-pulse pointer-events-none shadow-[inset_0_0_30px_rgba(220,38,38,0.15)]" />
      )}

      {/* NEXT UNLOCK AURORA */}
      {isNextUnlock && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <img 
        src={imgSrc} 
        alt={card.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
        onError={(e) => { 
          (e.target as HTMLImageElement).src = FALLBACK_IMAGE; 
        }}
      />
      
      {!minimal && (
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-700 shadow-xl flex items-center gap-1">
            <span className="heading-font text-base font-black text-white leading-none">{card.cost}</span>
            <span className="text-[10px] font-black text-yellow-500">⚡</span>
          </div>
          {!effectiveIsLocked && !isUnlockedBW && (
            <div className="bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg border border-red-600/50 shadow-xl flex items-center gap-1">
              <span className="heading-font text-base font-black text-red-500 leading-none">
                {card.runs + (stage * 5)}
              </span>
              <span className="text-[10px] font-black text-white">R</span>
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10 pointer-events-none" />

      {effectiveIsLocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="bg-zinc-950/80 p-3 rounded-full border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Lock size={24} className="text-red-600" />
          </div>
        </div>
      )}

      {isUnlockedBW && (
        <div className="absolute top-2 right-2 z-30 flex items-center justify-center">
          <div className="bg-emerald-600 p-1 rounded-full shadow-lg">
            <Check size={14} className="text-white" />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col items-center justify-end z-20 pointer-events-none">
        <h4 className="heading-font text-xl font-black text-white leading-none uppercase tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,1)] w-full truncate italic">
          {card.name}
        </h4>
        {!minimal && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">
              {card.rarity}
            </span>
            {stage > 0 && (
               <span className="text-[9px] font-black text-red-500 bg-red-600/10 px-1.5 rounded uppercase tracking-tighter">LVL {stage}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};