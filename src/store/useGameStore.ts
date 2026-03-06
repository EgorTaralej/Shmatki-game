import { create } from 'zustand';

export type Phase = 'START' | 'JOIN' | 'CREATE' | 'LOBBY' | 'REVEAL' | 'PLAYING' | 'VOTING' | 'RESULTS';

interface Player {
  id: number;
  username: string;
  isHost: boolean;
  role?: 'innocent' | 'imposter';
  word?: string;
  hint?: string;
}

interface Message {
  id: number;
  username: string;
  text: string;
  color: string;
}

interface GameSettings {
  players: number;
  imposters: number;
  roundTime: string;
}

interface GameState {
  phase: Phase;
  myId: number;
  roomCode: string;
  players: Player[];
  messages: Message[];
  settings: GameSettings;
  setPhase: (phase: Phase) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  addMessage: (text: string) => void;
  startMatch: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'START',
  myId: 1,
  roomCode: 'H8YRV5',
  players: [
    { id: 1, username: 'egorka864', isHost: true },
    { id: 2, username: 'toksikkosio', isHost: false },
    { id: 3, username: 'martoseksa69', isHost: false },
    { id: 4, username: 'stankogrozniq4', isHost: false },
  ],
  messages: [],
  settings: {
    players: 4,
    imposters: 1,
    roundTime: '2:00',
  },
  
  setPhase: (phase) => set({ phase }),
  
  updateSettings: (newSettings) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),

  addMessage: (text) => set((state) => {
    const me = state.players.find(p => p.id === state.myId);
    const newMessage = {
      id: Date.now(),
      username: me?.username || 'Анонимен',
      text: text,
      color: me?.id === state.myId ? '#22d3ee' : '#a855f7' 
    };
    return { messages: [...state.messages, newMessage] };
  }),

  startMatch: () => {
    set((state) => {
      const randomIndex = Math.floor(Math.random() * state.players.length);
      const imposterId = state.players[randomIndex].id;
      return {
        phase: 'REVEAL',
        messages: [], // Нулираме чата за новия рунд
        players: state.players.map(p => ({
          ...p,
          role: p.id === imposterId ? 'imposter' : 'innocent',
          word: p.id === imposterId ? undefined : 'САМОЛЕТ',
          hint: 'ТРАНСПОРТ'
        }))
      };
    });
  }
}));