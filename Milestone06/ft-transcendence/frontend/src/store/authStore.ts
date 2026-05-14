import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string | null;
}

interface AuthState {
  me: User | null;
  user: User | null;
  token: string | null;
  setAuth: (user: Partial<User> & { id: string; username: string }, token: string) => void;
  setMe: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

function normalizeUser(input: Partial<User> & { id: string; username: string }): User {
  return {
    id: input.id,
    username: input.username,
    name: input.name ?? input.username,
    avatar: input.avatar ?? null,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      me: null,
      user: null,
      token: null,
      setAuth: (user, token) => {
        const normalized = normalizeUser(user);
        set({ me: normalized, user: normalized, token });
      },
      setMe: (user) => set({ me: user, user }),
      updateUser: (updates) =>
        set((s) => {
          if (!s.user && !s.me) return s;
          const next = { ...(s.me ?? s.user), ...updates } as User;
          return { me: next, user: next };
        }),
      logout: () => set({ me: null, user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);

export const updateAvatar = async (token: string, base64: string) => {
  const res = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ avatar: base64 }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update avatar');
  }

  return res.json();
};
