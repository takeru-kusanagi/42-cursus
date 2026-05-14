import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/authStore';
import { useChatStore } from './store/chatStore';
import { useFriendsStore } from './store/friendsStore';
import { fetchMe } from './api/auth';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import LoginCallback from './pages/LoginCallback';
import TwoFactorVerify from './pages/TwoFactorVerify';
import { Admin } from './pages/Admin';
import { Friends } from './pages/Friends';
import { Chat } from './pages/Chat';
import { UserProfile } from './pages/UserProfile';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Settings } from './pages/Settings';

function ProtectedLayout() {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  const token = useAuthStore((state) => state.token);
  const me = useAuthStore((state) => state.me);
  const user = useAuthStore((state) => state.user);
  const setMe = useAuthStore((state) => state.setMe);
  const connectChat = useChatStore((state) => state.connect);
  const disconnectChat = useChatStore((state) => state.disconnect);
  const loadRequests = useFriendsStore((state) => state.loadRequests);
  const resetFriends = useFriendsStore((state) => state.reset);
  const hydratedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;

    if (hydratedTokenRef.current === token) return;

    const current = me ?? user;
    if (current?.avatar) {
      hydratedTokenRef.current = token;
      return;
    }

    hydratedTokenRef.current = token;

    fetchMe(token)
      .then((data) => {
        if (!data) return;
        setMe({
          id: data.id,
          username: data.username,
          name: data.name ?? data.username,
          avatar: data.avatar ?? null,
        });
      })
      .catch(() => {
        setMe(null);
      });
  }, [token, me, user, setMe]);

  useEffect(() => {
    if (!token) {
      hydratedTokenRef.current = null;
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      disconnectChat();
      return;
    }
    connectChat(token);
    return () => {
      disconnectChat();
    };
  }, [token, connectChat, disconnectChat]);

  useEffect(() => {
    if (!token) {
      resetFriends();
      return;
    }

    void loadRequests(token);
    const intervalId = window.setInterval(() => {
      void loadRequests(token);
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [token, loadRequests, resetFriends]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/login/2fa" element={<TwoFactorVerify />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/stats" element={<Navigate to="/profile" replace />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
