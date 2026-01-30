
import React from 'react';
import { CheckCircle2, Coins, Gem, Target } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  current: number;
  total: number;
  xp: number;
  gems?: number;
}

const MOCK_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Win 3 matches today', current: 1, total: 3, xp: 150 },
  { id: 'm2', title: 'Play 5 matches', current: 3, total: 5, xp: 100 },
  { id: 'm3', title: 'Use 3 different cards', current: 3, total: 3, xp: 50, gems: 10 },
  { id: 'm4', title: 'Win 2 matches in a row', current: 0, total: 2, xp: 100, gems: 15 },
  { id: 'm5', title: 'Trigger card abilities 3 times', current: 2, total: 3, xp: 75 },
  { id: 'm6', title: 'Upgrade any card once', current: 0, total: 1, xp: 50, gems: 20 },
];

export const DailyMissions: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Target size={14} className="text-red-500" />
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">DAILY RESET IN 14H 22M</span>
      </div>

      {MOCK_MISSIONS.map((mission) => {
        const isCompleted = mission.current >= mission.total;
        const progress = (mission.current / mission.total) * 100;

        return (
          <div 
            key={mission.id}
            className={`relative p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between overflow-hidden ${
              isCompleted 
                ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                : 'bg-zinc-900/60 border-zinc-800'
            }`}
          >
            {/* Mission Info & Progress */}
            <div className="flex-1 space-y-3 mr-4">
              <div className="flex items-center gap-2">
                {isCompleted && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                <h4 className={`text-xs font-bold uppercase tracking-tight leading-tight ${isCompleted ? 'text-emerald-500' : 'text-zinc-100'}`}>
                  {mission.title}
                </h4>
              </div>

              <div className="space-y-1.5">
                <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : 'bg-red-600'}`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center px-0.5">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-zinc-600'}`}>
                    Progress
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${isCompleted ? 'text-emerald-500' : 'text-zinc-400'}`}>
                    {mission.current} / {mission.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Pill */}
            <div className={`flex flex-col items-end gap-1 shrink-0 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
               <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800/50 shadow-inner">
                  <Coins size={10} className="text-amber-500" />
                  <span className="heading-font text-[14px] font-black text-white italic">+{mission.xp}</span>
               </div>
               {mission.gems && (
                 <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800/50 shadow-inner">
                    <Gem size={10} className="text-violet-500" fill="currentColor" />
                    <span className="heading-font text-[14px] font-black text-white italic">+{mission.gems}</span>
                 </div>
               )}
            </div>

            {/* Completed Overlay Checkmark */}
            {isCompleted && (
              <div className="absolute -right-2 -top-2 opacity-5 pointer-events-none">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
