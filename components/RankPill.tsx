
import React from 'react';
import { Medal } from 'lucide-react';

interface RankPillProps {
  rank: number;
  onClick: () => void;
}

export const RankPill: React.FC<RankPillProps> = ({ rank, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center h-[28px] bg-zinc-900 border border-amber-500/40 rounded-full px-3 gap-2 cursor-pointer btn-press shadow-lg group relative overflow-hidden active:scale-95 transition-all"
    >
      {/* Premium subtle gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      
      <Medal size={11} className="text-amber-500 relative z-10 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
      <span className="heading-font text-[12px] font-black text-white italic tracking-tighter relative z-10 leading-none">
        LV {rank}
      </span>
    </button>
  );
};
