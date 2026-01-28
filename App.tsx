
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutGrid, Users, Trophy, Store as StoreIcon, Coins, Gem, Target, Package, Library, ArrowLeft, Edit2, X, Shield } from 'lucide-react';
import { AppView, MatchState, Region, Squad, PlayerCard } from './types';
import { Home } from './components/Home';
import { Collections } from './components/Collections';
import { Leaderboard } from './components/Leaderboard';
import { LevelProgression } from './components/LevelProgression';
import { RankProgression } from './components/RankProgression';
import { RankPill } from './components/RankPill';
import { Friends } from './components/Friends';
import { Store } from './components/Store';
import { Modal } from './components/Modal';
import { Matchmaking } from './components/Matchmaking';
import { Gameplay } from './components/Gameplay';
import { MatchStats } from './components/MatchStats';
import { EditSquad } from './components/EditSquad';
import { PlayerProfile } from './components/PlayerProfile';
import { EditProfile } from './components/EditProfile';
import { FriendSearch as FriendSearchComponent } from './components/FriendSearch';
import { DailyMissions } from './components/DailyMissions';
import { MOCK_SQUADS, MOCK_CARDS } from './constants';

const PREDEFINED_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Luna',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Oscar',
];

const VIEW_TITLES: Record<string, string> = {
  [AppView.STORE]: 'STORE',
  [AppView.COLLECTIONS]: 'COLLECTIONS',
  [AppView.LEADERBOARD]: 'LEADERBOARD',
  [AppView.FRIENDS]: 'SOCIAL',
  [AppView.MATCHMAKING]: 'MATCHMAKING',
  [AppView.GAMEPLAY]: 'GAMEPLAY',
  [AppView.MATCH_STATS]: 'MATCH STATS',
  [AppView.RANK_PROGRESSION]: 'RANK PROGRESSION',
  [AppView.COLLECTION_LEVEL]: 'COLLECTION LEVEL',
  [AppView.EDIT_SQUAD]: 'EDIT SQUAD',
  [AppView.SEARCH_FRIENDS]: 'SEARCH FRIENDS',
  [AppView.PLAYER_PROFILE]: 'PLAYER PROFILE',
  [AppView.EDIT_PROFILE]: 'EDIT PROFILE',
};

