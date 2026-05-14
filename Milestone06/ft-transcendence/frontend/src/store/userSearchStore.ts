import { create } from 'zustand';
import { searchUsers, type PublicUser } from '../api/social';

type UserSearchState = {
  query: string;
  results: PublicUser[];
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  search: (token: string) => Promise<void>;
  clear: () => void;
};

export const useUserSearchStore = create<UserSearchState>((set, get) => ({
  query: '',
  results: [],
  loading: false,
  error: null,

  setQuery(query) {
    set({ query });
  },

  async search(token) {
    const query = get().query.trim();
    if (!query) {
      set({ results: [], error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const results = await searchUsers(token, query);
      set({ results });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search users',
        results: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  clear() {
    set({ query: '', results: [], loading: false, error: null });
  },
}));
