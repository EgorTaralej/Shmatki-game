import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Send } from 'lucide-react';

export default function GameScreen() {
  const { players, messages, sendMessage, setPhase } = useGameStore();
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const onSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative">
      <div className="text-center py-4 font-black text-2xl text-purple-500 italic">01:45</div>
      <div className="grid grid-cols-4 gap-2 px-2 mb-4">
        {players.map(p => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="w-10 h-10 bg-cyan-400 rounded-full border-2 border-white/10" />
            <span className="text-[10px] font-bold mt-1 truncate w-full text-center text-gray-400 uppercase">{p.username}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 mx-2 mb-4 bg-black/30 rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="text-[9px] font-black uppercase text-cyan-400">{msg.username}</span>
              <div className="bg-white/10 py-2 px-4 rounded-2xl rounded-tl-none text-sm text-gray-100">{msg.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-black/80 border-t border-white/10 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} className="shmatki-input text-base h-14" placeholder="Твоята дума..." />
        <button onClick={onSend} className="w-14 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center text-black"><Send /></button>
      </div>
      <button onClick={() => setPhase('VOTING')} className="text-[10px] text-gray-500 uppercase font-black py-2">Гласуване →</button>
    </div>
  );
}