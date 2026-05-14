const API_BASE = import.meta.env.VITE_API_URL || '';

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = Array.isArray(err?.message) ? err.message[0] : err?.message;
    throw new Error(typeof message === 'string' ? message : `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
};

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED';

export type FriendshipRelation = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
} | null;

export type UserProfile = PublicUser & {
  isActive: boolean;
  friendship: FriendshipRelation;
};

export type FriendRequestItem = {
  requestId: string;
  requesterId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
};

export type ChatHistoryResponse = {
  conversationId: string | null;
  messages: ChatMessage[];
  nextCursor: string | null;
};

export type MatchMode = 'SINGLE_PLAYER' | 'LOCAL_MULTIPLAYER' | 'ONLINE_MULTIPLAYER';

export type MatchStatus = 'IN_PROGRESS' | 'FINISHED' | 'ABANDONED';

export type StartMatchResponse = {
  matchId: string;
  mode: MatchMode;
  status: MatchStatus;
  startedAt: string;
};

export type FinalizeMatchPlayer = {
  userId: string;
  score: number;
  isWinner: boolean;
};

export type FinalizeMatchResponse = {
  matchId: string;
  status: MatchStatus;
  endedAt: string | null;
  alreadyFinalized: boolean;
  players: Array<{
    id: string;
    matchId: string;
    userId: string;
    score: number;
    isWinner: boolean;
  }>;
};

export type MatchStats = {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
  progression: {
    level: number;
    currentMatches: number;
    requiredMatches: number;
    progressPercent: number;
  };
  achievements: Array<{
    code: 'FIRST_WIN' | 'TEN_WINS' | 'HUNDRED_WINS';
    unlocked: boolean;
  }>;
};

export type MatchHistoryItem = {
  matchId: string;
  mode: MatchMode;
  status: MatchStatus;
  endedAt: string | null;
  score: number;
  opponentScore: number | null;
  isWinner: boolean;
  opponent: PublicUser | null;
};

export type MatchHistoryResponse = {
  items: MatchHistoryItem[];
  nextCursor: string | null;
};

export type LeaderboardItem = MatchStats & {
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
};

export function searchUsers(token: string, query: string) {
  const q = encodeURIComponent(query.trim());
  return request<PublicUser[]>(`/api/users/search?q=${q}`, { token });
}

export function fetchUserProfile(token: string, userId: string) {
  return request<UserProfile>(`/api/users/${encodeURIComponent(userId)}`, { token });
}

export function requestFriend(token: string, userId: string) {
  return request(`/api/friends/${encodeURIComponent(userId)}`, { method: 'POST', token });
}

export function acceptFriend(token: string, requesterId: string) {
  return request(`/api/friends/${encodeURIComponent(requesterId)}/accept`, {
    method: 'POST',
    token,
  });
}

export function removeFriend(token: string, userId: string) {
  return request<{ deleted: boolean }>(`/api/friends/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    token,
  });
}

export function fetchFriends(token: string) {
  return request<PublicUser[]>('/api/me/friends', { token });
}

export function fetchFriendRequests(token: string) {
  return request<FriendRequestItem[]>('/api/me/friend-requests', { token });
}

export function fetchChatMessages(token: string, userId: string, cursor?: string, limit = 30) {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(limit));
  if (cursor) {
    searchParams.set('cursor', cursor);
  }
  return request<ChatHistoryResponse>(
    `/api/chats/${encodeURIComponent(userId)}/messages?${searchParams.toString()}`,
    { token },
  );
}

export function startMatch(token: string, mode: MatchMode) {
  return request<StartMatchResponse>('/api/matches/start', {
    method: 'POST',
    token,
    body: { mode },
  });
}

export function finalizeMatch(
  token: string,
  matchId: string,
  players: FinalizeMatchPlayer[],
  status: MatchStatus = 'FINISHED',
) {
  return request<FinalizeMatchResponse>(`/api/matches/${encodeURIComponent(matchId)}/finalize`, {
    method: 'POST',
    token,
    body: {
      players,
      status,
    },
  });
}

export function fetchMatchStats(token: string) {
  return request<MatchStats>('/api/me/stats', { token });
}

export function fetchMatchHistory(token: string, cursor?: string, limit = 20) {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(limit));
  if (cursor) {
    searchParams.set('cursor', cursor);
  }

  return request<MatchHistoryResponse>(`/api/me/matches?${searchParams.toString()}`, { token });
}

export function fetchLeaderboard(token: string, limit = 10) {
  return request<LeaderboardItem[]>(`/api/leaderboard?limit=${encodeURIComponent(String(limit))}`, {
    token,
  });
}
