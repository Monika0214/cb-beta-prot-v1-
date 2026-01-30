
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LayoutGrid, Users, Trophy, Store as StoreIcon, Coins, Gem, Target, Package, Library, ArrowLeft, Edit2, X, Shield, Zap, BookOpen } from 'lucide-react';
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
import { PostMatchRewards } from './components/PostMatchRewards';
import { EditSquad } from './components/EditSquad';
import { PlayerProfile } from './components/PlayerProfile';
import { FriendSearch as FriendSearchComponent } from './components/FriendSearch';
import { ArenaSelector } from './components/ArenaSelector';
import { EditProfile } from './components/EditProfile';
import { DailyMissions } from './components/DailyMissions';
import { Documentation } from './components/Documentation';
import { MOCK_SQUADS, MOCK_CARDS, MOCK_REGIONS } from './constants';

const PERSON_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffd5dc',
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
  [AppView.COLLECTION_LEVEL]: 'RANK LEVEL',
  [AppView.EDIT_SQUAD]: 'EDIT SQUAD',
  [AppView.SEARCH_FRIENDS]: 'SEARCH FRIENDS',
  [AppView.PLAYER_PROFILE]: 'PLAYER PROFILE',
  [AppView.ARENA_SELECTOR]: 'ARENA SELECTOR',
  [AppView.EDIT_PROFILE]: 'EDIT PROFILE',
  [AppView.DOCUMENTATION]: 'DESIGNER DOCS'
};

