import { useGameStore } from '../../store/useGameStore';

export default function LobbyScreen() {
  const { roomCode, players, startMatch, myId } = useGameStore();
  const isHost = players.find(p => p.id === myId)?.isHost;

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] h-full py-8">
      <div className="text-center mb-10">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Код на играта:</p>
        <h2 className="text-4xl font-black text-shmatki-cyan tracking-widest">{roomCode}</h2>
      </div>

      <div className="w-full flex-1 overflow-y-auto px-2">
        <p className="text-center font-black text-xl mb-4 tracking-tighter">ИГРАЧИ:</p>
        <div className="flex flex-col gap-3">
          {players.map((player) => (
            <div key={player.id} className="bg-white/10 backdrop-blur-md py-3 px-6 rounded-2xl flex items-center justify-between border border-white/5">
              <span className="text-lg font-bold text-gray-200">
                {player.isHost && <span className="text-shmatki-cyan mr-2">*</span>}
                {player.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full">
        {isHost ? (
          <button onClick={startMatch} className="shmatki-button w-full">ЗАПОЧНИ ИГРА</button>
        ) : (
          <p className="text-center text-sm text-gray-400 italic animate-pulse">
            изчакване ШЕФЪТ да почне играта
          </p>
        )}
      </div>
    </div>
  );
}