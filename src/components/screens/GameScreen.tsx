import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameScreen() {
  const { players, messages, addMessage, setPhase } = useGameStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    addMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative safe-padding">
      
      {/* Таймер горе */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-block bg-black/40 px-6 py-2 rounded-full border border-shmatki-magenta/30 shadow-lg shadow-shmatki-magenta/10">
          <span className="font-black text-2xl tabular-nums text-shmatki-magenta italic">01:45</span>
        </div>
      </div>

      {/* Мрежа от играчи (Компактна) */}
      <div className="grid grid-cols-4 gap-2 px-2 mb-4">
        {players.map(p => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="w-10 h-10 bg-btn-gradient rounded-full border-2 border-white/10 shadow-lg" />
            <span className="text-[10px] font-bold mt-1 truncate w-full text-center text-gray-400 uppercase tracking-tighter">
              {p.username}
            </span>
          </div>
        ))}
      </div>

      {/* ПРОЗОРЕЦ ЗА ЧАТ */}
      <div className="flex-1 mx-2 mb-4 bg-black/30 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-inner relative">
        <div className="p-3 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-shmatki-cyan">
            Обсъждане
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 px-10">
              <p className="text-center text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Напиши първата дума-асоциация...
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                key={msg.id} 
                className="flex flex-col items-start"
              >
                <span className="text-[9px] font-black uppercase mb-1 ml-2" style={{ color: msg.color }}>
                  {msg.username}
                </span>
                <div className="bg-white/10 border border-white/5 py-2.5 px-4 rounded-2xl rounded-tl-none shadow-sm">
                  <p className="text-sm text-gray-100 font-medium">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Контроли долу */}
      <div className="p-4 bg-shmatki-dark/80 backdrop-blur-2xl border-t border-white/10">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Твоята дума..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="shmatki-input text-left px-6 text-sm h-14"
            autoComplete="off"
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-shmatki-cyan rounded-2xl flex items-center justify-center text-black active:scale-90 transition-all shadow-lg shadow-shmatki-cyan/20"
          >
            <Send size={24} />
          </button>
        </div>
        
        <button 
          onClick={() => setPhase('VOTING')}
          className="mt-3 w-full py-1 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-shmatki-magenta transition-colors active:scale-95"
        >
          Приключи обсъждането →
        </button>
      </div>
    </div>
  );
}