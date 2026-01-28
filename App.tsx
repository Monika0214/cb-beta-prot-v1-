
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
import { MatchResult } from './components/MatchResult';
import { MatchStats } from './components/MatchStats';
import { ProgressionView } from './components/ProgressionView';
import { EditSquad } from './components/EditSquad';
import { PlayerProfile } from './components/PlayerProfile';
import { FriendSearch as FriendSearchComponent } from './components/FriendSearch';
import { MOCK_SQUADS, MOCK_CARDS } from './constants';

const PREDEFINED_AVATARS = [
  'https://images.unsplash.com/photo-1540747913346-19e3adcc174b?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=300&h=300',
  'https://images.unsplash.com/photo-1629285401299-497b4b10492c?auto=format&fit=crop&q=80&w=300&h=300',
];

const VIEW_TITLES: Record<string, string> = {
  [AppView.STORE]: 'STORE',
  [AppView.COLLECTIONS]: 'COLLECTIONS',
  [AppView.LEADERBOARD]: 'LEADERBOARD',
  [AppView.FRIENDS]: 'SOCIAL',
  [AppView.MATCHMAKING]: 'MATCHMAKING',
  [AppView.GAMEPLAY]: 'GAMEPLAY',
  [AppView.MATCH_RESULT]: 'MATCH RESULT',
  [AppView.MATCH_STATS]: 'MATCH STATS',
  [AppView.MATCH_REWARDS]: 'REWARDS',
  [AppView.RANK_PROGRESSION]: 'RANK PROGRESSION',
  [AppView.COLLECTION_LEVEL]: 'COLLECTION LEVEL',
  [AppView.EDIT_SQUAD]: 'EDIT SQUAD',
  [AppView.SEARCH_FRIENDS]: 'SEARCH FRIENDS',
  [AppView.PLAYER_PROFILE]: 'PLAYER PROFILE',
};

