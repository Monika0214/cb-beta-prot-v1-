import React from 'react';

interface RankPillProps {
  rank: number;
  onClick: (e: React.MouseEvent) => void;
}

export const RankPill: React.FC<RankPillProps> = ({ rank, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-center w-[22px] h-[22px] bg-amber-500 border border-amber-400 rounded-full cursor-pointer btn-press shadow-[0_0_12px_rgba(245,158,11,0.8)] active:scale-90 transition-all shrink-0 relative overflow-hidden animate-yellow-glow"
    >
      {/* Glossy highlight layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="flex flex-col items-center justify-center leading-none mt-[0.5px]">
        <span className="heading-font text-[11px] font-black text-black italic z-10">
          {rank}
        </span>
      </div>
    </div>
  );
};