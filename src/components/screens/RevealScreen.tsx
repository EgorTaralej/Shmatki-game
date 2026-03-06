import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

export default function RevealScreen() {
  const { players, myId, setPhase } = useGameStore();
  const me = players.find(p => p.id === myId);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-6">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="shmatki-card py-16"
      >
        <h2 className="text-4xl font-black mb-8 leading-tight">
          ТИ СИ <br /> 
          <span className={me?.role === 'imposter' ? 'text-shmatki-magenta' : 'text-shmatki-cyan'}>
            {me?.role === 'imposter' ? 'ИМПОСТЕР' : 'СЕЛЯНИН'}
          </span>
        </h2>

        <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
          {me?.role === 'imposter' ? (
            <>
              <p className="text-gray-400 text-sm uppercase font-bold mb-2">Думата е свързана с:</p>
              <p className="text-2xl font-black tracking-widest">{me.hint}</p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm uppercase font-bold mb-2">Думата е:</p>
              <p className="text-3xl font-black tracking-widest text-shmatki-cyan">{me?.word}</p>
            </>
          )}
        </div>

        <button 
          onClick={() => setPhase('PLAYING')}
          className="shmatki-button mt-12 w-full"
        >
          РАЗБРАХ
        </button>
      </motion.div>
    </div>
  );
}