const ROOT_TABS = [AppView.HOME, AppView.COLLECTIONS, AppView.STORE, AppView.LEADERBOARD, AppView.FRIENDS];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [storeInitialTab, setStoreInitialTab] = useState<string | undefined>(undefined);
  const [userProfile, setUserProfile] = useState({
    name: 'PlayerOne',
    avatar: PREDEFINED_AVATARS[0],
    level: 5,
    xp: 1240,
    rank: 5,
    coins: 12500,
    gems: 120,
    energyDrinks: 250,
    wins: 128,
    lastUsernameChange: 0 // Timestamp
  });

  const [cardUpgrades, setCardUpgrades] = useState<Record<string, number>>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);
  const [activeSquadId, setActiveSquadId] = useState<string>(MOCK_SQUADS[0].id);
  const [collectionsTab, setCollectionsTab] = useState<'players' | 'squads'>('players');
  const [squads, setSquads] = useState<Squad[]>(MOCK_SQUADS);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);

  const navigateTo = (view: AppView, tab?: string) => {
    if (view === AppView.STORE) {
      setStoreInitialTab(tab);
    }
    setCurrentView(view);
  };

  const handleBack = () => {
    switch (currentView) {
      case AppView.EDIT_SQUAD: setCurrentView(AppView.COLLECTIONS); break;
      case AppView.SEARCH_FRIENDS: setCurrentView(AppView.FRIENDS); break;
      case AppView.PLAYER_PROFILE: setCurrentView(AppView.FRIENDS); break;
      case AppView.EDIT_PROFILE: setCurrentView(AppView.HOME); break;
      case AppView.RANK_PROGRESSION: setCurrentView(AppView.HOME); break;
      case AppView.COLLECTION_LEVEL: setCurrentView(AppView.HOME); break;
      default: setCurrentView(AppView.HOME);
    }
  };

  const handleUpgradeCard = (cardId: string, costCoins: number, costEnergy: number) => {
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins - costCoins,
      energyDrinks: prev.energyDrinks - costEnergy
    }));
    setCardUpgrades(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1
    }));
  };

  const handleUpdateProfile = (updates: Partial<typeof userProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const startBrawl = (region: Region) => {
    setActiveMatch({
      opponent: { name: 'DarkKnight_99', level: 7, avatar: 'https://images.unsplash.com/photo-1624192132371-367288e67f08?auto=format&fit=crop&q=80&w=200&h=200', squadPower: 245 },
      region: region, ballsPlayed: 0, playerWins: 0, opponentWins: 0, currentStadium: 1, isDeclared: false, score: { player: 0, opponent: 0 }, playedCards: []
    });
    setCurrentView(AppView.MATCHMAKING);
  };

  const openOwnProfileEdit = () => {
    setCurrentView(AppView.EDIT_PROFILE);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home setView={navigateTo} startBrawl={startBrawl} squads={squads} activeSquadId={activeSquadId} onSelectSquad={setActiveSquadId} onEditSquad={handleEditSquad} userLevel={userProfile.level} />;
      case AppView.COLLECTIONS: return <Collections userProfile={userProfile} cardUpgrades={cardUpgrades} onUpgradeCard={handleUpgradeCard} onEditSquad={handleEditSquad} activeTab={collectionsTab} setActiveTab={setCollectionsTab} squads={squads} activeSquadId={activeSquadId} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} />;
      case AppView.LEADERBOARD: return <Leaderboard />;
      case AppView.FRIENDS: return <Friends onNavigate={(v, p) => { if (p) setSelectedProfile(p); setCurrentView(v); }} />;
      case AppView.STORE: return <Store initialTab={storeInitialTab} />;
      case AppView.RANK_PROGRESSION: return <RankProgression onClose={handleBack} rank={userProfile.rank} xp={userProfile.xp} />;
      case AppView.COLLECTION_LEVEL: return <LevelProgression onClose={handleBack} level={userProfile.level} xp={userProfile.xp} />;
      case AppView.EDIT_SQUAD: return <EditSquad squadId={editingSquadId} squads={squads} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} onBack={handleBack} userCoins={userProfile.coins} userEnergy={userProfile.energyDrinks} cardUpgrades={cardUpgrades} onUpgrade={handleUpgradeCard} />;
      case AppView.MATCHMAKING: return <Matchmaking opponent={activeMatch?.opponent} region={activeMatch?.region} onDeductFee={(a) => setUserProfile(p => ({ ...p, coins: p.coins - a }))} onStart={() => setCurrentView(AppView.GAMEPLAY)} />;
      case AppView.GAMEPLAY: return <Gameplay match={activeMatch!} onComplete={() => setCurrentView(AppView.MATCH_STATS)} />;
      case AppView.MATCH_STATS: return <MatchStats match={activeMatch!} onBrawlAgain={() => startBrawl(activeMatch!.region)} onExit={() => setCurrentView(AppView.HOME)} />;
      case AppView.SEARCH_FRIENDS: return <FriendSearchComponent onBack={handleBack} onOpenProfile={(u) => { setSelectedProfile(u); setCurrentView(AppView.PLAYER_PROFILE); }} />;
      case AppView.PLAYER_PROFILE: return <PlayerProfile user={selectedProfile} onBack={handleBack} />;
      case AppView.EDIT_PROFILE: return <EditProfile user={userProfile} onBack={handleBack} onUpdateProfile={handleUpdateProfile} />;
      default: return null;
    }
  };

  const handleEditSquad = (squadId: string) => {
    if (squadId === 'new') {
      const newId = `s-${Date.now()}`;
      setSquads(prev => [...prev, { id: newId, name: 'NEW SQUAD', cards: [], power: 0, emblemId: 'shield', color: 'red' }]);
      setEditingSquadId(newId);
    } else {
      setEditingSquadId(squadId);
    }
    setCurrentView(AppView.EDIT_SQUAD);
  };

  const showGlobalHeader = currentView !== AppView.HOME;
  const isRootTab = ROOT_TABS.includes(currentView);
  
  const isImmersiveFlow = [AppView.MATCHMAKING, AppView.GAMEPLAY, AppView.MATCH_STATS].includes(currentView);
  const showBottomNav = !isImmersiveFlow;

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden flex flex-col max-w-lg mx-auto border-x border-zinc-900 shadow-2xl">
      
      {currentView === AppView.HOME && (
        <header className="sticky top-0 z-[60] bg-black/95 backdrop-blur-2xl border-b border-zinc-900/50 animate-header-entry px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div onClick={openOwnProfileEdit} className="flex items-center gap-2.5 bg-[#1c1c1e] rounded-full pr-3.5 py-1 pl-1 cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 shadow-lg h-[36px]">
              <div className="w-7 h-7 rounded-full border border-teal-500/30 overflow-hidden bg-black flex-shrink-0">
                <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
              <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight leading-none truncate max-w-[80px]">{userProfile.name}</span>
            </div>
            
            <RankPill 
              rank={userProfile.rank} 
              onClick={() => setCurrentView(AppView.RANK_PROGRESSION)} 
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#1c1c1e] rounded-full px-3 py-1.5 gap-3 shadow-inner border border-white/5">
              <div 
                onClick={() => navigateTo(AppView.STORE, 'coins')} 
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
              >
                <Coins size={12} className="text-amber-500/80" />
                <span className="heading-font text-[13px] font-black tracking-tight text-zinc-300">{userProfile.coins}</span>
              </div>
              <div className="w-[1px] h-3 bg-zinc-800" />
              <div 
                onClick={() => navigateTo(AppView.STORE, 'gems')} 
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
              >
                <Gem size={12} className="text-violet-500/80" />
                <span className="heading-font text-[13px] font-black tracking-tight text-zinc-300">{userProfile.gems}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMissionsModalOpen(true)} className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors active:scale-90"><Target size={18} /></button>
            </div>
          </div>
        </header>
      )}

      {showGlobalHeader && (
        <header className="fixed top-0 left-0 right-0 h-[52px] bg-black border-b border-zinc-800/50 flex items-center px-4 z-[70] shadow-sm">
          {!isRootTab && (
            <button onClick={handleBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-all active:scale-90 mr-2">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="heading-font text-2xl font-bold text-zinc-100 uppercase tracking-wider">
            {VIEW_TITLES[currentView] || 'SCREEN'}
          </h1>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${showGlobalHeader ? 'pt-[52px]' : ''}`}>
        {renderView()}
      </main>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-black border-t border-zinc-800/50 flex items-center justify-between px-2 pt-3 pb-8 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          {[
            { view: AppView.STORE, icon: StoreIcon, label: 'STORE' },
            { view: AppView.COLLECTIONS, icon: Library, label: 'COLLECTIONS' },
            { view: AppView.HOME, icon: LayoutGrid, label: 'HOME' },
            { view: AppView.LEADERBOARD, icon: Trophy, label: 'LEADERBOARD' },
            { view: AppView.FRIENDS, icon: Users, label: 'SOCIAL' },
          ].map((item) => {
            const isActive = currentView === item.view;
            return (
              <button 
                key={item.view} 
                onClick={() => navigateTo(item.view)} 
                className="flex flex-col items-center justify-center flex-1 transition-all relative group"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-red-500' : 'text-zinc-500'}`}><item.icon size={item.view === AppView.HOME ? 28 : 22} strokeWidth={isActive ? 3 : 2} /></div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'text-white' : 'text-zinc-600'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="PLAYER PROFILE">
        <div className="flex flex-col items-center py-6 gap-6">
           <div className="w-24 h-24 rounded-full border-4 border-zinc-800 p-1 bg-zinc-900">
             <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="" />
           </div>
           <div className="text-center">
             <h3 className="heading-font text-3xl font-black text-white italic">{userProfile.name}</h3>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Level {userProfile.level} Arena Master</p>
           </div>
        </div>
      </Modal>

      <Modal isOpen={isMissionsModalOpen} onClose={() => setIsMissionsModalOpen(false)} title="DAILY MISSIONS">
        <DailyMissions />
      </Modal>
    </div>
  );
};

export default App;
