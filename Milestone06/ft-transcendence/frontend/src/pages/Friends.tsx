import { FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFriendsStore } from '../store/friendsStore';
import { useUserSearchStore } from '../store/userSearchStore';

export function Friends() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const {
    friends,
    requests,
    loadingFriends,
    loadingRequests,
    mutating,
    error: friendsError,
    loadFriends,
    loadRequests,
    acceptFrom,
    removeWith,
  } = useFriendsStore();
  const { query, results, loading, error: searchError, setQuery, search } = useUserSearchStore();

  useEffect(() => {
    if (!token) return;
    void loadFriends(token);
    void loadRequests(token);
  }, [token, loadFriends, loadRequests]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onSearch = async (event: FormEvent) => {
    event.preventDefault();
    await search(token);
  };

  const shortId = (id: string) => (id.length <= 14 ? id : `${id.slice(0, 8)}...${id.slice(-4)}`);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t('friends.title')}</h1>

      <form onSubmit={onSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('friends.searchPlaceholder')}
          className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={20}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? t('friends.searching') : t('friends.search')}
        </button>
      </form>

      {(friendsError || searchError) && (
        <div className="text-sm text-red-400">{friendsError ?? searchError}</div>
      )}

      {results.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h2 className="text-white font-semibold mb-3">{t('friends.searchResults')}</h2>
          <ul className="space-y-2">
            {results.map((user) => (
              <li key={user.id} className="flex items-start justify-between gap-3 bg-gray-900 rounded-lg p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-400 truncate">ID: {shortId(user.id)}</p>
                </div>
                <Link
                  to={`/users/${user.id}`}
                  className="px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 shrink-0"
                >
                  {t('friends.viewProfile')}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t('friends.friendList')}</h2>
            {loadingFriends && <span className="text-xs text-gray-400">{t('friends.loading')}</span>}
          </div>

          {friends.length === 0 && !loadingFriends && (
            <p className="text-sm text-gray-400">{t('friends.noFriends')}</p>
          )}

          <ul className="space-y-2">
            {friends.map((friend) => (
              <li key={friend.id} className="flex items-start justify-between gap-3 bg-gray-900 rounded-lg p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{friend.displayName}</p>
                  <p className="text-xs text-gray-400 truncate">ID: {shortId(friend.id)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/chat?userId=${encodeURIComponent(friend.id)}`)}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-500"
                  >
                    {t('friends.dm')}
                  </button>
                  <Link
                    to={`/users/${friend.id}`}
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white text-xs hover:bg-gray-600"
                  >
                    {t('friends.profile')}
                  </Link>
                  <button
                    type="button"
                    disabled={mutating}
                    onClick={() => void removeWith(token, friend.id)}
                    className="px-3 py-2 rounded-lg bg-red-700 text-white text-xs hover:bg-red-600 disabled:opacity-60"
                  >
                    {t('friends.remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t('friends.requests')}</h2>
            {loadingRequests && <span className="text-xs text-gray-400">{t('friends.loading')}</span>}
          </div>

          {requests.length === 0 && !loadingRequests && (
            <p className="text-sm text-gray-400">{t('friends.noRequests')}</p>
          )}

          <ul className="space-y-2">
            {requests.map((request) => (
              <li key={request.requestId} className="bg-gray-900 rounded-lg p-3">
                <p className="text-white text-sm font-medium truncate">{request.displayName}</p>
                <p className="text-xs text-gray-400 truncate">ID: {shortId(request.requesterId)}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={mutating}
                    onClick={() => void acceptFrom(token, request.requesterId)}
                    className="px-3 py-1.5 rounded bg-green-600 text-white text-xs hover:bg-green-500 disabled:opacity-60"
                  >
                    {t('friends.accept')}
                  </button>
                  <button
                    type="button"
                    disabled={mutating}
                    onClick={() => void removeWith(token, request.requesterId)}
                    className="px-3 py-1.5 rounded bg-red-700 text-white text-xs hover:bg-red-600 disabled:opacity-60"
                  >
                    {t('friends.reject')}
                  </button>
                  <Link
                    to={`/users/${request.requesterId}`}
                    className="px-3 py-1.5 rounded bg-gray-700 text-white text-xs hover:bg-gray-600"
                  >
                    {t('friends.profile')}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
