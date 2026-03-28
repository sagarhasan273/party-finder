import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Lobby, LobbyFilters } from '../types';

// ── Mock data (replace with real API calls) ──────────────────────────────────
const MOCK_LOBBIES: Lobby[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'Gold-Plat ranked, chill vibes only',
    description: 'Looking for a calm Duelist main. Mic required. No tilting.',
    rankMin: 'Gold',
    rankMax: 'Platinum',
    map: 'Ascent',
    rolesNeeded: JSON.stringify(['Duelist']),
    region: 'NA',
    status: 'open',
    hostUsername: 'NightReaper',
    hostTag: '1337',
    discordLink: 'https://discord.gg/example',
    currentPlayers: 4,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'u2',
    title: 'Diamond grind – serious only',
    description: 'NA Diamond lobby. Must have 200+ hours. Controller or Initiator.',
    rankMin: 'Diamond',
    rankMax: 'Ascendant',
    map: 'Haven',
    rolesNeeded: JSON.stringify(['Controller', 'Initiator']),
    region: 'NA',
    status: 'open',
    hostUsername: 'SilverArrow',
    hostTag: '9999',
    currentPlayers: 4,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'u3',
    title: 'EU Silver ranked – for fun',
    description: 'Casual Silver lobby in EU. Just here to have a good time.',
    rankMin: 'Silver',
    rankMax: 'Gold',
    map: 'Any',
    rolesNeeded: JSON.stringify(['Any']),
    region: 'EU',
    status: 'open',
    hostUsername: 'BladeStorm',
    hostTag: '4242',
    currentPlayers: 4,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    userId: 'u4',
    title: 'Immortal+ KR server',
    description: 'Fast-paced KR lobby. High skill ceiling required.',
    rankMin: 'Immortal',
    rankMax: 'Radiant',
    map: 'Split',
    rolesNeeded: JSON.stringify(['Duelist', 'Sentinel']),
    region: 'KR',
    status: 'full',
    hostUsername: 'ProtoX',
    hostTag: '0001',
    currentPlayers: 5,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    userId: 'u5',
    title: 'Bronze beginners welcome',
    description: 'Learning the game. Everyone welcome, just be kind.',
    rankMin: 'Iron',
    rankMax: 'Bronze',
    map: 'Bind',
    rolesNeeded: JSON.stringify(['Any']),
    region: 'EU',
    status: 'open',
    hostUsername: 'FrostByte',
    hostTag: '7777',
    currentPlayers: 3,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    userId: 'u6',
    title: 'AP Plat/Diamond ranked queue',
    description: 'Consistent teammates wanted. We play Pearl/Lotus mainly.',
    rankMin: 'Platinum',
    rankMax: 'Diamond',
    map: 'Pearl',
    rolesNeeded: JSON.stringify(['Controller']),
    region: 'AP',
    status: 'closed',
    hostUsername: 'VoidHunter',
    hostTag: '5500',
    currentPlayers: 4,
    maxPlayers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface LobbiesState {
  items: Lobby[];
  myLobbies: Lobby[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  myStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  filters: LobbyFilters;
}

const DEFAULT_FILTERS: LobbyFilters = {
  search: '',
  rankMin: '',
  map: '',
  region: '',
  openOnly: false,
};

const initialState: LobbiesState = {
  items: [],
  myLobbies: [],
  status: 'idle',
  myStatus: 'idle',
  filters: DEFAULT_FILTERS,
};

// Async thunks (simulated – replace with axios calls)
export const fetchLobbies = createAsyncThunk('lobbies/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 700));
  return MOCK_LOBBIES;
});

export const fetchMyLobbies = createAsyncThunk(
  'lobbies/fetchMy',
  async (userId: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_LOBBIES.filter((l) => l.userId === userId);
  }
);

export const createLobby = createAsyncThunk(
  'lobbies/create',
  async (lobby: Omit<Lobby, 'id' | 'createdAt' | 'updatedAt'>) => {
    await new Promise((r) => setTimeout(r, 600));
    const newLobby: Lobby = {
      ...lobby,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newLobby;
  }
);

export const toggleLobbyStatus = createAsyncThunk(
  'lobbies/toggleStatus',
  async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
    await new Promise((r) => setTimeout(r, 400));
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    return { id, status: newStatus as Lobby['status'] };
  }
);

export const deleteLobby = createAsyncThunk(
  'lobbies/delete',
  async (id: string) => {
    await new Promise((r) => setTimeout(r, 400));
    return id;
  }
);

const lobbiesSlice = createSlice({
  name: 'lobbies',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<LobbyFilters>) {
      state.filters = action.payload;
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTERS;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLobbies
      .addCase(fetchLobbies.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLobbies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLobbies.rejected, (state) => { state.status = 'failed'; })
      // fetchMyLobbies
      .addCase(fetchMyLobbies.pending, (state) => { state.myStatus = 'loading'; })
      .addCase(fetchMyLobbies.fulfilled, (state, action) => {
        state.myStatus = 'succeeded';
        state.myLobbies = action.payload;
      })
      .addCase(fetchMyLobbies.rejected, (state) => { state.myStatus = 'failed'; })
      // createLobby
      .addCase(createLobby.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.myLobbies.unshift(action.payload);
      })
      // toggleLobbyStatus
      .addCase(toggleLobbyStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const updateIn = (arr: Lobby[]) => {
          const item = arr.find((l) => l.id === id);
          if (item) item.status = status;
        };
        updateIn(state.items);
        updateIn(state.myLobbies);
      })
      // deleteLobby
      .addCase(deleteLobby.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
        state.myLobbies = state.myLobbies.filter((l) => l.id !== action.payload);
      });
  },
});

export const { setFilters, resetFilters } = lobbiesSlice.actions;
export default lobbiesSlice.reducer;
