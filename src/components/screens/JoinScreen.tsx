import { useGameStore } from '../../store/useGameStore';

export default function JoinScreen() {
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-[320px]">
      <div className="flex flex-col gap-5 w-full">
        <input 
          type="text" 
          placeholder="име" 
          className="shmatki-input"
          autoComplete="off"
          spellCheck="false"
        />
        <input 
          type="text" 
          placeholder="код" 
          className="shmatki-input uppercase placeholder:normal-case"
          autoComplete="off"
          maxLength={6}
        />
      </div>

      <button onClick={() => setPhase('LOBBY')} className="shmatki-button w-full">
        ВЛЕЗ
      </button>
    </div>
  );
}