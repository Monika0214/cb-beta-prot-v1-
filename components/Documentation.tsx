
import React from 'react';
// Added missing icon imports: Library, Edit2, and Store as StoreIcon
import { ArrowLeft, Swords, Coins, Zap, Gem, Trophy, Layers, Target, TrendingUp, Users, Shield, Book, ChevronDown, Activity, MapPin, Search, BarChart2, Sparkles, UserPlus, LayoutGrid, Lock, Library, Edit2, Store as StoreIcon } from 'lucide-react';

interface DocumentationProps {
  onBack: () => void;
}

export const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-black animate-in fade-in duration-500 select-text overflow-y-auto no-scrollbar pb-32">
      {/* 1. Header */}
      <header className="sticky top-0 z-[100] bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-6 py-6 flex items-center pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4">
          <h1 className="heading-font text-3xl font-black italic text-white uppercase tracking-tighter leading-none">PAGES FLOWCHART</h1>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mt-1">PRODUCT ARCHITECTURE v1.0.1</p>
        </div>
      </header>

      <div className="p-6 space-y-12">
        
        {/* SECTION: SYSTEM LEGEND */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h2 className="heading-font text-xl font-bold text-zinc-500 uppercase tracking-widest italic">Flow Legend</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Primary Screen</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Secondary View</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-zinc-700" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Popup Overlay</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-zinc-800 border border-dashed border-zinc-600" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Locked State</span>
             </div>
          </div>
        </section>

        {/* SECTION: FULL FLOWCHART */}
        <section className="space-y-12">
          
          {/* HUB 1: HOME & ARENA */}
          <div className="flex flex-col items-center gap-4">
            <FlowItem icon={LayoutGrid} title="HOME (ROOT HUB)" color="bg-red-600" desc="The Central Lobby. Access to all cycles." />
            
            <div className="h-8 w-[2px] bg-zinc-800" />

            <div className="grid grid-cols-2 gap-x-8 w-full max-w-sm">
               <div className="flex flex-col items-center">
                  <FlowItem icon={MapPin} title="ARENA SELECTOR" color="bg-red-600" desc="Choose match stakes." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={Search} title="MATCHMAKING" color="bg-red-600" desc="Wait for opponent." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={Swords} title="GAMEPLAY" color="bg-red-600" desc="Core 6-ball strategy." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={TrendingUp} title="MATCH RESULT" color="bg-zinc-800" desc="Win/Loss Animation." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={Sparkles} title="REWARDS" color="bg-zinc-800" desc="Coin/NRG Claiming." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={BarChart2} title="STATS" color="bg-red-600" desc="Analysis & Exit." />
               </div>

               <div className="flex flex-col items-center">
                  <FlowItem icon={Target} title="MISSIONS" color="bg-zinc-900" isPopup desc="Daily objectives popup." />
                  <div className="h-6 w-[2px] bg-zinc-800" />
                  <FlowItem icon={UserPlus} title="EDIT PROFILE" color="bg-zinc-800" isSub desc="Update avatar/name." />
                  <div className="h-20 w-[2px] bg-zinc-800 border-l border-zinc-800 border-dashed" />
                  <div className="p-3 border border-dashed border-red-600/30 rounded-2xl bg-red-600/5">
                     <p className="text-[8px] font-black text-red-600 uppercase tracking-widest text-center">CORE INTENSITY LOOP</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-zinc-900" />

          {/* HUB 2: META & COLLECTIONS */}
          <div className="flex flex-col items-center gap-4">
             <FlowItem icon={Library} title="COLLECTIONS" color="bg-blue-600" desc="Squad & Player inventory." />
             
             <div className="h-8 w-[2px] bg-zinc-800" />

             <div className="grid grid-cols-2 gap-x-8 w-full max-w-sm">
                <div className="flex flex-col items-center grayscale">
                   <FlowItem icon={Users} title="PLAYERS TAB" color="bg-zinc-800" desc="LOCKED: Out of scope." isSub />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Layers} title="CARD PREVIEW" color="bg-blue-600" desc="Detailed stats & lore." isSub />
                </div>

                <div className="flex flex-col items-center">
                   <FlowItem icon={Shield} title="SQUADS TAB" color="bg-blue-600" desc="Active line-up manager." isSub />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Edit2} title="EDIT SQUAD" color="bg-blue-600" desc="Swap cards & identities." isSub />
                </div>
             </div>
          </div>

          <div className="w-full h-[1px] bg-zinc-900" />

          {/* HUB 3: SOCIAL & PROGRESSION */}
          <div className="flex flex-col items-center gap-4">
             <div className="grid grid-cols-2 gap-x-8 w-full max-w-sm">
                <div className="flex flex-col items-center">
                   <FlowItem icon={Users} title="FRIENDS" color="bg-blue-600" desc="Friend list & requests." />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Search} title="FRIEND SEARCH" color="bg-blue-600" desc="Find arena users." isSub />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Activity} title="PLAYER PROFILE" color="bg-zinc-800" desc="Public stats comparison." isSub />
                </div>

                <div className="flex flex-col items-center">
                   <FlowItem icon={Trophy} title="LEADERBOARD" color="bg-blue-600" desc="Global rankings." />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Zap} title="LEVEL PROG." color="bg-zinc-800" desc="Rewards pass system." isSub />
                   <div className="h-6 w-[2px] bg-zinc-800" />
                   <FlowItem icon={Shield} title="RANK PROG." color="bg-zinc-800" desc="Arena tier rewards." isSub />
                </div>
             </div>
          </div>

          <div className="w-full h-[1px] bg-zinc-900" />

          {/* HUB 4: STORE (LOCKED) */}
          <div className="flex flex-col items-center gap-4 opacity-50">
             <div className="relative group">
                <FlowItem icon={StoreIcon} title="STORE" color="bg-zinc-900" desc="LOCKED: Out of scope." />
                <div className="absolute inset-0 border border-dashed border-red-600/30 rounded-3xl pointer-events-none" />
                <div className="absolute -top-3 -right-3 bg-red-600 text-[8px] font-black px-2 py-0.5 rounded shadow-lg border border-red-400/20">LOCKED</div>
             </div>
          </div>

        </section>

      </div>

      {/* 3. Footer Branding */}
      <footer className="mt-auto px-6 py-12 flex flex-col items-center gap-4 opacity-30 border-t border-zinc-900">
         <Book size={32} className="text-zinc-800" />
         <div className="text-center">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">SITEMAP ARCHITECTURE</p>
            <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest mt-1">NEXUS STUDIOS CRICKET BRAWL DEPT.</p>
         </div>
      </footer>
    </div>
  );
};

/* Mini Helper Component for Flowchart Nodes */
const FlowItem: React.FC<{ 
  icon: React.ElementType, 
  title: string, 
  color: string, 
  isSub?: boolean, 
  isPopup?: boolean, 
  desc?: string 
}> = ({ icon: Icon, title, color, isSub, isPopup, desc }) => (
  <div className={`flex flex-col items-center w-36 ${isSub ? 'scale-90' : ''}`}>
    <div className={`w-full aspect-[16/10] ${color} ${isPopup ? 'rounded-[1.5rem]' : 'rounded-3xl'} flex flex-col items-center justify-center gap-2 p-3 border border-white/10 shadow-2xl relative`}>
       <Icon size={isSub ? 16 : 20} className="text-white drop-shadow-sm" />
       <span className="heading-font text-[10px] font-black text-white text-center leading-none tracking-tighter uppercase truncate w-full">{title}</span>
       {isPopup && <div className="absolute -bottom-1 w-4 h-1 bg-zinc-950 rounded-full" />}
    </div>
    {desc && (
      <p className="mt-2 text-[7px] font-bold text-zinc-600 uppercase tracking-widest leading-tight text-center px-1">
        {desc}
      </p>
    )}
  </div>
);
