
import React, { useState, useMemo } from 'react';
import { ShieldAlert, Trophy, Zap, Package, Info, AlertTriangle, Coins, FlaskConical, X, CheckCircle2, XCircle, MinusCircle, FastForward } from 'lucide-react';
import { MatchState, PlayerCard } from '../types';
import { MOCK_CARDS } from '../constants';
import { Card } from './Card';

interface GameplayProps {
  match: MatchState;
  onComplete: (outcome: 'victory' | 'defeat' | 'draw' | 'declared', declaredBalls: number | null) => void;
}

interface StadiumData {
  id: number;
  name: string;
  playerScore: number;
  opponentScore: number;
  playedCards: { card: PlayerCard; side: 'player' | 'opponent' }[];
}

export const Gameplay: React.FC<GameplayProps> = ({ match, onComplete }) => {
  const [ballsPlayed, setBallsPlayed] = useState(0);
  const [stadiums, setStadiums] = useState<StadiumData[]>([
    { id: 1, name: 'Stadium A', playerScore: 0, opponentScore: 0, playedCards: [] },
    { id: 2, name: 'Stadium B', playerScore: 0, opponentScore: 0, playedCards: [] },
    { id: 3, name: 'Stadium C', playerScore: 0, opponentScore: 0, playedCards: [] },
  ]);
  
  const [hand, setHand] = useState<PlayerCard[]>(MOCK_CARDS.slice(0, 4));
  const [cardPool, setCardPool] = useState<PlayerCard[]>(MOCK_CARDS.slice(4));
  const [draggedCard, setDraggedCard] = useState<PlayerCard | null>(null);
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);

  // Ball limit constraint
  const isMatchOver = ballsPlayed >= 6;

  const handleDragStart = (card: PlayerCard) => {
    if (isMatchOver) return;
    setDraggedCard(card);
  };

  const handleDrop = (stadiumId: number) => {
    if (!draggedCard || isMatchOver) return;

    setStadiums(prev => prev.map(s => 
      s.id === stadiumId 
        ? { 
            ...s, 
            playerScore: s.playerScore + Math.floor(draggedCard.runs / 10),
            playedCards: [...s.playedCards, { card: draggedCard, side: 'player' }]
          } 
        : s
    ));

    setHand(prev => {
      const filtered = prev.filter(c => c.id !== draggedCard.id);
      if (cardPool.length > 0) {
        const nextCard = cardPool[0];
        setCardPool(pool => pool.slice(1));
        return [...filtered, nextCard];
      }
      return filtered;
    });

    setDraggedCard(null);
  };

  const handleEndBall = () => {
    if (isMatchOver) return;

    const nextBall = ballsPlayed + 1;
    
    setStadiums(prev => prev.map(s => {
      const oppRuns = Math.floor(Math.random() * 6);
      const oppCard = MOCK_CARDS[Math.floor(Math.random() * MOCK_CARDS.length)];
      return {
        ...s,
        opponentScore: s.opponentScore + oppRuns,
        playedCards: oppRuns > 0 ? [...s.playedCards, { card: oppCard, side: 'opponent' }] : s.playedCards
      };
    }));

    if (nextBall >= 6) {
      setBallsPlayed(6);
      const playerWon = stadiums.filter(s => s.playerScore > s.opponentScore).length;
      const oppWon = stadiums.filter(s => s.opponentScore > s.playerScore).length;
      
      let outcome: 'victory' | 'defeat' | 'draw' = 'draw';
      if (playerWon > oppWon) outcome = 'victory';
      else if (oppWon > playerWon) outcome = 'defeat';
      
      // Irreversible final transition
      setTimeout(() => onComplete(outcome, null), 800);
    } else {
      setBallsPlayed(nextBall);
    }
  };

  // Strategic Refund Logic based on ball count
  const refundFactor = useMemo(() => {
    // Balls Played → Refund %
    // 0–1 → 50%
    // 2 → 45%
    // 3 → 40%
    // 4 → 30%
    // 5 → 20%
    // 6 → 0%
    if (ballsPlayed <= 1) return 0.50;
    if (ballsPlayed === 2) return 0.45;
    if (ballsPlayed === 3) return 0.40;
    if (ballsPlayed === 4) return 0.30;
    if (ballsPlayed === 5) return 0.20;
    return 0;
  }, [ballsPlayed]);

  const refundAmount = useMemo(() => {
    return Math.floor(match.region.entryFee * refundFactor);
  }, [match.region.entryFee, refundFactor]);

  const handleDeclareConfirm = () => {
    setIsDeclareModalOpen(false);
    onComplete('declared', ballsPlayed);
  };

  const forceOutcome = (outcome: 'victory' | 'defeat' | 'draw' | 'declared') => {
    setIsDevPanelOpen(false);
    onComplete(outcome, outcome === 'declared' ? ballsPlayed : null);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none overflow-hidden relative">
      
      {/* SIMULATE RESULT: Yellow/Tactical Style */}
      <button 
        onClick={() => setIsDevPanelOpen(true)}
        className="absolute top-20 right-4 z-[70] px-4 py-2 bg-yellow-500 rounded-full text-[10px] font-black text-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-yellow-400/50 active:scale-95 transition-all"
      >
        <FlaskConical size={12} />
        SIMULATE RESULT
      </button>

      <section className="px-4 py-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <img src="https://images.unsplash.com/photo-1540747913346-19e3adcc174b?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover" alt="" />
          </div>
          <p className="heading-font text-xs font-black uppercase">You</p>
        </div>

        <div className="flex flex-col items-center">
          <p className={`text-[10px] font-black uppercase tracking-widest ${ballsPlayed >= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>
            BALL {Math.min(ballsPlayed + 1, 6)} / 6
          </p>
          <div className="flex items-center gap-2">
            <Coins size={12} className="text-yellow-500" />
            <p className="heading-font text-lg font-bold uppercase truncate max-w-[120px] text-zinc-400">POOL: {match.region.entryFee * 2}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="heading-font text-xs font-black text-red-500 uppercase">{match.opponent.name}</p>
          <div className="w-10 h-10 rounded-full border-2 border-red-600 overflow-hidden">
            <img src={match.opponent.avatar} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </section>

      {/* Main Gameplay Area with scrolling space for fixed footer */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[140px] p-2">
        <section className="flex gap-2 items-stretch min-h-[350px]">
          {stadiums.map((stadium) => {
            const isWinning = stadium.playerScore > stadium.opponentScore;
            return (
              <div 
                key={stadium.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stadium.id)}
                className={`flex-1 flex flex-col rounded-2xl border-2 transition-all duration-300 ${
                  isWinning ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/40'
                }`}
              >
                <div className="p-2 border-b border-zinc-800 text-center">
                  <p className="heading-font text-[10px] font-black text-zinc-500 uppercase truncate">{stadium.name}</p>
                </div>
                <div className="flex-1 flex flex-col justify-around py-4 items-center">
                  <span className="heading-font text-3xl font-black text-zinc-600 opacity-40">{stadium.opponentScore}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isWinning ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-950 border-zinc-800 text-zinc-700'
                  }`}>
                    <Trophy size={16} />
                  </div>
                  <span className={`heading-font text-4xl font-black transition-all ${isWinning ? 'text-white scale-110' : 'text-zinc-400'}`}>
                    {stadium.playerScore}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="px-2 mt-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {hand.map((card) => (
              <div 
                key={card.id}
                draggable={!isMatchOver}
                onDragStart={() => handleDragStart(card)}
                className={`min-w-[90px] transition-all ${isMatchOver ? 'opacity-40 scale-95 grayscale' : 'cursor-grab active:cursor-grabbing hover:-translate-y-2'}`}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FIXED BOTTOM ACTION BAR: Decisive and Solid */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 flex gap-3 p-4 pb-10 z-[60] shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-lg mx-auto w-full flex gap-3">
          <button 
            onClick={() => setIsDeclareModalOpen(true)}
            disabled={isMatchOver}
            className={`p-4 rounded-xl transition-all border ${
              isMatchOver 
                ? 'bg-zinc-900/50 text-zinc-800 border-zinc-900' 
                : 'bg-zinc-900 text-zinc-500 hover:text-white border-zinc-800 active:scale-95'
            }`}
          >
            <ShieldAlert size={24} />
          </button>
          <button 
            onClick={handleEndBall}
            disabled={isMatchOver}
            className={`flex-1 rounded-xl heading-font text-3xl font-black italic uppercase tracking-wider transition-all ${
              isMatchOver
                ? 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_10px_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:scale-[0.98] active:border-b-0'
            }`}
          >
            {isMatchOver ? 'Match Ended' : 'End Ball'}
          </button>
        </div>
      </footer>

      {isDeclareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-red-600/10 rounded-full border border-red-600/20">
                  <AlertTriangle className="text-red-600" size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="heading-font text-3xl font-black italic uppercase text-white">Declare Defeat?</h3>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ball {ballsPlayed + 1} tactical retreat</p>
                </div>

                <div className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Refund Share</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{Math.round(refundFactor * 100)}%</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Refund Amount</span>
                     <span className="heading-font text-2xl font-black text-emerald-500 italic">{refundAmount} Coins</span>
                   </div>
                </div>

                <div className="w-full flex flex-col gap-3 mt-2">
                   <button 
                     onClick={handleDeclareConfirm}
                     className="w-full bg-red-600 text-white py-4 rounded-xl heading-font text-xl font-black uppercase shadow-lg shadow-red-900/30 active:scale-[0.98] transition-all"
                   >
                     Confirm Declaration
                   </button>
                   <button 
                     onClick={() => setIsDeclareModalOpen(false)}
                     className="w-full text-zinc-600 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors py-2"
                   >
                     Cancel
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {isDevPanelOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="heading-font text-2xl font-black italic text-yellow-500">SIMULATE RESULT</h3>
                <X onClick={() => setIsDevPanelOpen(false)} className="text-zinc-600 cursor-pointer" />
             </div>
             <div className="flex flex-col gap-3">
                {['victory', 'defeat', 'draw', 'declared'].map((o) => (
                  <button 
                    key={o}
                    onClick={() => forceOutcome(o as any)}
                    className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl heading-font text-lg font-black uppercase text-white border border-zinc-700 transition-all active:scale-95"
                  >
                    Force {o}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
