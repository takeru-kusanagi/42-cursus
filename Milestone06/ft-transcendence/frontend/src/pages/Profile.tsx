import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { fetchProfile } from '../api/auth';
import {
  fetchLeaderboard,
  fetchMatchHistory,
  fetchMatchStats,
  type LeaderboardItem,
  type MatchHistoryItem,
  type MatchStats,
} from '../api/social';
import { translateApiMessage } from '../i18n';

interface ProfileData {
  id: string;
  username: string;
  name: string;
  googleName: string | null;
  email: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  provider: string;
  avatar: string | null;
}

export function Profile() {
  const { t, i18n } = useTranslation();
  const { me, user, token } = useAuthStore();
  const currentUser = me ?? user;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetchProfile(token),
      fetchMatchStats(token),
      fetchMatchHistory(token),
      fetchLeaderboard(token, 100),
    ])
      .then(([profileData, statsData, historyData, leaderboardData]) => {
        if (profileData && currentUser && profileData.id === currentUser.id) {
          setProfile({
            ...profileData,
            avatar: currentUser.avatar || profileData.avatar,
          });
        } else {
          setProfile(profileData);
        }
        setStats(statsData);
        setHistory(historyData.items);
        setLeaderboard(leaderboardData);
      })
      .catch((nextError) => {
        setError(nextError instanceof Error ? nextError.message : 'Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [token, currentUser]);

  const rank = useMemo(() => {
    if (!currentUser) {
      return '-';
    }
    const currentRank = leaderboard.findIndex((entry) => entry.userId === currentUser.id);
    return currentRank >= 0 ? `#${currentRank + 1}` : '-';
  }, [leaderboard, currentUser]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString(i18n.language);

  if (!currentUser || !token) return <Navigate to="/login" replace />;
  if (loading) return <div className="flex justify-center py-16 text-gray-400">{t('common.loading')}</div>;
  if (!profile) return <div className="flex justify-center py-16 text-red-400">{t('errors.loadProfileFailed')}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex flex-col items-center min-w-0 w-full lg:flex-1 lg:items-start lg:flex-row lg:gap-6">
            <div className="relative flex-shrink-0 mb-4 lg:mb-0">
              {profile.avatar ? (
                <img src={profile.avatar} className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-2xl" alt="avatar" />
              ) : (
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl shadow-xl">👤</div>
              )}
              <span className="absolute -right-0.5 bottom-1 z-20 h-6 w-6 rounded-full border-4 border-gray-800 bg-green-500 shadow-[0_0_0_2px_rgba(17,24,39,0.8)]"></span>
            </div>

            <div className="min-w-0 text-center lg:text-left">
              <h1 className="text-3xl font-black text-white tracking-tight truncate max-w-[250px] sm:max-w-none">
                {profile.name}
              </h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 items-center mt-2">
                {profile.provider === 'local' && (
                  <p className="text-blue-400 font-mono text-sm uppercase tracking-tighter">@{profile.username}</p>
                )}
                <span className="text-gray-600 text-xs hidden sm:inline">|</span>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-gray-900/50 px-2 py-0.5 rounded">
                  {profile.provider} account
                </p>
              </div>
              {profile.email && <p className="text-xs text-gray-400 mt-2">{profile.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 w-full lg:w-auto lg:min-w-[440px]">
            {[
              { label: t('stats.wins'), value: stats?.wins ?? 0, color: 'text-emerald-400' },
              { label: t('stats.losses'), value: stats?.losses ?? 0, color: 'text-red-400' },
              { label: t('stats.winRate'), value: `${stats?.winRate ?? 0}%`, color: 'text-blue-400' },
              { label: t('stats.rank'), value: rank, color: 'text-white' },
              { label: t('stats.level'), value: `Lv.${stats?.progression.level ?? 1}`, color: 'text-amber-300' },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0f1219] p-3 rounded-2xl border border-gray-700 shadow-inner flex flex-col justify-between px-5 min-h-[78px]">
                <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest">{item.label}</p>
                <p className={`text-lg font-black ${item.color} leading-none mt-2`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-800/60 bg-red-950/30 px-5 py-4 text-sm text-red-300">
          {translateApiMessage(error, t)}
        </div>
      )}

      {stats && (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.progression')}</p>
            <h2 className="mt-2 text-2xl font-black text-white">Lv.{stats.progression.level}</h2>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-900">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${stats.progression.progressPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
              <span>
                {t('stats.matches')}: {stats.progression.currentMatches}/{stats.progression.requiredMatches}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.achievements')}</p>
            <div className="mt-5 grid gap-3">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.code}
                  className={`rounded-2xl border px-4 py-4 ${achievement.unlocked
                    ? 'border-emerald-700 bg-emerald-950/30 text-emerald-200'
                    : 'border-gray-700 bg-gray-900/50 text-gray-500'
                  }`}
                >
                  <p className="text-base font-black tracking-wide">
                    {t(`achievements.${achievement.code}.title`)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t(`achievements.${achievement.code}.subtitle`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.history')}</p>
            <h2 className="text-2xl font-black text-white mt-2">{t('stats.recentMatches')}</h2>
          </div>

          {history.length === 0 ? (
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
                        {item.mode.split('_').join(' ')} · {item.endedAt ? formatDate(item.endedAt) : t('stats.pending')}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                      item.isWinner
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                        : 'bg-red-950/50 text-red-300 border border-red-800/50'
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
        </div>

        <aside className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{t('stats.leaderboard')}</p>
          <h2 className="text-2xl font-black text-white mt-2">{t('stats.topPlayers')}</h2>

          <div className="mt-6 space-y-3">
            {leaderboard.slice(0, 10).map((entry, index) => (
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

            {leaderboard.length === 0 && (
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
