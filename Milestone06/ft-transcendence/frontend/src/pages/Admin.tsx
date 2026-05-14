import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminLogin, fetchAdminUsers, clearAdminEmailVerification } from '../api/admin';

const ADMIN_TOKEN_KEY = 'admin_token';

type UserRow = {
  id: string;
  username: string;
  name: string;
  email: string;
  provider: string;
  providerId: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
};

export const Admin = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_TOKEN_KEY),
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [clearingUserId, setClearingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setUsersLoading(true);
    setUsersError('');
    fetchAdminUsers(token)
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch((err) => {
        setUsersError(err instanceof Error ? err.message : t('errors.failedToLoadUsers'));
        if (err instanceof Error && err.message.includes('Invalid or expired')) {
          setToken(null);
        }
      })
      .finally(() => setUsersLoading(false));
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      setToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUsers([]);
    setTotal(0);
  };

  const handleClearEmailVerification = async (userId: string) => {
    if (!token) return;
    setClearingUserId(userId);
    setUsersError('');
    try {
      await clearAdminEmailVerification(token, userId);
      const data = await fetchAdminUsers(token);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : t('errors.failedToSend'));
    } finally {
      setClearingUserId(null);
    }
  };

  const providerLabel = (p: string) => {
    const map: Record<string, string> = {
      local: t('admin.local'),
      google: t('admin.google'),
      '42': t('admin.42Network'),
    };
    return map[p] ?? p;
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-sans">
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-amber-900/50">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-amber-600 rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
              ⚙️
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{t('admin.login')}</h2>
            <p className="mt-2 text-sm text-gray-400 font-medium">{t('admin.enterCredentials')}</p>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).closest('form')?.requestSubmit();
              }
            }}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              <label className="text-gray-400 text-xs ml-1">{t('admin.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-gray-500"
                required
                autoComplete="username"
              />
              <label className="text-gray-400 text-xs ml-1">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-gray-500"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg active:scale-95"
            >
              {loading ? t('admin.loggingIn') : t('admin.loginButton')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-600 rounded-xl flex items-center justify-center text-2xl text-white">
              ⚙️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('admin.panel')}</h1>
              <p className="text-sm text-gray-400">{t('admin.userManagement')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            {t('admin.logout')}
          </button>
        </div>

        {usersError && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
            {usersError}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              {t('admin.totalAccounts')} <span className="text-amber-400">{total}</span> {t('admin.accounts')}
            </h2>
          </div>

          {usersLoading ? (
            <div className="p-12 text-center text-gray-400">{t('common.loading')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.loginMethod')}
                    </th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.id')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.providerId')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.username')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.nickname')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.email')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.twoFactor')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.emailVerified')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {providerLabel(u.provider)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {u.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {u.providerId??'-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            u.twoFactorEnabled
                              ? 'bg-green-900/50 text-green-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {u.twoFactorEnabled ? t('admin.enabled') : t('admin.disabled')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            u.emailVerified
                              ? 'bg-green-900/50 text-green-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {u.emailVerified ? t('admin.yes') : t('admin.no')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.provider === 'local' ? (
                          <button
                            onClick={() => handleClearEmailVerification(u.id)}
                            disabled={clearingUserId === u.id}
                            className="px-3 py-1.5 text-xs font-medium rounded bg-amber-900/50 text-amber-400 hover:bg-amber-800/50 disabled:opacity-50 transition-colors"
                          >
                            {clearingUserId === u.id ? '...' : t('admin.clearEmailVerify')}
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
