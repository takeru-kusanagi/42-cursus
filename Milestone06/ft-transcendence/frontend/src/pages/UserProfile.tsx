import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  fetchUserProfile,
  type FriendshipRelation,
  type UserProfile as UserProfileType,
} from '../api/social';
import { useAuthStore } from '../store/authStore';
import { useFriendsStore } from '../store/friendsStore';
import { translateApiMessage } from '../i18n';

function getActionState(
  meId: string,
  relation: FriendshipRelation,
): 'request' | 'accept' | 'cancel' | 'remove' | 'none' {
  if (!relation) return 'request';
  if (relation.status === 'ACCEPTED') return 'remove';
  if (relation.status === 'PENDING') {
    if (relation.addresseeId === meId) return 'accept';
    return 'cancel';
  }
  return 'none';
}

export function UserProfile() {
  const { t } = useTranslation();
  const { id: targetUserId = '' } = useParams();
  const navigate = useNavigate();
  const { token, me, user } = useAuthStore();
  const currentUser = me ?? user;
  const { requestTo, acceptFrom, removeWith, mutating } = useFriendsStore();

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const shortId = (id: string) => (id.length <= 14 ? id : `${id.slice(0, 8)}...${id.slice(-4)}`);

  const actionState = useMemo(() => {
    if (!currentUser || !profile) return 'none';
    return getActionState(currentUser.id, profile.friendship);
  }, [currentUser, profile]);

  useEffect(() => {
    if (!token || !targetUserId) return;
    setLoading(true);
    setError(null);
    fetchUserProfile(token, targetUserId)
      .then((data) => setProfile(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [token, targetUserId]);

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (targetUserId === currentUser.id) {
    return <Navigate to="/profile" replace />;
  }

  const reloadProfile = async () => {
    const updated = await fetchUserProfile(token, targetUserId);
    setProfile(updated);
  };

  const onAction = async () => {
    if (!profile) return;
    setActionMessage(null);
    setError(null);

    try {
      if (actionState === 'request') {
        await requestTo(token, profile.id);
        setActionMessage(t('userProfile.friendRequestSent'));
      } else if (actionState === 'accept') {
        const requesterId = profile.friendship?.requesterId;
        if (!requesterId) return;
        await acceptFrom(token, requesterId);
        setActionMessage(t('userProfile.friendRequestAccepted'));
      } else if (actionState === 'cancel' || actionState === 'remove') {
        await removeWith(token, profile.id);
        setActionMessage(actionState === 'cancel' ? t('userProfile.friendRequestCancelled') : t('userProfile.friendRemoved'));
      }
      await reloadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update friendship');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('userProfile.title')}</h1>
        <Link
          to="/friends"
          className="px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600"
        >
          {t('userProfile.backToFriends')}
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-400">{t('userProfile.loadingProfile')}</p>}
      {error && <p className="text-sm text-red-400">{translateApiMessage(error, t)}</p>}
      {actionMessage && <p className="text-sm text-green-400">{actionMessage}</p>}

      {!loading && profile && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              {profile.isActive && (
                <span className="absolute -right-0.5 bottom-0 z-20 h-4 w-4 rounded-full border-2 border-gray-800 bg-green-500 shadow-[0_0_0_2px_rgba(17,24,39,0.8)]" />
              )}
            </div>
            <div>
              <p className="text-lg text-white font-semibold">{profile.displayName}</p>
              <p className="text-sm text-gray-400">ID: {shortId(profile.id)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {actionState !== 'none' && (
              <button
                onClick={onAction}
                disabled={mutating}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-60"
              >
                {actionState === 'request' && t('userProfile.sendFriendRequest')}
                {actionState === 'accept' && t('userProfile.acceptRequest')}
                {actionState === 'cancel' && t('userProfile.cancelRequest')}
                {actionState === 'remove' && t('userProfile.removeFriend')}
              </button>
            )}

            {profile.friendship?.status === 'ACCEPTED' && (
              <button
                onClick={() => navigate(`/chat?userId=${encodeURIComponent(profile.id)}`)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
              >
                {t('userProfile.openDm')}
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-300 space-y-1">
            <div>
              <span className="text-gray-400 mr-2">{t('userProfile.currentRelation')}</span>
              {!profile.friendship && t('userProfile.noRelation')}
              {profile.friendship?.status === 'PENDING' && t('userProfile.pending')}
              {profile.friendship?.status === 'ACCEPTED' && t('userProfile.friend')}
              {profile.friendship?.status === 'BLOCKED' && t('userProfile.blocked')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
