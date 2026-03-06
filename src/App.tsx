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
  const phase = useGameStore((state) => state.phase);

  const renderScreen = () => {
    switch (phase) {
      case 'START': return <StartScreen key="start" />;
      case 'JOIN': return <JoinScreen key="join" />;
      case 'CREATE': return <CreateScreen key="create" />;
      case 'LOBBY': return <LobbyScreen key="lobby" />;
      case 'REVEAL': return <RevealScreen key="reveal" />;
      case 'PLAYING': return <GameScreen key="playing" />;
      case 'VOTING': return <VotingScreen key="voting" />;
      case 'RESULTS': return <ResultsScreen key="results" />;
      default: return <StartScreen key="start" />;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#12102e] text-white overflow-hidden relative select-none touch-manipulation">
      <div className="absolute inset-0 bg-shmatki-gradient z-0" />
      <main className="relative z-10 h-full w-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}