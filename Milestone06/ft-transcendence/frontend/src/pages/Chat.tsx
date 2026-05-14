import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useFriendsStore } from '../store/friendsStore';

export function Chat() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const loadedThreadRef = useRef<string | null>(null);
  const lastAppliedSelectedIdRef = useRef<string | null>(null);
  const [text, setText] = useState('');

  const { token, me, user } = useAuthStore();
  const currentUser = me ?? user;
  const {
    friends,
    loadFriends,
    loadingFriends,
  } = useFriendsStore();
  const {
    activeUser,
    messages,
    unreadByUserId,
    nextCursor,
    loadingHistory,
    sending,
    socketStatus,
    socketError,
    error,
    setChatPageOpen,
    setActiveUser,
    loadHistory,
    sendMessage,
  } = useChatStore();

  const selectedId = searchParams.get('userId');

  useEffect(() => {
    setChatPageOpen(true);
    return () => {
      setChatPageOpen(false);
    };
  }, [setChatPageOpen]);

  useEffect(() => {
    if (!token) return;
    loadedThreadRef.current = null;
    lastAppliedSelectedIdRef.current = null;
    void loadFriends(token);
  }, [token, loadFriends]);

  useEffect(() => {
    if (!token) return;

    if (friends.length === 0) {
      loadedThreadRef.current = null;
      lastAppliedSelectedIdRef.current = null;
      if (activeUser) {
        setActiveUser(null);
      }
      return;
    }

    const selectedUser = selectedId
      ? friends.find((friend) => friend.id === selectedId) ?? null
      : null;
    const activeStillFriend = activeUser ? friends.some((friend) => friend.id === activeUser.id) : false;
    let initial = activeStillFriend && activeUser ? activeUser : friends[0];

    if (selectedUser && lastAppliedSelectedIdRef.current !== selectedId) {
      initial = selectedUser;
      lastAppliedSelectedIdRef.current = selectedId;
    }

    if (!selectedId) {
      lastAppliedSelectedIdRef.current = null;
    }

    if (!initial) {
      setActiveUser(null);
      loadedThreadRef.current = null;
      return;
    }

    const switched = activeUser?.id !== initial.id;
    if (switched) {
      setActiveUser(initial);
    }

    if (!switched && loadedThreadRef.current === initial.id) return;
    loadedThreadRef.current = initial.id;
    void loadHistory(token, initial.id, true);
  }, [token, friends, selectedId, activeUser, setActiveUser, loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const socketLabel = useMemo(() => {
    if (socketStatus === 'connected') return t('chat.connected');
    if (socketStatus === 'connecting') return t('chat.connecting');
    return t('chat.disconnected');
  }, [socketStatus, t]);

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const onSelectFriend = async (friendId: string) => {
    const target = friends.find((friend) => friend.id === friendId);
    if (!target) return;
    if (activeUser?.id === target.id) return;
    setActiveUser(target);
  };

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeUser || !text.trim()) return;
    const sent = await sendMessage(activeUser.id, text);
    if (sent) {
      setText('');
    }
  };

  const shortId = (id: string) => (id.length <= 14 ? id : `${id.slice(0, 8)}...${id.slice(-4)}`);

  return (
    <div className="h-[calc(100vh-140px)] bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden min-w-0">
      <div className="grid h-full min-w-0 grid-cols-1 grid-rows-[minmax(220px,38%)_minmax(0,1fr)] md:grid-cols-[minmax(260px,280px)_minmax(0,1fr)] md:grid-rows-1">
        <aside className="border-b border-gray-700 bg-gray-900/60 flex flex-col min-w-0 min-h-0 md:border-b-0 md:border-r">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white font-semibold">{t('chat.dmFriends')}</h2>
            <p className="text-xs text-gray-400 mt-1">{t('chat.socket')}: {socketLabel}</p>
            {socketError && <p className="text-xs text-red-400 mt-1">{socketError}</p>}
          </div>

          <div className="flex-1 overflow-auto p-2 space-y-1 min-h-0">
            {loadingFriends && <p className="text-xs text-gray-400 p-2">{t('chat.loadingFriends')}</p>}
            {!loadingFriends && friends.length === 0 && (
              <p className="text-xs text-gray-400 p-2">
                {t('chat.noFriendsGoTo')}<Link className="text-blue-400 hover:underline" to="/friends">{t('nav.friends')}</Link>{t('chat.noFriendsLinkSuffix')}
              </p>
            )}
            {friends.map((friend) => {
              const selected = activeUser?.id === friend.id;
              return (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => void onSelectFriend(friend.id)}
                  className={`w-full text-left rounded-lg p-3 transition ${
                    selected ? 'bg-blue-600/30 border border-blue-500/60' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">{friend.displayName}</p>
                    {(unreadByUserId[friend.id] ?? 0) > 0 && (
                      <span className="shrink-0 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {Math.min(unreadByUserId[friend.id], 99)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">ID: {shortId(friend.id)}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-col h-full min-w-0 min-h-0">
          <header className="px-4 py-3 border-b border-gray-700">
            {activeUser ? (
              <div>
                <p className="text-white font-semibold">{activeUser.displayName}</p>
                <p className="text-xs text-gray-400">ID: {shortId(activeUser.id)}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t('chat.selectFriendToStart')}</p>
            )}
          </header>

          <div className="flex-1 overflow-auto px-4 py-3 space-y-3 min-h-0">
            {loadingHistory && <p className="text-sm text-gray-400">{t('chat.loadingMessages')}</p>}
            {!loadingHistory && activeUser && messages.length === 0 && (
              <p className="text-sm text-gray-400">{t('chat.noMessagesYet')}</p>
            )}
            {!loadingHistory && !activeUser && (
              <p className="text-sm text-gray-400">{t('chat.noActiveConversation')}</p>
            )}

            {nextCursor && activeUser && (
              <button
                type="button"
                onClick={() => void loadHistory(token, activeUser.id, false)}
                className="text-xs px-3 py-1.5 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                {t('chat.loadOlderMessages')}
              </button>
            )}

            {messages.map((message) => {
              const mine = message.fromUserId === currentUser.id;
              return (
                <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      mine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-all">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-gray-300'}`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSend} className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={activeUser ? t('chat.typeMessage') : t('chat.selectFriendFirst')}
              disabled={!activeUser || sending}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!activeUser || sending || !text.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-60"
            >
              {sending ? t('chat.sending') : t('chat.send')}
            </button>
          </form>
          {error && <p className="px-4 pb-3 text-xs text-red-400">{error}</p>}
        </section>
      </div>
    </div>
  );
}
