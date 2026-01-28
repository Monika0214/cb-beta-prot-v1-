
import React, { useState } from 'react';
import { Swords, UserPlus, Check, X, Search } from 'lucide-react';
import { AppView } from '../types';

interface FriendsProps {
  onNavigate: (view: AppView, params?: any) => void;
}

export const Friends: React.FC<FriendsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  const friendsList = [
    { id: 'f1', name: 'SkyWalker', lv: 42, status: 'Online' },
    { id: 'f2', name: 'BattingMachine', lv: 35, status: 'In Match' },
    { id: 'f3', name: 'DhoniFan07', lv: 88, status: 'Online' },
    { id: 'f4', name: 'RedFury', lv: 12, status: 'Offline' },
  ];

  const requestsList = [
    { id: 'r1', name: 'ShadowHunter', lv: 21 },
    { id: 'r2', name: 'MasterBlaster', lv: 67 }
  ];

  return (
    <div className="flex flex-col gap-4 px-4 pb-20">
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all ${
            activeTab === 'friends' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          My Friends
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 rounded-lg heading-font text-lg font-bold transition-all ${
            activeTab === 'requests' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Requests ({requestsList.length})
        </button>
      </div>

      <div className="space-y-3">
        {activeTab === 'friends' ? (
          <>
            <button 
              onClick={() => onNavigate(AppView.SEARCH_FRIENDS)}
              className="w-full bg-zinc-900 border border-dashed border-zinc-700 p-4 rounded-xl flex items-center justify-center gap-3 text-zinc-500 hover:text-white hover:border-red-600 transition-all mb-4 group"
            >
              <UserPlus size={18} className="group-hover:text-red-600" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add New Friend</span>
            </button>
            {friendsList.map((f) => (
              <div 
                key={f.id} 
                onClick={() => onNavigate(AppView.PLAYER_PROFILE, { userId: f.id, name: f.name, level: f.lv, isFriend: true })}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                   <div className="relative">
                     <img src={`https://picsum.photos/seed/${f.name}/100/100`} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800" />
                     <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                       f.status === 'Online' ? 'bg-emerald-500' : f.status === 'In Match' ? 'bg-yellow-500' : 'bg-zinc-600'
                     }`} />
                   </div>
                   <div>
                     <h4 className="heading-font text-xl font-black italic text-white uppercase leading-none">{f.name}</h4>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">LV.{f.lv} • {f.status}</p>
                   </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Challenge logic
                  }}
                  className={`p-2.5 rounded-xl transition-all ${
                  f.status === 'Online' ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-800 text-zinc-700 cursor-not-allowed border border-zinc-700'
                }`}>
                  <Swords size={20} />
                </button>
              </div>
            ))}
          </>
        ) : (
          requestsList.map((r) => (
            <div 
              key={r.id} 
              onClick={() => onNavigate(AppView.PLAYER_PROFILE, { userId: r.id, name: r.name, level: r.lv, isFriend: false })}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all hover:border-zinc-700"
            >
               <div className="flex items-center gap-3">
                  <img src={`https://picsum.photos/seed/${r.name}/100/100`} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800" />
                  <div>
                    <h4 className="heading-font text-xl font-black italic text-white uppercase leading-none">{r.name}</h4>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">LV.{r.lv}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button className="p-2 bg-emerald-600/10 text-emerald-500 rounded-xl border border-emerald-500/20 hover:bg-emerald-600/20 transition-colors">
                   <Check size={20} />
                 </button>
                 <button className="p-2 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600/20 transition-colors">
                   <X size={20} />
                 </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
