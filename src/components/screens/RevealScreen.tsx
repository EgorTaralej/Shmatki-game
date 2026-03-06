// src/components/RevealScreen.tsx
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

export default function RevealScreen() {
  const { role, word, hint, setPhase } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      <motion.div 
        initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.5 }}
        className="shmatki-card py-16 flex flex-col items-center"
      >
        <h2 className="text-4xl font-black mb-8 leading-tight italic text-center uppercase">
          ТИ СИ <br /> 
          <span className={role === 'imposter' ? 'text-shmatki-magenta' : 'text-shmatki-cyan'}>
            {role === 'imposter' ? 'ИМПОСТЕР' : 'СЕЛЯНИН'}
          </span>
        </h2>

        <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 w-full text-center shadow-inner">
          {role === 'imposter' ? (
            <>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Думата е свързана с:</p>
              <p className="text-2xl font-black tracking-[0.2em]">{hint}</p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Думата е:</p>
              <p className="text-3xl font-black tracking-[0.2em] text-shmatki-cyan">{word}</p>
            </>
          )}
        </div>

        <button onClick={() => setPhase('PLAYING')} className="shmatki-button mt-12 w-full">РАЗБРАХ</button>
      </motion.div>
    </div>
  );
}