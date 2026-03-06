import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export default function CreateScreen() {
  const { settings, updateSettings, createRoom } = useGameStore();
  const [name, setName] = useState(''); // Добавяме стейт за име

  const Stepper = ({ label, value, onMinus, onPlus }: any) => (
    <div className="flex flex-col items-center gap-2 w-full my-3">
      <p className="text-gray-300 font-bold uppercase tracking-widest text-sm">{label}</p>
      <div className="flex items-center justify-between w-full px-4">
        <button onClick={onMinus} className="w-10 h-10 bg-shmatki-magenta/20 border border-shmatki-magenta/40 rounded-full flex items-center justify-center active:scale-90"><Minus size={20} /></button>
        <span className="text-3xl font-black">{value}</span>
        <button onClick={onPlus} className="w-10 h-10 bg-shmatki-cyan/20 border border-shmatki-cyan/40 rounded-full flex items-center justify-center active:scale-90"><Plus size={20} /></button>
      </div>
    </div>
  );

  return (
    <div className="shmatki-card flex flex-col items-center">
      <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-center w-full">Настройки на играта</h2>
      
      {/* Трябва ни име, за да го пратим на PHP */}
      <input 
        type="text" 
        placeholder="Твоето име" 
        className="shmatki-input mb-6"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Stepper label="Играчи" value={settings.players} 
        onMinus={() => updateSettings({ players: Math.max(3, settings.players - 1) })}
        onPlus={() => updateSettings({ players: Math.min(30, settings.players + 1) })} />

      <Stepper label="Импостери" value={settings.imposters} 
        onMinus={() => updateSettings({ imposters: Math.max(1, settings.imposters - 1) })}
        onPlus={() => updateSettings({ imposters: Math.min(Math.floor(settings.players/2), settings.imposters + 1) })} />

      <button 
        onClick={() => {
          if(!name) return alert("Въведи име!");
          createRoom(name); // ТОВА ИЗВИКВА PHP
        }} 
        className="shmatki-button mt-6"
      >
        СЪЗДАЙ
      </button>
    </div>
  );
}