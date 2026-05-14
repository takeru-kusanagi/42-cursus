const API_BASE = import.meta.env.VITE_API_URL || '';

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid admin credentials');
  }
  return res.json();
}

export async function fetchAdminUsers(token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch users');
  }
  return res.json();
}

export async function clearAdminEmailVerification(token: string, userId: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/clear-email-verification`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to clear email verification');
  }
  return res.json();
}
