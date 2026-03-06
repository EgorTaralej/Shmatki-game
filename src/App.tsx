import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import type { Phase } from './store/useGameStore';

import StartScreen from './components/screens/StartScreen';
import JoinScreen from './components/screens/JoinScreen';
import CreateScreen from './components/screens/CreateScreen';
import LobbyScreen from './components/screens/LobbyScreen';
import RevealScreen from './components/screens/RevealScreen';
import GameScreen from './components/screens/GameScreen';
import VotingScreen from './components/screens/VotingScreen';
import ResultsScreen from './components/screens/ResultsScreen';

const VALID_PHASES: Phase[] = ['START', 'JOIN', 'CREATE', 'LOBBY', 'REVEAL', 'PLAYING', 'VOTING', 'RESULTS'];

export default function App() {
  const { phase, roomCode, myId, fetchGameState, setPhase } = useGameStore();

  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const p = e.state?.phase as Phase;
      if (p && VALID_PHASES.includes(p)) setPhase(p, false);
    };
    window.addEventListener('popstate', onPopState);
    // Винаги задаваме текущия запис в историята да е текущата фаза – иначе при Back от "Влез"
    // може да се върне старо state (напр. PLAYING/чат) и да те хвърли в чата
    const current = useGameStore.getState().phase;
    window.history.replaceState({ phase: current }, '', '');
    return () => window.removeEventListener('popstate', onPopState);
  }, [setPhase]);

  useEffect(() => {
    let interval: any;
    if (roomCode && myId) {
      fetchGameState();
      interval = setInterval(fetchGameState, 1500);
    }
    return () => clearInterval(interval);
  }, [roomCode, myId, fetchGameState]);

  return (
    <div className="h-[100dvh] w-full bg-[#12102e] text-white overflow-hidden relative select-none touch-manipulation">
      <div className="absolute inset-0 bg-shmatki-gradient z-0 opacity-50" />
      <main className="relative z-10 h-full w-full flex items-center justify-center p-6 safe-padding">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center max-w-lg mx-auto"
          >
            {phase === 'START' && <StartScreen />}
            {phase === 'JOIN' && <JoinScreen />}
            {phase === 'CREATE' && <CreateScreen />}
            {phase === 'LOBBY' && <LobbyScreen />}
            {phase === 'REVEAL' && <RevealScreen />}
            {phase === 'PLAYING' && <GameScreen />}
            {phase === 'VOTING' && <VotingScreen />}
            {phase === 'RESULTS' && <ResultsScreen />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}