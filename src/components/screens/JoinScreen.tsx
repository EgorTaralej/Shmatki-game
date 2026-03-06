import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export default function JoinScreen() {
  const joinRoom = useGameStore((state) => state.joinRoom);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[320px]">
      <div className="flex flex-col gap-4 w-full">
        <input 
          type="text" placeholder="име" className="shmatki-input"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="text" placeholder="код" className="shmatki-input uppercase"
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
        />
      </div>

      <button 
        onClick={() => {
          if(!name || !code) return alert("Попълни всичко!");
          joinRoom(name, code); // ТОВА ИЗВИКВА PHP
        }} 
        className="shmatki-button"
      >
        ВЛЕЗ
      </button>
    </div>
  );
}