import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectedClientsState {
  selectedIds: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

export const useSelectedClientsStore = create<SelectedClientsState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      toggle: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id],
        })),
      remove: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((item) => item !== id),
        })),
      clear: () => set({ selectedIds: [] }),
      isSelected: (id) => get().selectedIds.includes(id),
    }),
    { name: 'selected-clients-storage' },
  ),
);
