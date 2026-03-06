import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

export default function ResultsScreen() {
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <motion.div
        initial={{ rotate: -10, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        className="shmatki-card border-shmatki-cyan"
      >
        <h2 className="text-3xl font-black mb-4">РУНДЪТ ЗАВЪРШИ!</h2>
        <div className="text-6xl mb-6">🏆</div>
        <p className="text-xl font-bold mb-2 uppercase tracking-widest">Шматката беше хваната!</p>
        <p className="text-shmatki-cyan font-black text-2xl uppercase italic">egorka864</p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <button onClick={() => setPhase('LOBBY')} className="shmatki-button">
          НОВ РУНД
        </button>
        <button onClick={() => setPhase('START')} className="opacity-60 text-sm font-bold uppercase tracking-widest">
          КЪМ НАЧАЛОТО
        </button>
      </div>
    </div>
  );
}