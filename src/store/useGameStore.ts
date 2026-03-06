import { create } from 'zustand';

const API_URL = "http://localhost/shmatki_api";

export type Phase = 'START' | 'JOIN' | 'CREATE' | 'LOBBY' | 'REVEAL' | 'PLAYING' | 'VOTING' | 'RESULTS';

interface Player {
  id: number;
  username: string;
  is_host: boolean;
}

interface Message {
  username: string;
  text: string;
}

interface GameState {
  phase: Phase;
  myId: number | null;
  roomCode: string;
  players: Player[];
  messages: Message[];
  role: string | null;
  word: string | null;
  hint: string | null;
  settings: { players: number; imposters: number; roundTime: string };

  setPhase: (phase: Phase) => void;
  updateSettings: (s: any) => void;
  createRoom: (username: string) => Promise<void>;
  joinRoom: (username: string, code: string) => Promise<void>;
  fetchGameState: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  startMatch: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'START',
  myId: null,
  roomCode: '',
  players: [],
  messages: [],
  role: null,
  word: null,
  hint: null,
  settings: { players: 4, imposters: 1, roundTime: '2:00' },

  setPhase: (phase) => set({ phase }),
  updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),

  createRoom: async (username) => {
    try {
      const res = await fetch(`${API_URL}/create_room.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ТОВА Е ВАЖНО
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.success) {
        set({ roomCode: data.room_code, myId: data.my_id, phase: 'LOBBY' });
      }
    } catch (e) { console.error("PHP Error:", e); }
  },
  
  joinRoom: async (username, code) => {
    try {
      const res = await fetch(`${API_URL}/join_room.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ТОВА Е ВАЖНО
        body: JSON.stringify({ username, code })
      });
      const data = await res.json();
      if (data.success) {
        set({ roomCode: code, myId: data.my_id, phase: 'LOBBY' });
      } else { alert(data.error); }
    } catch (e) { console.error("PHP Error:", e); }
  },

  fetchGameState: async () => {
    const { roomCode, myId } = get();
    if (!roomCode || !myId) return;
    try {
      const res = await fetch(`${API_URL}/get_state.php?code=${roomCode}&user_id=${myId}`);
      const data = await res.json();
      if (data.error) return;
      set({
        phase: data.status.toUpperCase() as Phase,
        players: data.players,
        messages: data.messages,
        role: data.me.role,
        word: data.me.word,
        hint: data.me.hint
      });
    } catch (e) { console.error(e); }
  },

  sendMessage: async (text) => {
    const { roomCode, myId } = get();
    await fetch(`${API_URL}/send_message.php`, {
      method: 'POST',
      body: JSON.stringify({ code: roomCode, user_id: myId, text })
    });
  },

  startMatch: async () => {
    const { roomCode } = get();
    await fetch(`${API_URL}/start_game.php`, {
      method: 'POST',
      body: JSON.stringify({ code: roomCode })
    });
  }
}));