const ROOT_TABS = [AppView.HOME, AppView.COLLECTIONS, AppView.STORE, AppView.LEADERBOARD, AppView.FRIENDS];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [storeInitialTab, setStoreInitialTab] = useState<string | undefined>(undefined);
  const [userProfile, setUserProfile] = useState({
    name: 'PlayerOne',
    avatar: PERSON_AVATARS[0],
    level: 10,
    xp: 1240,
    rank: 5,
    coins: 12500,
    gems: 120,
    energyDrinks: 250,
    wins: 128,
    matchesPlayed: 428,
    lastUsernameChange: 0
  });

  const [ownedCardIds, setOwnedCardIds] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [cardUpgrades, setCardUpgrades] = useState<Record<string, number>>({});
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);
  const [activeSquadId, setActiveSquadId] = useState<string>(MOCK_SQUADS[0].id);
  const [collectionsTab, setCollectionsTab] = useState<'players' | 'squads'>('players');
  const [squads, setSquads] = useState<Squad[]>(MOCK_SQUADS);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>(MOCK_REGIONS[0]);
  const [lastOutcome, setLastOutcome] = useState<{ 
    outcome: 'victory' | 'defeat' | 'draw' | 'declared', 
    declaredBalls: number | null, 
    payout: number,
    energyReward: number,
    gemReward: number
  } | null>(null);
  const [isPostMatch, setIsPostMatch] = useState(false);

  const handleSetView = (view: AppView, tab?: string) => {
    if (view === AppView.STORE) {
      setStoreInitialTab(tab);
    } else {
      setStoreInitialTab(undefined);
    }
    setCurrentView(view);
  };

  const handleBack = () => {
    switch (currentView) {
      case AppView.EDIT_SQUAD: 
        // MANDATORY CHANGE: Always navigate back to 'My Squads' tab in Collections
        setCollectionsTab('squads');
        setCurrentView(AppView.COLLECTIONS); 
        break;
      case AppView.SEARCH_FRIENDS: setCurrentView(AppView.FRIENDS); break;
      case AppView.PLAYER_PROFILE: setCurrentView(AppView.FRIENDS); break;
      case AppView.RANK_PROGRESSION: setCurrentView(AppView.HOME); break;
      case AppView.COLLECTION_LEVEL: setCurrentView(AppView.HOME); break;
      case AppView.ARENA_SELECTOR: setCurrentView(AppView.HOME); break;
      case AppView.EDIT_PROFILE: setCurrentView(AppView.HOME); break;
      case AppView.DOCUMENTATION: setCurrentView(AppView.HOME); break;
      case AppView.MATCH_REWARDS:
        setIsPostMatch(true);
        setCurrentView(AppView.MATCH_STATS);
        break;
      case AppView.MATCH_STATS:
        setIsPostMatch(true);
        setCurrentView(AppView.GAMEPLAY);
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

  const startBrawl = (region: Region, opponentOverride?: any) => {
    setIsPostMatch(false);
    setLastOutcome(null);
    setActiveMatch({
      opponent: opponentOverride || { name: 'DarkKnight_99', level: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&backgroundColor=2d3436', squadPower: 245 },
      region: region, ballsPlayed: 0, playerWins: 0, opponentWins: 0, currentStadium: 1, isDeclared: false, isDoubled: false, score: { player: 0, opponent: 0 }, playedCards: []
    });
    setCurrentView(AppView.MATCHMAKING);
  };

  const handleDoublePool = () => {
    if (activeMatch && !activeMatch.isDoubled) {
      setActiveMatch({ ...activeMatch, isDoubled: true });
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home setView={handleSetView} startBrawl={startBrawl} squads={squads} activeSquadId={activeSquadId} onSelectSquad={setActiveSquadId} onEditSquad={handleEditSquad} userLevel={userProfile.level} selectedRegion={selectedRegion} />;
      case AppView.ARENA_SELECTOR: return <ArenaSelector userCoins={userProfile.coins} currentRegion={selectedRegion} userLevel={userProfile.level} onConfirm={(r) => { setSelectedRegion(r); setCurrentView(AppView.HOME); }} onBack={handleBack} />;
      case AppView.COLLECTIONS: 
        const ownedCards = MOCK_CARDS.filter(c => ownedCardIds.includes(c.id));
        return <Collections userProfile={userProfile} cardUpgrades={cardUpgrades} onUpgradeCard={handleUpgradeCard} onEditSquad={handleEditSquad} activeTab={collectionsTab} setActiveTab={setCollectionsTab} squads={squads} activeSquadId={activeSquadId} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} customCards={ownedCards} />;
      case AppView.LEADERBOARD: return <Leaderboard />;
      case AppView.FRIENDS: 
        return (
          <Friends 
            onNavigate={(v, p) => { if (p) setSelectedProfile(p); setCurrentView(v); }} 
            onBrawl={(friend) => startBrawl(selectedRegion, {
              name: friend.name,
              level: friend.lv,
              avatar: `https://picsum.photos/seed/${friend.name}/100/100`,
              squadPower: 200 + (friend.lv * 2)
            })}
          />
        );
      case AppView.STORE: return <Store initialTab={storeInitialTab} ownedCardIds={ownedCardIds} onPurchaseCard={handlePurchaseCard} userGems={userProfile.gems} squads={squads} activeSquadId={activeSquadId} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} />;
      case AppView.RANK_PROGRESSION: return <RankProgression onClose={handleBack} rank={userProfile.rank} xp={userProfile.xp} />;
      case AppView.COLLECTION_LEVEL: return <LevelProgression onClose={handleBack} level={userProfile.level} xp={userProfile.xp} />;
      case AppView.EDIT_SQUAD: return <EditSquad squadId={editingSquadId} squads={squads} onUpdateSquad={(s) => setSquads(p => p.map(q => q.id === s.id ? s : q))} onBack={handleBack} userCoins={userProfile.coins} userEnergy={userProfile.energyDrinks} userGems={userProfile.gems} cardUpgrades={cardUpgrades} onUpgrade={handleUpgradeCard} />;
      case AppView.MATCHMAKING: return <Matchmaking opponent={activeMatch?.opponent} region={activeMatch?.region} onDeductFee={(a) => setUserProfile(p => ({ ...p, coins: p.coins - a }))} onStart={() => setCurrentView(AppView.GAMEPLAY)} />;
      case AppView.GAMEPLAY: return <Gameplay match={activeMatch!} isPostMatch={isPostMatch} onNavigate={setCurrentView} onDoublePool={handleDoublePool} onComplete={(outcome, declaredBalls) => { 
        const initialPool = (activeMatch?.region.entryFee || 0) * 2;
        let playablePool = Math.floor(initialPool * 0.9);
        if (activeMatch?.isDoubled) playablePool *= 2;
        
        let payout = 0;
        let energyReward = 0;
        let gemReward = 0;

        if (outcome === 'victory') {
          payout = playablePool;
          energyReward = activeMatch?.region.energyReward || 2;
          if (Math.random() < 0.1) gemReward = 5;
        } else if (outcome === 'draw') {
          payout = Math.floor(playablePool * 0.5);
          energyReward = 1;
        } else if (outcome === 'declared') {
          const refundFactor = declaredBalls === null ? 0 : [0.5, 0.5, 0.45, 0.4, 0.3, 0.2, 0][declaredBalls] || 0;
          payout = Math.floor(playablePool * refundFactor);
        }
        
        if (payout > 0 || energyReward > 0 || gemReward > 0) {
          setUserProfile(p => ({ 
            ...p, 
            coins: p.coins + payout,
            energyDrinks: p.energyDrinks + energyReward,
            gems: p.gems + gemReward
          }));
        }

        setUserProfile(p => ({ 
          ...p, 
          wins: outcome === 'victory' ? p.wins + 1 : p.wins,
          matchesPlayed: p.matchesPlayed + 1
        }));
        
        setLastOutcome({ outcome, declaredBalls, payout, energyReward, gemReward }); 
        setIsPostMatch(true); 
        setCurrentView(AppView.MATCH_RESULT); 
      }} />;
      case AppView.MATCH_RESULT: 
        return (
          <MatchResult 
            outcome={lastOutcome!.outcome} 
            payout={lastOutcome!.payout}
            energyReward={lastOutcome!.energyReward}
            gemReward={lastOutcome!.gemReward}
            onNavigate={setCurrentView} 
            onBack={handleBack}
            userProfile={userProfile}
          />
        );
      case AppView.MATCH_STATS: return <MatchStats match={activeMatch!} onBrawlAgain={() => startBrawl(activeMatch!.region)} onExit={() => { setIsPostMatch(false); setCurrentView(AppView.HOME); }} onBack={handleBack} />;
      case AppView.MATCH_REWARDS: 
        return (
          <div className="h-full w-full relative">
            <MatchResult 
               outcome={lastOutcome!.outcome} 
               payout={lastOutcome!.payout}
               energyReward={lastOutcome!.energyReward}
               gemReward={lastOutcome!.gemReward}
               onNavigate={() => {}} 
               userProfile={userProfile}
            />
            <PostMatchRewards 
              payout={lastOutcome?.payout || 0}
              energyEarned={lastOutcome?.energyReward || 0}
              gemsEarned={lastOutcome?.gemReward || 0}
              userProfile={userProfile}
              onNavigate={setCurrentView}
            />
          </div>
        );
      case AppView.SEARCH_FRIENDS: return <FriendSearchComponent onBack={handleBack} onOpenProfile={(u) => { setSelectedProfile(u); setCurrentView(AppView.PLAYER_PROFILE); }} />;
      case AppView.PLAYER_PROFILE: return <PlayerProfile user={selectedProfile} onBack={handleBack} />;
      case AppView.EDIT_PROFILE: return <EditProfile user={userProfile} onBack={handleBack} onUpdateProfile={(u) => setUserProfile(prev => ({ ...prev, ...u }))} />;
      case AppView.DOCUMENTATION: return <Documentation onBack={handleBack} />;
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

  const showGlobalHeader = 
    currentView !== AppView.HOME && 
    currentView !== AppView.ARENA_SELECTOR && 
    currentView !== AppView.MATCH_REWARDS && 
    currentView !== AppView.COLLECTION_LEVEL && 
    currentView !== AppView.MATCH_RESULT &&
    currentView !== AppView.MATCHMAKING &&
    currentView !== AppView.GAMEPLAY &&
    currentView !== AppView.EDIT_PROFILE &&
    currentView !== AppView.DOCUMENTATION;

  const isRootTab = ROOT_TABS.includes(currentView);
  
  const isImmersiveFlow = [AppView.MATCHMAKING, AppView.GAMEPLAY, AppView.MATCH_RESULT, AppView.MATCH_STATS, AppView.MATCH_REWARDS, AppView.ARENA_SELECTOR, AppView.EDIT_PROFILE, AppView.DOCUMENTATION].includes(currentView);
  const showBottomNav = !isImmersiveFlow;

  return (
    <div className="relative h-[100dvh] w-full bg-black text-white overflow-hidden flex flex-col max-w-lg mx-auto border-x border-zinc-900 shadow-2xl">
      
      {currentView === AppView.HOME && (
        <header className="sticky top-0 z-[60] bg-black/95 backdrop-blur-2xl border-b border-zinc-900/50 animate-header-entry px-4 py-3 flex items-center justify-between gap-2 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <div className="flex items-center gap-2 shrink-0">
            <div 
              onClick={() => setCurrentView(AppView.EDIT_PROFILE)} 
              className="flex items-center gap-2 bg-[#1c1c1e] rounded-full pr-3 py-0.5 pl-0.5 cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 shadow-lg border border-white/5 shrink-0"
            >
              <div className="w-7 h-7 rounded-full border border-teal-500/30 overflow-hidden bg-black shrink-0">
                <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
              <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight leading-none whitespace-nowrap">{userProfile.name}</span>
            </div>

            <RankPill 
              rank={userProfile.level} 
              onClick={(e) => { e.stopPropagation(); handleSetView(AppView.COLLECTION_LEVEL); }} 
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div 
              className="flex items-center bg-[#1c1c1e] rounded-full px-2 py-1 gap-2 shadow-inner border border-white/5"
            >
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSetView(AppView.STORE, 'coins')}
              >
                <Coins size={10} className="text-amber-500/80" />
                <span className="heading-font text-[11px] font-black tracking-tight text-zinc-300">{userProfile.coins.toLocaleString()}</span>
              </div>
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSetView(AppView.STORE, 'gems')}
              >
                <Gem size={10} className="text-violet-500/80" />
                <span className="heading-font text-[11px] font-black tracking-tight text-zinc-300">{userProfile.gems.toLocaleString()}</span>
              </div>
            </div>
            {/* DESIGNER / MISSIONS ROW */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMissionsModalOpen(true)} 
                className="p-1.5 text-zinc-600 hover:text-white transition-colors active:scale-90"
              >
                <Target size={18} />
              </button>
              <button 
                onClick={() => handleSetView(AppView.DOCUMENTATION)} 
                className="p-1.5 text-zinc-600 hover:text-white transition-colors active:scale-90"
              >
                <BookOpen size={18} />
              </button>
            </div>
          </div>
        </header>
      )}

      {showGlobalHeader && (
        <header className="fixed top-0 left-0 right-0 h-[calc(52px+env(safe-area-inset-top))] bg-black border-b border-zinc-800/50 flex items-center justify-between px-4 z-[70] shadow-sm pt-[env(safe-area-inset-top)]">
          <div className="flex items-center min-w-0">
            {!isRootTab && (
              <button onClick={handleBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-all active:scale-90 mr-2">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="heading-font text-2xl font-bold text-zinc-100 uppercase tracking-wider truncate">
              {VIEW_TITLES[currentView] || 'SCREEN'}
            </h1>
          </div>

          {/* STORE ENHANCEMENT: DISPLAY ALL CURRENCIES IN TOP BAR */}
          {currentView === AppView.STORE && (
            <div className="flex items-center bg-[#1c1c1e] rounded-full px-3 py-1 gap-3 border border-white/5 shadow-inner shrink-0">
              <div className="flex items-center gap-1">
                <Coins size={10} className="text-amber-500/80" />
                <span className="heading-font text-[11px] font-black text-zinc-300">{userProfile.coins.toLocaleString()}</span>
              </div>
              <div className="w-[1px] h-2.5 bg-zinc-800" />
              <div className="flex items-center gap-1">
                <Gem size={10} className="text-violet-500/80" />
                <span className="heading-font text-[11px] font-black text-zinc-300">{userProfile.gems.toLocaleString()}</span>
              </div>
              <div className="w-[1px] h-2.5 bg-zinc-800" />
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-blue-500/80" />
                <span className="heading-font text-[11px] font-black text-zinc-300">{userProfile.energyDrinks.toLocaleString()}</span>
              </div>
            </div>
          )}
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${showGlobalHeader ? 'pt-[calc(52px+env(safe-area-inset-top))]' : ''}`}>
        {renderView()}
      </main>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-black border-t border-zinc-800/50 flex items-center justify-between px-2 pt-3 pb-[calc(2rem+env(safe-area-inset-bottom))] z-[60] shadow-[0_-10px_40_rgba(0,0,0,0.8)]">
          {[
            { view: AppView.STORE, icon: StoreIcon, label: 'STORE' },
            { view: AppView.COLLECTIONS, icon: Library, label: 'COLLECTIONS' },
            { view: AppView.HOME, icon: LayoutGrid, label: 'HOME' },
            { view: AppView.LEADERBOARD, icon: Trophy, label: 'LEADERBOARD' },
            { view: AppView.FRIENDS, icon: Users, label: 'SOCIAL' },
          ].map((item) => {
            const isActive = currentView === item.view;
            return (
              <button key={item.view} onClick={() => handleSetView(item.view)} className="flex flex-col items-center justify-center flex-1 transition-all relative group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-red-500' : 'text-zinc-500'}`}><item.icon size={item.view === AppView.HOME ? 28 : 22} strokeWidth={isActive ? 3 : 2} /></div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'text-white' : 'text-zinc-600'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* RESTORED MISSION FLOW MODAL */}
      <Modal isOpen={isMissionsModalOpen} onClose={() => setIsMissionsModalOpen(false)} title="DAILY MISSIONS">
        <DailyMissions />
      </Modal>
    </div>
  );
};

export default App;
