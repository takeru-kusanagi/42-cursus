const API_BASE = import.meta.env.VITE_API_URL || '';

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
}

export async function register(username: string, password: string, name: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProfile(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function requestEmailVerification(token: string, email: string) {
  const res = await fetch(`${API_BASE}/api/auth/email/request`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send verification email');
  }
  return res.json();
}

export async function resendVerificationEmail(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/email/resend`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to resend');
  }
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'Failed to send reset email');
  }
  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'Failed to reset password');
  }
  return res.json();
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/email/verify?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'Verification failed');
  }
  return res.json();
}

export async function setupTwoFactor(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/2fa/setup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to setup 2FA');
  }
  return res.json();
}

export async function verifyTwoFactorSetup(token: string, code: string) {
  const res = await fetch(`${API_BASE}/api/auth/2fa/verify-setup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid code');
  }
  return res.json();
}

export async function verifyTwoFactor(tempToken: string, code: string) {
  const res = await fetch(`${API_BASE}/api/auth/2fa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempToken, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid code');
  }
  return res.json();
}

export async function disableTwoFactor(token: string, password: string, code: string) {
  const res = await fetch(`${API_BASE}/api/auth/2fa/disable`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to disable 2FA');
  }
  return res.json();
}

export async function updateProfile(token: string, name: string) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
) {
  const res = await fetch(`${API_BASE}/api/auth/profile/change-password`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'Failed to change password');
  }
  return res.json();
}

export async function exportData(
  token: string,
  format: 'json' | 'csv' | 'xml',
): Promise<Blob> {
  const res = await fetch(
    `${API_BASE}/api/auth/profile/export?format=${format}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Export failed');
  }
  return res.blob();
}

export async function importProfile(token: string, data: string) {
  const res = await fetch(`${API_BASE}/api/auth/profile/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Import failed');
  }
  return res.json();
}

// ─── API Key Management ─────────────────────

export interface ApiKeyData {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  revoked: boolean;
  createdAt: string;
}

export interface CreatedApiKey extends ApiKeyData {
  key: string; // 平文キー（生成時のみ返却）
}

export async function createApiKey(
  token: string,
  name: string,
  scopes: string[] = ['read'],
  expiresAt?: string,
) {
  const res = await fetch(`${API_BASE}/api/auth/api-keys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, scopes, expiresAt }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create API key');
  }
  return res.json() as Promise<CreatedApiKey>;
}

export async function fetchApiKeys(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/api-keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch API keys');
  }
  return res.json() as Promise<ApiKeyData[]>;
}

export async function revokeApiKey(token: string, keyId: string) {
  const res = await fetch(`${API_BASE}/api/auth/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to revoke API key');
  }
  return res.json();
}

export async function deleteAccount(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'Failed to delete account');
  }
  return res.json();
}
