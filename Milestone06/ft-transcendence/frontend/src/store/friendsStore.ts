import { create } from 'zustand';
import {
  acceptFriend,
  fetchFriendRequests,
  fetchFriends,
  removeFriend,
  requestFriend,
  type FriendRequestItem,
  type PublicUser,
} from '../api/social';

type FriendsState = {
  friends: PublicUser[];
  requests: FriendRequestItem[];
  loadingFriends: boolean;
  loadingRequests: boolean;
  mutating: boolean;
  error: string | null;
  loadFriends: (token: string) => Promise<void>;
  loadRequests: (token: string) => Promise<void>;
  requestTo: (token: string, userId: string) => Promise<void>;
  acceptFrom: (token: string, requesterId: string) => Promise<void>;
  removeWith: (token: string, userId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  requests: [],
  loadingFriends: false,
  loadingRequests: false,
  mutating: false,
  error: null,

  async loadFriends(token) {
    set({ loadingFriends: true, error: null });
    try {
      const friends = await fetchFriends(token);
      set({ friends });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load friends' });
    } finally {
      set({ loadingFriends: false });
    }
  },

  async loadRequests(token) {
    set({ loadingRequests: true, error: null });
    try {
      const requests = await fetchFriendRequests(token);
      set({ requests });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load friend requests' });
    } finally {
      set({ loadingRequests: false });
    }
  },

  async requestTo(token, userId) {
    set({ mutating: true, error: null });
    try {
      await requestFriend(token, userId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send request' });
      throw error;
    } finally {
      set({ mutating: false });
    }
  },

  async acceptFrom(token, requesterId) {
    set({ mutating: true, error: null });
    try {
      await acceptFriend(token, requesterId);
      await Promise.all([get().loadFriends(token), get().loadRequests(token)]);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to accept request' });
      throw error;
    } finally {
      set({ mutating: false });
    }
  },

  async removeWith(token, userId) {
    set({ mutating: true, error: null });
    try {
      await removeFriend(token, userId);
      await Promise.all([get().loadFriends(token), get().loadRequests(token)]);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to remove friendship' });
      throw error;
    } finally {
      set({ mutating: false });
    }
  },

  clearError() {
    set({ error: null });
  },

  reset() {
    set({
      friends: [],
      requests: [],
      loadingFriends: false,
      loadingRequests: false,
      mutating: false,
      error: null,
    });
  },
}));
