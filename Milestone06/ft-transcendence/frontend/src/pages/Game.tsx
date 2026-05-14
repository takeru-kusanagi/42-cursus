import { useEffect, useMemo, useState } from 'react';
import Pong from "../pong/Pong";
import { WORLD_WIDTH } from '@shared/pong/settings';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import type { GameState } from '@shared/pong/types';
import { useFriendsStore } from '../store/friendsStore';
import type { PublicUser } from '../api/social';
import { fetchUserProfile, finalizeMatch, startMatch } from '../api/social';
import { fetchProfile } from '../api/auth';
import { translateApiMessage } from '../i18n'
import { io, Socket } from 'socket.io-client';

type GameScene = 'INITIAL' | 'MODE_SELECT' | 'MATCHING' | 'PLAYING' | 'RESULT';
type GameMode = 'FRIEND' | 'LOCAL' | 'AI' | null;

const resolveAvatarSrc = (avatar: string | null | undefined): string | null => {
  if (!avatar) return null;
  const value = avatar.trim();
  if (!value) return null;

  if (value.startsWith('data:image/')) {
    return value;
  }

  if (value.startsWith('//')) {
    return `https:${value}`;
  }

  if (
    value.startsWith('http://') &&
    (value.includes('googleusercontent.com') || value.includes('gstatic.com'))
  ) {
    return value.replace(/^http:\/\//, 'https://');
  }

  return value;
};

const globalSocket: Socket = io({
  transports: ['websocket'],
  secure: true, 
  rejectUnauthorized: false,
  autoConnect: false
});

export const Game = () => {
  const { token, me, user } = useAuthStore();
  const { friends, loadFriends, loadingFriends } = useFriendsStore();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState('');
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scene, setScene] = useState<GameScene>('INITIAL');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const currentUser = me ?? user;
  const { t } = useTranslation();
  const [receivedMatchId, setReceivedMatchId] = useState<string | null>(null);
  const [finalScores, setFinalScores] = useState({ p1: 0, p2: 0 });

  const [playerSide, setPlayerSide] = useState<'p1' | 'p2'>('p1');
  const [initialGameState, setInitialGameState] = useState<GameState | null>(null);
  const [selfAvatarFromProfile, setSelfAvatarFromProfile] = useState<string | null>(null);
  const [opponentFromProfile, setOpponentFromProfile] = useState<PublicUser | null>(null);
  const [opponentAvatarLoadFailed, setOpponentAvatarLoadFailed] = useState(false);

  const backToMenu = () => {
    if (globalSocket && globalSocket.connected && scene === 'MATCHING') {
      globalSocket.emit('leaveQueue');
    }

    setActiveMatchId(null);
    setSelectedOpponentId(''); 
    setWinner(null);
    setGameMode(null);
    setNotice(null); 
    setGameState(null);
    setError(null);
    setPlayerSide('p1');

    localStorage.removeItem('activeMatchId');
    localStorage.removeItem('playerSide');

    setScene('MODE_SELECT');
  };

  const selectMode = (mode: GameMode) => {
    setPlayerSide('p1');
    localStorage.removeItem('playerSide');
    setGameMode(mode);

    if (mode === 'FRIEND') {
      setScene('MATCHING');
    } else if (mode === 'AI') {
      globalSocket.emit('joinQueue', { mode: 'singlePlayer' });
      setActiveMatchId('ai-match-' + Date.now()); 
      setResetKey((prev) => prev + 1);
      setScene('PLAYING');
    } else if (mode === 'LOCAL') {
      setActiveMatchId('local-match-' + Date.now()); 
      setResetKey((prev) => prev + 1);
      setScene('PLAYING');
    } 
};

  useEffect(() => {
    const handleInvitation = (data: { matchId: string, from: string }) => {
      setReceivedMatchId(data.matchId);
      setSelectedOpponentId(data.from);
      // 自分のフレンドリストから名前を探す
      const inviter = friends.find(f => f.id === data.from);
      const inviterName = inviter ? inviter.displayName : "誰か";

      setNotice(t('game.invitationFrom', { name: inviterName }));
    };
    globalSocket.on('opponentReady', handleInvitation);
    return () => { globalSocket.off('opponentReady', handleInvitation); };
  }, [friends]);

  useEffect(() => {
    const handleMatchNotFound = () => {
      console.warn("試合が見つかりませんでした。お掃除して戻ります。");
      
      // 1. ゴミ掃除（これがないとリロードのたびにまた真っ暗画面へ飛ぶ）
      localStorage.removeItem('activeMatchId');
      localStorage.removeItem('playerSide');
      
      // 2. 状態リセット
      setActiveMatchId(null);
      setNotice(t('game.matchAlreadyFinished'));
      
      // 3. 2秒後にメニューへ戻す
      setTimeout(() => {
        setScene('MODE_SELECT');
        setNotice(null);
      }, 2000);
    };

    globalSocket.on('matchNotFound', handleMatchNotFound);
    return () => {
      globalSocket.off('matchNotFound', handleMatchNotFound);
    };
  }, []);

  useEffect(() => {
    const handleMatchFound = (data: any) => {
    setActiveMatchId(data.gameId);
    
    // --- 🛰 サーバーから届いた ID ペアを使って自分のサイドを再確定 ---
    let assignedSide = data.side;
    if (data.playerIds && currentUser?.id) {
      // 自分の ID が p2 側に登録されていたら、何が何でも自分は p2
      assignedSide = (data.playerIds.p2 === currentUser.id) ? 'p2' : 'p1';
    }
    setPlayerSide(assignedSide);
    // --------------------------------------------------------

    setInitialGameState(data.state);

    if (data.playerIds) {
      // 確定した assignedSide を元に相手の ID をセット
      const oppId = assignedSide === 'p1' ? data.playerIds.p2 : data.playerIds.p1;
      if (oppId) {
        setSelectedOpponentId(oppId);
      }
    }

    setGameMode('FRIEND');
    setScene('PLAYING');
    setNotice(null);
    setBusy(false);

    localStorage.setItem('activeMatchId', data.gameId);
    localStorage.setItem('playerSide', assignedSide); // 正しい方を保存
  };

    // 1. 相手が切断した（猶予期間の開始）
    const handleOpponentDisconnected = (_data: { gameId: string }) => {
      console.log('Opponent disconnected, waiting 5s...');
      // 画面をリザルトに移さず、通知でカウントダウンを表示
      setNotice(t('game.waitingForOpponent'));
      // 必要に応じてゲームを一時停止（busy状態にするなど）
      setBusy(true);
    };

    // 2. 相手が戻ってきた！
    const handleOpponentReconnected = () => {
      setNotice(t('game.opponentReconnected'));
      setBusy(false);
      setTimeout(() => {
        setScene((currentScene: GameScene) => {
          if (currentScene !== 'RESULT') {
            setNotice(null);
          }
          return currentScene; // scene 自体は変えない
        });
      }, 2000);
    };

    // 3. 5秒経過してサーバーが「試合終了」と判断した
    const handleMatchForfeit = (data: { winnerId: string }) => {
      console.log('Match forfeited, winner is:', data.winnerId);
      
      // 1. お掃除（リロード対策のIDを消す）
      localStorage.removeItem('activeMatchId');
      localStorage.removeItem('playerSide');

      // 2. 勝敗判定
      const isMeWinner = data.winnerId === currentUser?.id;

      if (isMeWinner) {
        setWinner(currentUser?.name || 'YOU');
        setNotice(t('game.forfeitWin'));
      } else {
        setWinner('OPPONENT');
        setNotice(t('game.forfeitLose'));
      }

      // 3. 状態を整えてリザルト画面へ
      setBusy(false);
      setTimeout(() => {
        setScene('RESULT');
      }, 2000);
    };

    const handleStateUpdate = (newState: any) => {
      setGameState(newState);

      if (newState.status === 'finished') {
        localStorage.removeItem('activeMatchId');
        localStorage.removeItem('playerSide');

        const isP1Win = newState.score.p1 > newState.score.p2;
        const amIP1 = playerSide === 'p1';
        const isMeWinner = (amIP1 && isP1Win) || (!amIP1 && !isP1Win);

        if (gameMode === 'FRIEND') {
          setNotice(isMeWinner ? t('game.gameFinishedWin') : t('game.gameFinishedUpdate'));
        }

        setWinner(isMeWinner ? (currentUser?.name || 'YOU') : 'OPPONENT');
        setScene('RESULT');
      }
    };

    globalSocket.on('state', handleStateUpdate);
    globalSocket.on('matchFound', handleMatchFound);
    globalSocket.on('opponentDisconnected', handleOpponentDisconnected);
    globalSocket.on('opponentReconnected', handleOpponentReconnected);
    globalSocket.on('matchForfeit', handleMatchForfeit);

    return () => {
      globalSocket.off('state', handleStateUpdate);
      globalSocket.off('matchFound', handleMatchFound);
      globalSocket.off('opponentDisconnected', handleOpponentDisconnected);
      globalSocket.off('opponentReconnected', handleOpponentReconnected);
      globalSocket.off('matchForfeit', handleMatchForfeit);
    };
  }, [currentUser?.id, t, playerSide]);

  useEffect(() => {
    if (!currentUser?.id) return;

    // ✅ すでに繋がっているなら connect() を呼ばない
    if (!globalSocket.connected) {
      globalSocket.io.opts.query = { userId: currentUser.id };
      globalSocket.connect();
    }

    const savedMatchId = localStorage.getItem('activeMatchId');
    const savedSide = localStorage.getItem('playerSide');

    if (savedMatchId && savedSide) {
      console.log("📍 復旧可能な試合を発見:", savedMatchId);
      
      globalSocket.emit('reconnectToMatch', { 
        gameId: savedMatchId, 
        userId: currentUser.id 
      });

      setActiveMatchId(savedMatchId);
      setPlayerSide(savedSide as 'p1' | 'p2');
      setGameMode('FRIEND');
      setScene('PLAYING'); 
    }
    return () => {
      globalSocket.off('connect');
      globalSocket.off('disconnect');
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (!token) return;
    void loadFriends(token);
  }, [token, loadFriends]);

  useEffect(() => {
    if (!token || !currentUser?.id) return;
    if (currentUser.avatar) return;

    let cancelled = false;
    void fetchProfile(token)
      .then((profile) => {
        if (!cancelled) {
          setSelfAvatarFromProfile(profile?.avatar ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSelfAvatarFromProfile(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, currentUser?.id, currentUser?.avatar]);

  useEffect(() => {
    if (scene === 'MATCHING' && gameMode === 'FRIEND' && !selectedOpponentId && friends[0]) {
      setSelectedOpponentId(friends[0].id);
    }
  }, [friends, selectedOpponentId, scene, gameMode]);

  const selectedOpponent = useMemo(
    () => {
      if (gameMode !== 'FRIEND' || !selectedOpponentId) return null;
      const found = friends.find((friend) => friend.id === selectedOpponentId);
      return found ?? { id: selectedOpponentId, displayName: 'Loading...', username: '...', avatar: null };
    },
    [friends, selectedOpponentId, gameMode]
  );

  const currentUserAvatar = resolveAvatarSrc(currentUser?.avatar || selfAvatarFromProfile || null);
  const selectedOpponentAvatar = resolveAvatarSrc(
    (selectedOpponent as PublicUser | null)?.avatar || opponentFromProfile?.avatar || null,
  );
  const selectedOpponentDisplayName =
    (selectedOpponent as PublicUser | null)?.displayName || opponentFromProfile?.displayName || null;

  useEffect(() => {
    if (gameMode !== 'FRIEND' || !token || !selectedOpponentId) {
      setOpponentFromProfile(null);
      return;
    }

    const friendAvatar = (selectedOpponent as PublicUser | null)?.avatar ?? null;
    if (friendAvatar) {
      setOpponentFromProfile(null);
      return;
    }

    let cancelled = false;
    void fetchUserProfile(token, selectedOpponentId)
      .then((profile) => {
        if (cancelled) return;
        setOpponentFromProfile({
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          avatar: profile.avatar,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setOpponentFromProfile(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [gameMode, token, selectedOpponentId, selectedOpponent]);

  useEffect(() => {
    setOpponentAvatarLoadFailed(false);
  }, [selectedOpponentAvatar]);

  const scores = gameState?.score ?? (scene === 'RESULT' ? finalScores : { p1: 0, p2: 0 });
  const matchFinished = gameState?.status === 'finished';
  const selfDisplayName = currentUser?.name || t('game.guest');
  const opponentDisplayName = (() => {
    if (selectedOpponentDisplayName) {
      return selectedOpponentDisplayName;
    }

    switch (gameMode) {
      case 'LOCAL':
        return t('game.player2') || 'PLAYER 2';
      case 'AI':
        return t('game.cpu') || 'CPU (AI)';
      case 'FRIEND':
        return t('game.waiting') || 'WAITING...';
      default:
        return t('game.waiting') || 'WAITING...';
    }
  })();
  const hasOpponentSlot = gameMode === 'LOCAL' || gameMode === 'AI' || !!selectedOpponent;
  const leftPlayer = playerSide === 'p1'
    ? { name: selfDisplayName, avatar: currentUserAvatar, score: scores.p1 }
    : { name: opponentDisplayName, avatar: selectedOpponentAvatar, score: scores.p1 };
  const rightPlayer = playerSide === 'p2'
    ? { name: selfDisplayName, avatar: currentUserAvatar, score: scores.p2 }
    : { name: opponentDisplayName, avatar: selectedOpponentAvatar, score: scores.p2 };

  const handleStartRecordedMatch = async () => {
  if (!token || !selectedOpponent || !currentUser) return;
  setBusy(true);

  try {
    let matchIdToUse = receivedMatchId;

    if (!matchIdToUse) {
      const response = await startMatch(token, 'ONLINE_MULTIPLAYER'); 
      matchIdToUse = response.matchId;
    }

    globalSocket.emit('inviteFriend', { 
      matchId: matchIdToUse, 
      opponentId: selectedOpponent.id 
    });
    
    setScene('MATCHING'); 
    setNotice(t('game.waiting'));

  } catch (e) {
    console.error(e);
    setError(t('errors.failedToStartMatch'));
  } finally {
    setBusy(false);
  }
};

  const handleMatchEnd = async (state: GameState) => {
    // 試合終了時のスコアを保存
    setFinalScores({ p1: state.score.p1, p2: state.score.p2 });
  // --- 1. 勝敗判定のロジックを整理 ---
    // 自分が P1 で勝者が P1、または自分が P2 で勝者が P2 なら「自分の勝ち」
    const isMeWinner = (playerSide === 'p1' && state.winner === 'p1') || 
                      (playerSide === 'p2' && state.winner === 'p2');
    
    // 表示用の名前を決定（ここで一回だけセットする）
    const finalWinnerName = isMeWinner 
      ? (currentUser?.name || 'YOU') 
      : (selectedOpponent?.displayName || 'OPPONENT');

    setWinner(finalWinnerName);

    // --- 2. ローカル / AI 戦の場合 ---
    if (gameMode === 'LOCAL' || gameMode === 'AI') {
      setScene('RESULT');
      setError(null);
      return;
    }

    // --- 3. オンライン対戦（FRIEND）のバリデーション ---
    if (!token || !currentUser || !activeMatchId || !selectedOpponent) {
      setScene('RESULT');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const myScore = playerSide === 'p1' ? state.score.p1 : state.score.p2;
      const opponentScore = playerSide === 'p1' ? state.score.p2 : state.score.p1;
      const response = await finalizeMatch(token, activeMatchId, [
      {
        userId: currentUser.id,
        score: myScore,      // 変数を使用
        isWinner: isMeWinner,
      },
      {
        userId: selectedOpponent.id,
        score: opponentScore, // 変数を使用
        isWinner: !isMeWinner,
      },
    ]);

      setNotice(
        response.alreadyFinalized
          ? t('game.matchAlreadyFinalized')
          : t('game.savedResult', { 
              p1: myScore, 
            p2: opponentScore,
              name: selectedOpponent.displayName 
            }),
      );
      
      setScene('RESULT');
    } catch (nextError) {
      console.error("Finalize Error:", nextError);
      setError(nextError instanceof Error ? nextError.message : t('errors.failedToSaveMatch'));
      setScene('RESULT');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-2 sm:p-4 bg-[#0f1219] space-y-2 sm:space-y-3 overflow-y-auto">
      
      {/* 1. スコアボードセクション */}
      <div className={`w-full max-w-4xl bg-gray-800 rounded-2xl p-3 sm:p-5 flex justify-between items-center shadow-2xl border border-gray-700 flex-shrink-0 transition-opacity ${scene !== 'PLAYING' ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[100px]">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-lg sm:text-2xl border-2 sm:border-4 border-gray-700 overflow-hidden">
              {leftPlayer.avatar ? (
                <img
                  src={leftPlayer.avatar}
                  alt={t('profile.avatar')}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (leftPlayer.avatar === selectedOpponentAvatar) {
                      setOpponentAvatarLoadFailed(true);
                    }
                  }}
                />
              ) : (
                "👤"
              )}
            </div>

            <span className="font-bold text-white text-[10px] sm:text-base mt-1 truncate max-w-full">
              {leftPlayer.name}
            </span>

            {/* スコアなど　*/}
            <span className="text-2xl sm:text-4xl font-black text-blue-400 leading-none">
              {leftPlayer.score}
            </span>
          </div>

        <div className="flex flex-col items-center mx-2">
          <span className="text-gray-500 font-black text-sm sm:text-xl tracking-tighter">{t('game.vs')}</span>
        </div>

        <div className="flex flex-col items-center min-w-[60px] sm:min-w-[100px]">
          {/* アバターエリア */}
          <div className={`
              w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl border-2 sm:border-4 transition-all duration-500 overflow-hidden
              ${hasOpponentSlot
                ? 'bg-red-500 border-gray-700' 
                : 'bg-red-500/20 border-gray-700/50'
              }
            `}>
              {rightPlayer.avatar && !opponentAvatarLoadFailed ? (
                <img 
                  src={rightPlayer.avatar} 
                  alt={t('game.opponent')} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setOpponentAvatarLoadFailed(true)}
                />
              ) : (
                <span className={hasOpponentSlot ? 'opacity-100' : 'opacity-30'}>
                  {gameMode === 'AI' ? '🤖' : '👤'}
                </span>
              )}
            </div>

          {/* 名前ラベル */}
          <span className={`
            font-bold text-[10px] sm:text-base mt-1 truncate max-w-full uppercase transition-colors duration-500
            ${hasOpponentSlot ? 'text-white' : 'text-gray-500 italic'}
          `}>
            {rightPlayer.name}
          </span>

          {/* スコア数値 */}
          <span className={`
            text-2xl sm:text-4xl font-black leading-none transition-colors duration-500
            ${hasOpponentSlot ? 'text-red-400' : 'text-red-400/30'}
          `}>
            {rightPlayer.score}
          </span>
        </div>
      </div>

      {/* 2. Game Area */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto px-2">

        <div className="flex-1 flex flex-col items-center">
          <div 
            className="bg-black rounded-xl shadow-2xl border-4 border-gray-800 relative flex items-center justify-center overflow-hidden w-full aspect-square"
            style={{ maxWidth: `${WORLD_WIDTH}px` }}
          >
         {/* --- INITIAL --- */}
          {scene === 'INITIAL' && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-4 sm:mb-6 text-blue-400 animate-bounce">
                <svg className="w-10 h-10 sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              
              <button 
                onClick={() => setScene('MODE_SELECT')}
                className="
                  w-full max-w-[280px] sm:max-w-xs
                  py-3 sm:py-5
                  bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black shadow-lg transition-transform active:scale-95
                  flex items-center justify-center
                  mx-auto px-4
                "
              >
                <span className="
                  text-[14px] sm:text-xl md:text-2xl
                  whitespace-nowrap 
                  tracking-tight
                  overflow-hidden text-ellipsis
                ">
                  {t('game.ready')}
                </span>
              </button>
            </div>
          )}

          {/* --- MODE_SELECT*/}
          {scene === 'MODE_SELECT' && (
            <div className="absolute inset-0 z-20 bg-gray-900/95 flex flex-col items-center justify-center p-4">
              <h2 className="text-white text-xl sm:text-2xl font-black mb-6 tracking-tighter">{t('game.selectMode')}</h2>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl px-2">
                {[
                  { id: 'FRIEND', labelKey: 'game.friendMatch', emoji: '🤝', color: 'bg-purple-600', border: 'border-purple-800' },
                  { id: 'LOCAL', labelKey: 'game.localPvP', emoji: '🏠', color: 'bg-green-600', border: 'border-green-800' },
                  { id: 'AI', labelKey: 'game.vsAi', emoji: '🤖', color: 'bg-orange-600', border: 'border-orange-800' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => selectMode(mode.id as GameMode)}
                    className={`${mode.color} ${mode.border} flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl text-white shadow-lg border-b-4 active:scale-95 transition-all min-h-[80px] sm:min-h-[110px] overflow-hidden`}
                  >
                    <span className="text-xl sm:text-2xl mb-1">{mode.emoji}</span>
                    
                    {/* テキスト部分：ここが重要 */}
                    <span className="
                      w-full
                      text-[min(2.5vw,14px)] sm:text-base 
                      font-black 
                      leading-tight
                      break-words 
                      hyphens-auto
                      text-center
                    ">
                      {t(mode.labelKey)}
                    </span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setScene('INITIAL')} 
                className="mt-8 text-gray-500 hover:text-gray-300 text-[10px] sm:text-xs underline tracking-widest uppercase"
              >
                {t('game.backToTitle')}
              </button>
            </div>
          )}

          {scene === 'RESULT' && (
            <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
              {(() => {
                const isLocalOnly = gameMode === 'LOCAL';
                const isMeWinner = winner === currentUser?.name;
                
                return (
                  <>
                    <h2 className={`text-4xl sm:text-7xl font-black mb-2 italic uppercase tracking-tighter ${
                      (isLocalOnly || isMeWinner) ? 'text-blue-400' : 'text-red-500'
                    }`}>
                      {(() => {
                        if (isLocalOnly) {
                          return `${winner} WIN!`;
                        }
                        return isMeWinner 
                          ? (t('game.win') || 'YOU WIN!') 
                          : (t('game.lose') || 'YOU LOSE...');
                      })()}
                    </h2>
                    
                    <p className="text-gray-500 mb-10 uppercase tracking-[0.3em] font-black text-xs">
                      {t('game.greatMatch') || 'GREAT MATCH!'}
                    </p>
                  </>
                );
              })()}
              
              <div className="flex flex-col gap-4 w-full max-w-[260px]">
                <button 
                  onClick={backToMenu}
                  className="py-4 bg-white text-black rounded-full font-black hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-widest text-sm"
                >
                  {t('game.rematch') || 'REMATCH'}
                </button>
                
                <button 
                  onClick={() => {
                    setActiveMatchId(null);
                    setPlayerSide('p1');
                    localStorage.removeItem('playerSide');
                    localStorage.removeItem('activeMatchId');
                    setNotice(null);
                    setError(null);
                    setWinner(null);
                    setScene('INITIAL');}}
                  className="py-4 bg-gray-900 text-gray-400 border border-gray-800 rounded-full font-black hover:bg-gray-800 hover:text-white transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  {t('game.quit') || 'QUIT'}
                </button>
              </div>
            </div>
          )}
          

      <div className="min-h-[80px]">
          {matchFinished && (
            <div className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
              {t('game.roundFinished')} {gameState?.winner === 'p1' ? t('game.player1Wins') : t('game.player2Wins')}
            </div>
          )}

          {error && gameMode !== 'LOCAL' && gameMode !== 'AI' && (
            <div className="mt-4 rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {translateApiMessage(error, t)}
            </div>
          )}
      </div>

      {/* --- MATCHING: 招待やトーナメント待ち --- */}
      {scene === 'MATCHING' && (
        <div className="absolute inset-0 z-20 bg-gray-900/95 flex flex-col items-center justify-center p-6 text-center text-white backdrop-blur-sm">
          <h3 className="text-2xl font-black mb-2 underline decoration-blue-500 uppercase italic">
            {t('game.statsReadyGame')}
          </h3>

          <p className="text-gray-400 mb-8 text-xs uppercase tracking-widest">
            {t('game.recordedMatchNote')}
          </p>

          {gameMode === 'FRIEND' && (
            <div className="w-full max-w-sm space-y-6 mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              {/* 対戦相手選択 */}
              <div className="flex flex-col gap-3 text-left">
                <label className="text-xs font-black text-blue-400 uppercase tracking-tighter ml-1">
                  {t('game.opponent')}
                </label>
                <select
                  value={selectedOpponentId}
                  onChange={(event) => setSelectedOpponentId(event.target.value)}
                  disabled={loadingFriends || busy || !!activeMatchId}
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition-all"
                >
                  {friends.length === 0 && <option value="">{t('game.noFriendsAvailable')}</option>}
                  {friends.map((friend) => (
                    <option key={friend.id} value={friend.id}>
                      {friend.displayName} (@{friend.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* メインアクションボタン */}
              <button
                type="button"
                onClick={() => {
                  void handleStartRecordedMatch();
                }}
                disabled={!token || !selectedOpponent || busy}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {busy && activeMatchId ? t('game.saving') : t('game.startRecordedMatch')}
              </button>
            </div>
          )}

          {/* キャンセル・サブボタン */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={backToMenu}
              className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {t('game.backToMenu')}
            </button>
          </div>
        </div>
      )}

      {/* --- PLAYING: ゲーム実行中 --- */}
      {scene === 'PLAYING' && (
        <div className="w-full h-full flex items-center justify-center">
          <Pong
            socket={globalSocket}
            gameId={activeMatchId || ""}
            resetKey={resetKey}
            playerSide={playerSide}
            initialState={initialGameState}
            onStateChange={setGameState}
            onMatchEnd={(state) => {
              let winnerDisplayName: string;
              
              if (gameMode === 'LOCAL') {
                winnerDisplayName = state.winner === 'p1' ? 'PLAYER 1' : 'PLAYER 2';
              } else if (gameMode === 'AI') {
                winnerDisplayName = state.winner === 'p1' ? (currentUser?.name || 'YOU') : 'CPU (AI)';
              } else {
                const p1DisplayName = playerSide === 'p1'
                  ? (currentUser?.name || 'P1')
                  : (selectedOpponent?.displayName || 'P1');
                const p2DisplayName = playerSide === 'p2'
                  ? (currentUser?.name || 'P2')
                  : (selectedOpponent?.displayName || 'P2');
                winnerDisplayName = state.winner === 'p1' ? p1DisplayName : p2DisplayName;
              }

              setWinner(winnerDisplayName);
              setFinalScores({ p1: state.score.p1, p2: state.score.p2 });

              if (gameMode !== 'LOCAL' && gameMode !== 'AI') {
                void handleMatchEnd(state);
              } else {
                setScene('RESULT'); 
              }
            }}
            mode={gameMode}
          />
        </div>
      )}

      {/* センターライン */}
      <div className="absolute inset-y-0 left-1/2 w-0.5 border-l-2 border-dashed border-gray-700/50 pointer-events-none"></div>
        </div>
          <div className="w-full min-h-[60px] mt-4">
            {notice && <div className="rounded-xl border border-blue-800/60 bg-blue-950/30 px-4 py-3 text-xs text-blue-200">{notice}</div>}
            {error && <div className="rounded-xl border border-red-800/60 bg-red-950/30 px-4 py-3 text-xs text-red-300">{error}</div>}
          </div>
        </div>
      </div>

      {/* 4. 操作説明・インフォメーションセクション */}
      <div className={`
        w-full max-w-4xl flex flex-col items-center gap-3 text-gray-400 flex-shrink-0 pb-6 transition-opacity 
        ${scene === 'INITIAL' || scene === 'MODE_SELECT' ? 'opacity-100' : 'opacity-60'}
      `}>
        
        {/* 操作ガイドバッジ */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-1.5 rounded-full border border-gray-700">
            <span className="bg-gray-600 px-2 py-0.5 rounded text-white font-mono text-[10px] sm:text-xs">W / S</span>
            <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-gray-300">{t('game.movePaddle')}</span>
          </div>
          
          {/* 追加：ポーズやリセットのヒント（もしあれば） */}
          <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
            <span>•</span>
            <span>{gameMode === 'FRIEND' ? t('game.recordedMatch') : t('game.casualMode')}</span>
          </div>
        </div>

        {/* 注意書きメッセージ：さりげなく表示 */}
        <p className="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium text-center max-w-xs leading-relaxed">
          {t('game.recordedMatchNote')}
        </p>

      </div>
    </div>
  );
};