const ROOT_TABS = [AppView.HOME, AppView.COLLECTIONS, AppView.STORE, AppView.LEADERBOARD, AppView.FRIENDS];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [userProfile, setUserProfile] = useState({
    name: 'PlayerOne',
    avatar: PREDEFINED_AVATARS[0],
    level: 5,
    xp: 1240,
    rank: 5,
    coins: 12500,
    gems: 120,
    energyDrinks: 250,
    wins: 128
  });

  const [ownedCardIds, setOwnedCardIds] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [cardUpgrades, setCardUpgrades] = useState<Record<string, number>>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);
  const [activeSquadId, setActiveSquadId] = useState<string>(MOCK_SQUADS[0].id);
  const [collectionsTab, setCollectionsTab] = useState<'players' | 'squads'>('players');
  const [squads, setSquads] = useState<Squad[]>(MOCK_SQUADS);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);
  const [lastOutcome, setLastOutcome] = useState<{ outcome: 'victory' | 'defeat' | 'draw' | 'declared', declaredBalls: number | null } | null>(null);
  const [isPostMatch, setIsPostMatch] = useState(false);

  const handleBack = () => {
    switch (currentView) {
      case AppView.EDIT_SQUAD: setCurrentView(AppView.COLLECTIONS); break;
      case AppView.SEARCH_FRIENDS: setCurrentView(AppView.FRIENDS); break;
      case AppView.PLAYER_PROFILE: setCurrentView(AppView.FRIENDS); break;
      case AppView.RANK_PROGRESSION: setCurrentView(AppView.HOME); break;
      case AppView.COLLECTION_LEVEL: setCurrentView(AppView.HOME); break;
      case AppView.MATCH_RESULT: setCurrentView(AppView.GAMEPLAY); break;
      case AppView.MATCH_STATS:
      case AppView.MATCH_REWARDS:
        setCurrentView(isPostMatch ? AppView.GAMEPLAY : AppView.MATCH_RESULT);
        break;
      default: 
        setIsPostMatch(false);
        setCurrentView(AppView.HOME);
    }
  };

  const handleUpgradeCard = (cardId: string, bitValue: number = 0, costEnergy: number = 0) => {
    setCardUpgrades(prev => {
      const current = prev[cardId] || 0;
      if (costEnergy > 0) {
        setUserProfile(p => ({ ...p, energyDrinks: p.energyDrinks - costEnergy }));
      }
      if (bitValue > 0) {
        return { ...prev, [cardId]: current | bitValue };
      }
      return { ...prev, [cardId]: current + 1 };
    });
  };

  const handlePurchaseCard = (cardId: string, costGems: number) => {
    if (userProfile.gems < costGems) return;
    setUserProfile(prev => ({ ...prev, gems: prev.gems - costGems }));
    setOwnedCardIds(prev => [...prev, cardId]);
  };

  const startBrawl = (region: Region) => {
    setIsPostMatch(false);
    setActiveMatch({
      opponent: { name: 'DarkKnight_99', level: 7, avatar: 'https://images.unsplash.com/photo-1624192132371-367288e67f08?auto=format&fit=crop&q=80&w=200&h=200', squadPower: 245 },
      region: region, ballsPlayed: 0, playerWins: 0, opponentWins: 0, currentStadium: 1, isDeclared: false, score: { player: 0, opponent: 0 }, playedCards: []
    });
    setCurrentView(AppView.MATCHMAKING);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home setView={setCurrentView} startBrawl={startBrawl} squads={squads} activeSquadId={activeSquadId} onSelectSquad={setActiveSquadId} onEditSquad={handleEditSquad} userLevel={userProfile.level} />;
      case AppView.COLLECTIONS: 
        const ownedCards = MOCK_CARDS.filter(c => ownedCardIds.includes(c.id));
        return <Collections userProfile={userProfile} cardUpgrades={cardUpgrades} onUpgradeCard={handleUpgradeCard} onEditSquad={handleEditSquad} activeTab={collectionsTab} setActiveTab={setCollectionsTab} squads={squads} activeSquadId={activeSquadId} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} customCards={ownedCards} />;
      case AppView.LEADERBOARD: return <Leaderboard />;
      case AppView.FRIENDS: return <Friends onNavigate={(v, p) => { if (p) setSelectedProfile(p); setCurrentView(v); }} />;
      case AppView.STORE: return <Store ownedCardIds={ownedCardIds} onPurchaseCard={handlePurchaseCard} userGems={userProfile.gems} squads={squads} activeSquadId={activeSquadId} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} />;
      case AppView.RANK_PROGRESSION: return <RankProgression onClose={handleBack} rank={userProfile.rank} xp={userProfile.xp} />;
      case AppView.COLLECTION_LEVEL: return <LevelProgression onClose={handleBack} level={userProfile.level} xp={userProfile.xp} />;
      case AppView.EDIT_SQUAD: return <EditSquad squadId={editingSquadId} squads={squads} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} onBack={handleBack} userCoins={userProfile.coins} userEnergy={userProfile.energyDrinks} userGems={userProfile.gems} cardUpgrades={cardUpgrades} onUpgrade={handleUpgradeCard} />;
      case AppView.MATCHMAKING: return <Matchmaking opponent={activeMatch?.opponent} region={activeMatch?.region} onDeductFee={(a) => setUserProfile(p => ({ ...p, coins: p.coins - a }))} onStart={() => setCurrentView(AppView.GAMEPLAY)} />;
      case AppView.GAMEPLAY: return <Gameplay match={activeMatch!} isPostMatch={isPostMatch} onNavigate={setCurrentView} onComplete={(outcome, declaredBalls) => { setLastOutcome({ outcome, declaredBalls }); setIsPostMatch(true); setCurrentView(AppView.MATCH_RESULT); }} />;
      case AppView.MATCH_RESULT: return <MatchResult outcome={lastOutcome!.outcome} onNavigate={setCurrentView} onBack={handleBack} />;
      case AppView.MATCH_STATS: return <MatchStats match={activeMatch!} onBrawlAgain={() => startBrawl(activeMatch!.region)} onExit={() => { setIsPostMatch(false); setCurrentView(AppView.HOME); }} />;
      case AppView.MATCH_REWARDS: 
        const isVictory = lastOutcome?.outcome === 'victory';
        const fee = activeMatch?.region.entryFee || 100;
        return (
          <ProgressionView 
            outcome={lastOutcome!.outcome} 
            declaredBalls={lastOutcome!.declaredBalls} 
            oldXp={userProfile.xp} 
            oldLevel={userProfile.level} 
            currentXp={userProfile.xp + (isVictory ? 150 : 50)} 
            currentLevel={userProfile.level} 
            oldCoins={userProfile.coins} 
            currentCoins={userProfile.coins + (isVictory ? fee * 2 : -fee)} 
            onClose={() => { setIsPostMatch(false); setCurrentView(AppView.HOME); }}
            match={activeMatch!}
          />
        );
      case AppView.SEARCH_FRIENDS: return <FriendSearchComponent onBack={handleBack} onOpenProfile={(u) => { setSelectedProfile(u); setCurrentView(AppView.PLAYER_PROFILE); }} />;
      case AppView.PLAYER_PROFILE: return <PlayerProfile user={selectedProfile} onBack={handleBack} />;
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
  
  const isImmersiveFlow = [AppView.MATCHMAKING, AppView.GAMEPLAY, AppView.MATCH_RESULT, AppView.MATCH_STATS, AppView.MATCH_REWARDS].includes(currentView);
  const showBottomNav = !isImmersiveFlow;

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden flex flex-col max-w-lg mx-auto border-x border-zinc-900 shadow-2xl">
      
      {currentView === AppView.HOME && (
        <header className="sticky top-0 z-[60] bg-black/95 backdrop-blur-2xl border-b border-zinc-900/50 animate-header-entry px-4 py-3 flex items-center justify-between gap-2">
          {/* Identity Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Unified Identity Block (Avatar + Name Only) */}
            <div 
              onClick={() => setIsProfileModalOpen(true)} 
              className="flex items-center gap-2 bg-[#1c1c1e] rounded-full pr-3 py-0.5 pl-0.5 cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 shadow-lg border border-white/5 shrink-0"
            >
              <div className="w-7 h-7 rounded-full border border-teal-500/30 overflow-hidden bg-black shrink-0">
                <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
              <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight leading-none whitespace-nowrap">{userProfile.name}</span>
            </div>

            {/* Separated Level UI (Yellow Glowing Badge) */}
            <RankPill 
              rank={userProfile.level} 
              onClick={(e) => { e.stopPropagation(); setCurrentView(AppView.COLLECTION_LEVEL); }} 
            />
          </div>

          {/* Compact Currency Section */}
          <div className="flex items-center gap-2 shrink-0">
            <div 
              onClick={() => setCurrentView(AppView.STORE)} 
              className="flex items-center bg-[#1c1c1e] rounded-full px-2 py-1 gap-2 cursor-pointer hover:bg-zinc-800 shadow-inner border border-white/5"
            >
              <div className="flex items-center gap-1">
                <Coins size={10} className="text-amber-500/80" />
                <span className="heading-font text-[11px] font-black tracking-tight text-zinc-300">{userProfile.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gem size={10} className="text-violet-500/80" />
                <span className="heading-font text-[11px] font-black tracking-tight text-zinc-300">{userProfile.gems.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => setIsMissionsModalOpen(true)} className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors active:scale-90">
              <Target size={18} />
            </button>
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
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-black border-t border-zinc-800/50 flex items-center justify-between px-2 pt-3 pb-8 z-[60] shadow-[0_-10px_40_rgba(0,0,0,0.8)]">
          {[
            { view: AppView.STORE, icon: StoreIcon, label: 'STORE' },
            { view: AppView.COLLECTIONS, icon: Library, label: 'COLLECTIONS' },
            { view: AppView.HOME, icon: LayoutGrid, label: 'HOME' },
            { view: AppView.LEADERBOARD, icon: Trophy, label: 'LEADERBOARD' },
            { view: AppView.FRIENDS, icon: Users, label: 'SOCIAL' },
          ].map((item) => {
            const isActive = currentView === item.view;
            return (
              <button key={item.view} onClick={() => setCurrentView(item.view)} className="flex flex-col items-center justify-center flex-1 transition-all relative group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-red-500' : 'text-zinc-500'}`}><item.icon size={item.view === AppView.HOME ? 28 : 22} strokeWidth={isActive ? 3 : 2} /></div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'text-white' : 'text-zinc-600'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* MODALS */}
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

      <Modal isOpen={isMissionsModalOpen} onClose={() => setIsMissionsModalOpen(false)} title="MISSIONS">
        <div className="space-y-3">
           {[1,2,3].map(i => (
             <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-white uppercase tracking-wider">Mission {i}</p>
                   <p className="text-[10px] font-black text-emerald-500">+100 XP</p>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: '40%' }} /></div>
             </div>
           ))}
        </div>
      </Modal>
    </div>
  );
};

export default App;
