import { useGameStore } from '../../store/useGameStore';

export default function StartScreen() {
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <div className="flex flex-col items-center justify-around h-[70dvh] w-full max-w-[300px]">
      <h1 className="text-6xl font-black italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
        ШМАТКИ
      </h1>
      
      <div className="flex flex-col gap-5 w-full">
        <button onClick={() => setPhase('JOIN')} className="shmatki-button">
          ВЛЕЗ
        </button>
        <button onClick={() => setPhase('CREATE')} className="shmatki-button">
          СЪЗДАЙ ИГРА
        </button>
      </div>
    </div>
  );
}