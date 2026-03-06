import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import StartScreen from './components/screens/StartScreen';
import JoinScreen from './components/screens/JoinScreen';
import CreateScreen from './components/screens/CreateScreen';
import LobbyScreen from './components/screens/LobbyScreen';
import RevealScreen from './components/screens/RevealScreen';
import GameScreen from './components/screens/GameScreen';
import VotingScreen from './components/screens/VotingScreen';
import ResultsScreen from './components/screens/ResultsScreen';

export default function App() {
  const { phase, roomCode, myId, fetchGameState } = useGameStore();

  useEffect(() => {
    let interval: any;
    if (roomCode && myId) {
      fetchGameState();
      interval = setInterval(fetchGameState, 1500);
    }
    return () => clearInterval(interval);
  }, [roomCode, myId, fetchGameState]);

  return (
    <div className="h-[100dvh] w-full bg-[#12102e] text-white overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b] to-[#12102e] z-0" />
      <main className="relative z-10 h-full w-full flex items-center justify-center p-6 safe-padding">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
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