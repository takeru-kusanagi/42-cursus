import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { fetchLeaderboard, fetchMatchHistory, fetchMatchStats, type LeaderboardItem, type MatchHistoryItem, type MatchStats } from '../api/social';
import { useAuthStore } from '../store/authStore';
import { translateApiMessage } from '../i18n';

export function Stats() {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetchMatchStats(token),
      fetchMatchHistory(token),
      fetchLeaderboard(token),
    ])
      .then(([statsResponse, historyResponse, leaderboardResponse]) => {
        setStats(statsResponse);
        setHistory(historyResponse.items);
        setNextCursor(historyResponse.nextCursor);
        setLeaderboard(leaderboardResponse);
      })
      .catch((nextError) => {
        setError(nextError instanceof Error ? nextError.message : 'Failed to load stats.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const loadMore = async () => {
    if (!token || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetchMatchHistory(token, nextCursor);
      setHistory((current) => [...current, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to load more history.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.matchAnalytics')}</p>
        <h1 className="text-4xl font-black text-white mt-3">{t('stats.title')}</h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          {t('stats.description')}
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-800/60 bg-red-950/30 px-5 py-4 text-sm text-red-300">
          {translateApiMessage(error, t)}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: t('stats.wins'), value: stats?.wins ?? 0, tone: 'text-emerald-400' },
          { label: t('stats.losses'), value: stats?.losses ?? 0, tone: 'text-red-400' },
          { label: t('stats.total'), value: stats?.total ?? 0, tone: 'text-white' },
          { label: t('stats.winRate'), value: `${stats?.winRate ?? 0}%`, tone: 'text-blue-400' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-700 bg-gray-800 p-5 shadow-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
            <p className={`mt-4 text-3xl font-black ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.history')}</p>
              <h2 className="text-2xl font-black text-white mt-2">{t('stats.recentMatches')}</h2>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400 mt-8">{t('stats.loadingHistory')}</p>
          ) : history.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-8 text-center text-gray-400">
              {t('stats.noMatches')}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {history.map((item) => (
                <article key={item.matchId} className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {item.isWinner ? t('stats.win') : t('stats.loss')} {t('stats.vs')} {item.opponent?.displayName ?? t('stats.unknownOpponent')}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.mode.split('_').join(' ')} · {item.endedAt ? new Date(item.endedAt).toLocaleString() : t('stats.pending')}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                      item.isWinner ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50' : 'bg-red-950/50 text-red-300 border border-red-800/50'
                    }`}>
                      {item.isWinner ? t('stats.winner') : t('stats.defeat')}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-400">@{item.opponent?.username ?? 'unknown'}</span>
                    <span className="text-white font-black text-lg">
                      {item.score}
                      <span className="mx-2 text-gray-500">-</span>
                      {item.opponentScore ?? 0}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {nextCursor && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="mt-6 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-700 disabled:opacity-60"
            >
              {loadingMore ? t('common.loading') : t('stats.loadMore')}
            </button>
          )}
        </div>

        <aside className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.leaderboard')}</p>
          <h2 className="text-2xl font-black text-white mt-2">{t('stats.topPlayers')}</h2>

          <div className="mt-6 space-y-3">
            {leaderboard.map((entry, index) => (
              <div key={entry.userId} className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-white">
                      #{index + 1} {entry.displayName}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">@{entry.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-blue-400">{entry.wins}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{t('stats.winsLabel')}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>{t('stats.totalLabel')} {entry.total}</span>
                  <span>{t('stats.winRateLabel')} {entry.winRate}%</span>
                </div>
              </div>
            ))}

            {!loading && leaderboard.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 p-8 text-center text-gray-400">
                {t('stats.emptyLeaderboard')}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
