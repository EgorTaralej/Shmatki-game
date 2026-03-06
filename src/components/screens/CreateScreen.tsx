import { Minus, Plus } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export default function CreateScreen() {
  const { settings, updateSettings, setPhase } = useGameStore();

  const Stepper = ({ label, value, onMinus, onPlus }: any) => (
    <div className="flex flex-col items-center gap-2 w-full my-3">
      <p className="text-gray-300 font-bold uppercase tracking-widest text-sm">{label}</p>
      <div className="flex items-center justify-between w-full px-4">
        <button onClick={onMinus} className="w-12 h-12 bg-shmatki-magenta/30 border border-shmatki-magenta/50 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <Minus size={24} />
        </button>
        <span className="text-3xl font-black">{value}</span>
        <button onClick={onPlus} className="w-12 h-12 bg-shmatki-cyan/30 border border-shmatki-cyan/50 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-shmatki-cyan/20 to-transparent mt-2" />
    </div>
  );

  return (
    <div className="shmatki-card flex flex-col items-center">
      <div className="bg-gray-700/60 px-6 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
        Настройки на играта
      </div>

      <Stepper label="Играчи" value={settings.players} 
        onMinus={() => updateSettings({ players: Math.max(3, settings.players - 1) })}
        onPlus={() => updateSettings({ players: Math.min(30, settings.players + 1) })} />

      <Stepper label="Импостери" value={settings.imposters} 
        onMinus={() => updateSettings({ imposters: Math.max(1, settings.imposters - 1) })}
        onPlus={() => updateSettings({ imposters: Math.min(Math.floor(settings.players/2), settings.imposters + 1) })} />

      <Stepper label="Време на рунда" value={settings.roundTime} 
        onMinus={() => {}} onPlus={() => {}} />

      <button onClick={() => setPhase('LOBBY')} className="shmatki-button w-full mt-6">
        СЪЗДАЙ
      </button>
    </div>
  );
}