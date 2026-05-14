import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { fetchChatMessages, type ChatHistoryResponse, type ChatMessage, type PublicUser } from '../api/social';
import { useAuthStore } from './authStore';

type SocketStatus = 'disconnected' | 'connecting' | 'connected';

type ChatStore = {
  activeUser: PublicUser | null;
  messages: ChatMessage[];
  unreadByUserId: Record<string, number>;
  isChatPageOpen: boolean;
  nextCursor: string | null;
  loadingHistory: boolean;
  sending: boolean;
  socketStatus: SocketStatus;
  socketError: string | null;
  error: string | null;
  setChatPageOpen: (open: boolean) => void;
  setActiveUser: (user: PublicUser | null) => void;
  connect: (token: string) => void;
  disconnect: () => void;
  loadHistory: (token: string, otherUserId: string, reset?: boolean) => Promise<void>;
  sendMessage: (toUserId: string, text: string) => Promise<boolean>;
  pushIncoming: (message: ChatMessage) => void;
  markRead: (userId: string) => void;
  clearError: () => void;
};

const WS_BASE = import.meta.env.VITE_API_URL || '';
let socket: Socket | null = null;

function normalizeIncomingMessage(message: {
  id?: string;
  conversationId?: string;
  fromUserId?: string;
  toUserId?: string;
  text?: string;
  createdAt?: string | Date;
}): ChatMessage {
  return {
    id: message.id ?? `${Date.now()}_${Math.random()}`,
    conversationId: message.conversationId ?? '',
    fromUserId: message.fromUserId ?? '',
    toUserId: message.toUserId ?? '',
    text: message.text ?? '',
    createdAt:
      typeof message.createdAt === 'string'
        ? message.createdAt
        : (message.createdAt ?? new Date()).toISOString(),
  };
}

function upsertMessage(list: ChatMessage[], next: ChatMessage): ChatMessage[] {
  if (
    list.some(
      (m) =>
        m.id === next.id ||
        (m.fromUserId === next.fromUserId &&
          m.toUserId === next.toUserId &&
          m.text === next.text &&
          m.createdAt === next.createdAt),
    )
  ) {
    return list;
  }
  return [...list, next].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export const useChatStore = create<ChatStore>((set, get) => ({
  activeUser: null,
  messages: [],
  unreadByUserId: {},
  isChatPageOpen: false,
  nextCursor: null,
  loadingHistory: false,
  sending: false,
  socketStatus: 'disconnected',
  socketError: null,
  error: null,

  setChatPageOpen(open) {
    set({ isChatPageOpen: open });
  },

  setActiveUser(user) {
    set((s) => ({
      activeUser: user,
      messages: [],
      nextCursor: null,
      error: null,
      unreadByUserId: s.isChatPageOpen && user
        ? {
            ...s.unreadByUserId,
            [user.id]: 0,
          }
        : s.unreadByUserId,
    }));
  },

  connect(token) {
    if (socket) return;
    set({ socketStatus: 'connecting', socketError: null });

    socket = io(`${WS_BASE}/ws/chat`, {
      transports: ['websocket'],
      auth: { token },
    });

    socket.on('connect', () => {
      set({ socketStatus: 'connected', socketError: null });
    });

    socket.on('disconnect', () => {
      set({ socketStatus: 'disconnected' });
    });

    socket.on('connect_error', (error: Error) => {
      set({
        socketStatus: 'disconnected',
        socketError: error?.message ?? 'Failed to connect chat socket',
      });
    });

    socket.on('chat:message', (raw: unknown) => {
      const message = normalizeIncomingMessage(
        (raw ?? {}) as {
          id?: string;
          conversationId?: string;
          fromUserId?: string;
          toUserId?: string;
          text?: string;
          createdAt?: string | Date;
        },
      );
      get().pushIncoming(message);
    });
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    set({ socketStatus: 'disconnected', socketError: null });
  },

  async loadHistory(token, otherUserId, reset = true) {
    const state = get();
    if (reset) {
      set({ loadingHistory: true, error: null, messages: [], nextCursor: null });
    } else {
      if (!state.nextCursor) return;
      set({ loadingHistory: true, error: null });
    }

    try {
      const payload: ChatHistoryResponse = await fetchChatMessages(
        token,
        otherUserId,
        reset ? undefined : state.nextCursor ?? undefined,
      );

      set((s) => ({
        messages: reset
          ? payload.messages
          : [...payload.messages, ...s.messages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            ),
        nextCursor: payload.nextCursor,
        unreadByUserId: {
          ...s.unreadByUserId,
          [otherUserId]: 0,
        },
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load chat history' });
    } finally {
      set({ loadingHistory: false });
    }
  },

  async sendMessage(toUserId, text) {
    const content = text.trim();
    if (!content) return false;

    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: 'Not authenticated' });
      return false;
    }

    if (!socket) {
      get().connect(token);
    }

    if (!socket) {
      set({ error: 'Chat socket unavailable' });
      return false;
    }

    set({ sending: true, error: null });
    try {
      const response = await new Promise<{ ok?: boolean; message?: ChatMessage }>((resolve, reject) => {
        if (!socket) {
          reject(new Error('Socket disconnected'));
          return;
        }
        socket.timeout(7000).emit('chat:send', { toUserId, text: content }, (err: unknown, ack: unknown) => {
          if (err) {
            reject(new Error('Chat send timeout'));
            return;
          }
          resolve((ack as { ok?: boolean; message?: ChatMessage }) ?? {});
        });
      });

      if (!response.ok || !response.message) {
        throw new Error('Failed to send message');
      }

      const sent = normalizeIncomingMessage(response.message);
      set((s) => ({ messages: upsertMessage(s.messages, sent) }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
      return false;
    } finally {
      set({ sending: false });
    }
  },

  pushIncoming(message) {
    const state = useAuthStore.getState();
    const me = state.me ?? state.user;
    if (!me) return;
    const { activeUser, isChatPageOpen } = get();

    const isCurrentThread =
      isChatPageOpen &&
      !!activeUser &&
      ((message.fromUserId === me.id && message.toUserId === activeUser.id) ||
        (message.fromUserId === activeUser.id && message.toUserId === me.id));

    const incomingFromOtherToMe = message.toUserId === me.id && message.fromUserId !== me.id;

    set((s) => {
      const nextUnread = { ...s.unreadByUserId };
      if (incomingFromOtherToMe) {
        const fromUserId = message.fromUserId;
        if (!s.isChatPageOpen || !s.activeUser || s.activeUser.id !== fromUserId) {
          nextUnread[fromUserId] = (nextUnread[fromUserId] ?? 0) + 1;
        }
      }

      return {
        unreadByUserId: nextUnread,
        ...(isCurrentThread ? { messages: upsertMessage(s.messages, message) } : {}),
      };
    });
  },

  markRead(userId) {
    set((s) => ({
      unreadByUserId: {
        ...s.unreadByUserId,
        [userId]: 0,
      },
    }));
  },

  clearError() {
    set({ error: null, socketError: null });
  },
}));
