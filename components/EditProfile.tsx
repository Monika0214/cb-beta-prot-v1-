import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Lock, Edit2, Shield, User } from 'lucide-react';

interface EditProfileProps {
  user: {
    name: string;
    avatar: string;
    level: number;
    lastUsernameChange: number;
  };
  onBack: () => void;
  onUpdateProfile: (updates: { name?: string; avatar?: string; lastUsernameChange?: number }) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1540747913346-19e3adcc174b?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=300&h=300',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Luna',
];

const USERNAME_COOLDOWN_DAYS = 30;
const USERNAME_COOLDOWN_MS = USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export const EditProfile: React.FC<EditProfileProps> = ({ user, onBack, onUpdateProfile }) => {
  const [tempName, setTempName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);

  const cooldownRemainingMs = user.lastUsernameChange ? (user.lastUsernameChange + USERNAME_COOLDOWN_MS) - Date.now() : 0;
  const isUsernameEligible = cooldownRemainingMs <= 0;
  const daysToWait = Math.ceil(cooldownRemainingMs / (24 * 60 * 60 * 1000));

  const hasAvatarChanged = tempAvatar !== user.avatar;
  const hasNameChanged = tempName !== user.name && tempName.trim().length > 0;
  
  // Can save if avatar changed OR name changed (and allowed)
  const canSave = hasAvatarChanged || (hasNameChanged && isUsernameEligible);

  const handleSave = () => {
    if (!canSave) return;
    
    const updates: any = {};
    if (hasAvatarChanged) updates.avatar = tempAvatar;
    if (hasNameChanged && isUsernameEligible) {
      updates.name = tempName;
      updates.lastUsernameChange = Date.now();
    }
    
    onUpdateProfile(updates);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-black animate-in slide-in-from-bottom duration-400 select-none">
      {/* HEADER */}
      <div className="px-6 py-8 border-b border-zinc-900 flex items-center bg-zinc-950/95 backdrop-blur-md sticky top-0 z-50 pt-[calc(2rem+env(safe-area-inset-top)/2)]">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="heading-font text-3xl font-black italic text-zinc-100 tracking-tighter ml-4 uppercase">EDIT PROFILE</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        {/* CURRENT PREVIEW */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full border-4 border-red-600 p-1 bg-zinc-900 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            <img src={tempAvatar} className="w-full h-full rounded-full object-cover" alt="" />
          </div>
          <div className="text-center">
             <h3 className="heading-font text-4xl font-black italic text-white uppercase tracking-tighter">{tempName || '...'}</h3>
             <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mt-1">LVL {user.level} ARENA MASTER</p>
          </div>
        </div>

        {/* AVATAR SELECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <User size={14} className="text-zinc-600" />
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">CHOOSE NEW AVATAR</p>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 py-2 flex-nowrap items-center h-24 px-1">
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = tempAvatar === avatar;
              return (
                <div 
                  key={avatar}
                  onClick={() => setTempAvatar(avatar)}
                  className={`flex-shrink-0 w-20 h-20 rounded-full border-2 p-1 cursor-pointer transition-all relative ${
                    isSelected ? 'border-red-600 scale-110 shadow-lg' : 'border-zinc-800 hover:border-zinc-700 opacity-60'
                  }`}
                >
                  <img src={avatar} className="w-full h-full rounded-full object-cover" alt="" />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 border-2 border-zinc-950 shadow-lg z-10">
                      <Check size={10} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* USERNAME EDIT */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Shield size={14} className="text-zinc-600" />
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">DISPLAY NAME</p>
            </div>
            {!isUsernameEligible && (
              <div className="flex items-center gap-1.5 text-red-600">
                <Lock size={12} />
                <span className="text-[8px] font-bold uppercase tracking-widest">LOCKED</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
               <input 
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                disabled={!isUsernameEligible}
                maxLength={16}
                className={`w-full bg-zinc-950 border-2 rounded-2xl px-6 py-5 heading-font text-4xl font-black italic text-white uppercase outline-none transition-all ${
                  isUsernameEligible ? 'border-zinc-800 focus:border-red-600' : 'border-zinc-900 text-zinc-800 opacity-30 cursor-not-allowed'
                }`}
                placeholder="USERNAME"
              />
              {isUsernameEligible && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                   <Edit2 size={20} className="text-zinc-800" />
                </div>
              )}
            </div>

            <div className="px-2">
              {isUsernameEligible ? (
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                  NOTE: YOU CAN CHANGE YOUR USERNAME ONCE EVERY 30 DAYS. CHOOSE WISELY.
                </p>
              ) : (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-relaxed">
                  LOCKED: YOU CAN CHANGE YOUR NAME AGAIN IN <span className="text-red-600">{daysToWait} DAYS</span>.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SAVE ACTION */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
          <button 
            onClick={handleSave}
            disabled={!canSave}
            className={`w-full py-5 rounded-2xl heading-font text-3xl font-black italic uppercase tracking-widest transition-all active:scale-95 border-b-4 ${
              canSave
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_20px_50px_rgba(220,38,38,0.3)] border-red-800'
                : 'bg-zinc-800 text-zinc-600 border-zinc-900 opacity-40 cursor-not-allowed'
            }`}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};