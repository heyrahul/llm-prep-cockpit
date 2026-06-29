import { create } from 'zustand';

interface UiState {
  searchOpen: boolean;
  settingsOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  settingsOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
