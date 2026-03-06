import { useGameStore } from '../../store/useGameStore';

export default function VotingScreen() {
  const { players, setPhase } = useGameStore();

  return (
    <div className="flex flex-col items-center w-full h-full py-6">
      <h2 className="text-2xl font-black mb-6 italic tracking-tighter">КОЙ Е ШМАТКАТА?</h2>
      
      <div className="grid grid-cols-1 w-full gap-3 px-4">
        {players.map(p => (
          <button 
            key={p.id}
            onClick={() => setPhase('RESULTS')}
            className="w-full bg-white/5 border-2 border-white/10 hover:border-shmatki-magenta py-4 rounded-2xl flex items-center px-6 transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 bg-btn-gradient rounded-full mr-4" />
            <span className="text-xl font-bold">{p.username}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto w-full px-4 py-6">
        <p className="text-center text-gray-500 text-sm mb-4 italic">Всички трябва да гласуват...</p>
      </div>
    </div>
  );
}