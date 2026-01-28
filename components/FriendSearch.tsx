
import React, { useState } from 'react';
import { ArrowLeft, Search, UserPlus, Check, Loader2 } from 'lucide-react';
import { AppView } from '../types';

interface FriendSearchProps {
  onBack: () => void;
  onOpenProfile: (user: any) => void;
}

export const FriendSearch: React.FC<FriendSearchProps> = ({ onBack, onOpenProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      setResults([
        { id: 's1', name: 'DragonSlayer', level: 45, status: 'Online', relationship: 'None' },
        { id: 's2', name: 'MasterMind_01', level: 22, status: 'Offline', relationship: 'Requested' },
        { id: 's3', name: 'CricketFanatic', level: 67, status: 'In Match', relationship: 'Friend' },
      ]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="p-4 border-b border-zinc-900 bg-black/95 backdrop-blur-md sticky top-0 z-10 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white active:scale-95 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input 
            type="text"
            autoFocus
            placeholder="Username or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-white uppercase outline-none transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        </form>
      </header>

      {/* Results */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {isSearching ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
            <Loader2 size={32} className="animate-spin text-red-600" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Searching Arena...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <div 
              key={user.id}
              onClick={() => onOpenProfile({ userId: user.id, name: user.name, level: user.level, isFriend: user.relationship === 'Friend' })}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={`https://picsum.photos/seed/${user.name}/100/100`} className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                    user.status === 'Online' ? 'bg-emerald-500' : user.status === 'In Match' ? 'bg-yellow-500' : 'bg-zinc-600'
                  }`} />
                </div>
                <div>
                  <h4 className="heading-font text-xl font-black italic text-white uppercase leading-none">{user.name}</h4>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">LV.{user.level} • {user.status}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  user.relationship === 'None' 
                    ? 'bg-red-600 border-red-400 text-white shadow-lg' 
                    : user.relationship === 'Requested'
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    : 'bg-emerald-600/10 border-emerald-500/20 text-emerald-500'
                }`}
              >
                {user.relationship === 'None' ? (
                  <>
                    <UserPlus size={14} />
                    Add Friend
                  </>
                ) : user.relationship === 'Requested' ? (
                  'Requested'
                ) : (
                  <>
                    <Check size={14} />
                    Friends
                  </>
                )}
              </button>
            </div>
          ))
        ) : searchQuery && !isSearching ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-30">
            <Search size={48} className="text-zinc-800" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Players Found</p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 opacity-20">
            <UserPlus size={48} className="text-zinc-800" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center max-w-[200px]">
              Search by username or ID to grow your squad
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
