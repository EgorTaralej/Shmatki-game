import { useGameStore } from '../../store/useGameStore';

export default function LobbyScreen() {
  const roomCode = useGameStore(s => s.roomCode);
  const players = useGameStore(s => s.players);
  const myId = useGameStore(s => s.myId);
  const startMatch = useGameStore(s => s.startMatch);

  const me = players.find(p => p.id === myId);
  const is_host = me?.is_host;

  return (
    <div className="flex flex-col items-center w-full h-full py-10">
      <div className="text-center mb-10">
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Код на стаята</p>
        <h2 className="text-4xl font-black text-cyan-400 tracking-widest italic">{roomCode || "---"}</h2>
      </div>
      <div className="w-full flex-1 px-6 overflow-y-auto">
        <p className="text-center font-black text-xl mb-6 italic uppercase">ИГРАЧИ ({players.length}):</p>
        <div className="flex flex-col gap-3">
          {players.map(p => (
            <div key={p.id} className="bg-white/5 py-4 px-6 rounded-2xl flex items-center border border-white/5">
              <div className={`w-2 h-2 rounded-full mr-4 ${p.is_host ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-600'}`} />
              <span className="text-lg font-bold">{p.username} {p.is_host && " (ШЕФ)"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto w-full px-6">
        {is_host ? (
          <button onClick={startMatch} className="shmatki-button">ЗАПОЧНИ ИГРА</button>
        ) : (
          <p className="text-center text-[10px] text-gray-500 uppercase font-black animate-pulse">изчакване шефът да почне...</p>
        )}
      </div>
    </div>
  );
}