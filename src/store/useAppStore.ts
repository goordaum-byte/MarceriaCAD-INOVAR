import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isSyncing: boolean;
  setSyncing: (syncing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isSyncing: false,
  setSyncing: (isSyncing) => set({ isSyncing }),
}));
