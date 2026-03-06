import { create } from 'zustand';

// Динамично определяне на API адреса
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost/shmatki_api";
  }
  return window.location.origin + "/api";
};

const API_URL = getApiUrl();

export type Phase = 'START' | 'JOIN' | 'CREATE' | 'LOBBY' | 'REVEAL' | 'PLAYING' | 'VOTING' | 'RESULTS';

// Ред на фазите – сървърът не трябва да ни връща назад (напр. след "Разбрах" оставаме в PLAYING)
const PHASE_ORDER: Phase[] = ['START', 'JOIN', 'CREATE', 'LOBBY', 'REVEAL', 'PLAYING', 'VOTING', 'RESULTS'];
const phaseIndex = (p: Phase) => PHASE_ORDER.indexOf(p);
// Само в тези фази сървърът управлява екрана; на START/JOIN/CREATE навигацията е само от потребителя
const SERVER_PHASES: Phase[] = ['LOBBY', 'REVEAL', 'PLAYING', 'VOTING', 'RESULTS'];

interface Player { id: number; username: string; is_host: boolean; }
interface Message { id: number; username: string; text: string; color: string; }

interface GameState {
  phase: Phase;
  myId: number | null;
  roomCode: string;
  players: Player[];
  messages: Message[];
  role: 'innocent' | 'imposter' | null;
  word: string | null;
  hint: string | null;
  settings: { players: number; imposters: number; roundTime: string };

  setPhase: (phase: Phase, push?: boolean) => void;
  updateSettings: (s: any) => void;
  createRoom: (u: string) => Promise<void>;
  joinRoom: (u: string, c: string) => Promise<void>;
  fetchGameState: () => Promise<void>;
  sendMessage: (t: string) => Promise<void>;
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

  setPhase: (phase, push = true) => {
    if (push) window.history.pushState({ phase }, '', '');
    set({ phase });
  },

  updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),

  createRoom: async (username) => {
    try {
      const res = await fetch(`${API_URL}/create_room.php`, {
        method: 'POST',
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.success) {
        set({ roomCode: data.room_code, myId: data.my_id });
        get().setPhase('LOBBY');
      }
    } catch (e) { console.error(e); }
  },

  joinRoom: async (username, code) => {
    try {
      const res = await fetch(`${API_URL}/join_room.php`, {
        method: 'POST',
        body: JSON.stringify({ username, code: code.toUpperCase() })
      });
      const data = await res.json();
      if (data.success) {
        set({ roomCode: code.toUpperCase(), myId: data.my_id });
        get().setPhase('LOBBY');
      } else { alert(data.error); }
    } catch (e) { console.error(e); }
  },

  fetchGameState: async () => {
    const { roomCode, myId, phase: currentPhase } = get();
    if (!roomCode || !myId) return;
    try {
      const res = await fetch(`${API_URL}/get_state.php?code=${roomCode}&user_id=${myId}&t=${Date.now()}`);
      const data = await res.json();
      if (data.error) return;
      const serverPhase = data.status.toUpperCase() as Phase;
      // Фаза от сървъра прилагаме САМО когато сме вече в игра (LOBBY→RESULTS).
      // На START/JOIN/CREATE навигацията е само от потребителя – иначе при "Влез" те тегли в стара игра.
      const serverDrivesPhase = SERVER_PHASES.includes(currentPhase);
      const onlyUpdateIfAheadOrSame = serverDrivesPhase && phaseIndex(serverPhase) >= phaseIndex(currentPhase);
      set({
        ...(onlyUpdateIfAheadOrSame && { phase: serverPhase }),
        players: data.players,
        messages: data.messages.map((m: any, i: number) => ({
          ...m, id: i, color: m.username === get().players.find(p => p.id === myId)?.username ? '#22d3ee' : '#a855f7'
        })),
        role: data.me.role, word: data.me.word, hint: data.me.hint
      });
    } catch (e) { }
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