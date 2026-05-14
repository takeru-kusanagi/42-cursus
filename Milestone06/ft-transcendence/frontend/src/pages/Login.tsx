import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { login } from '../api/auth';
import { translateApiMessage } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher'; 

export const Login = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(translateApiMessage(decodeURIComponent(urlError), t));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.requiresTwoFactor) {
        navigate('/login/2fa', { state: { tempToken: data.tempToken } });
      } else {
        setAuth(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(translateApiMessage(err instanceof Error ? err.message : 'Login failed', t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-sans relative">
      
      {/* Login.tsx */}
    <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[9999]">
      <div className="flex items-center justify-center pointer-events-auto">
        <div className="min-w-[40px] lg:min-w-[120px] transition-all">
          <div className="transform scale-110 sm:scale-100 origin-right">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-500 rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
            🏓
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">ft_transcendence</h2>
          <p className="mt-2 text-sm text-gray-400 font-medium">{t('login.title')}</p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-400 text-xs animate-pulse text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const el = e.target as HTMLElement;
              if (el.tagName === 'INPUT') {
                e.preventDefault();
                (el as HTMLInputElement).form?.requestSubmit();
              }
            }
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <label className="text-gray-400 text-xs ml-1">{t('login.username')}</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
              required
              autoComplete="username"
              maxLength={20}
            />
            <label className="text-gray-400 text-xs ml-1">{t('login.password')}</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
              required
              autoComplete="current-password"
              maxLength={20}
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-3 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg active:scale-95 text-sm sm:text-base"
              >
                {loading ? t('login.loggingIn') : t('login.submit')}
              </button>
              
              <Link
                to="/register"
                className="w-1/2 flex items-center justify-center py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all text-sm sm:text-base border border-gray-600"
              >
                {t('login.registerNewMember')}
              </Link>
            </div>

            <div className="text-center pt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                {t('login.forgotPassword')}?
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500 leading-relaxed">
              <Link to="/terms" className="text-blue-500 hover:text-blue-400 underline transition-colors">
                {t('legal.termsTitle')}
              </Link>
              {' '}&{' '}
              <Link to="/privacy" className="text-blue-500 hover:text-blue-400 underline transition-colors">
                {t('legal.privacyTitle')}
              </Link>
            </p>
          </div>
        </form>

        <div className="relative flex items-center py-0">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs font-bold tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => { window.location.href = '/api/auth/google'; }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-md active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          {/* <button
            onClick={() => { window.location.href = '/api/auth/42'; }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all shadow-md active:scale-[0.98]"
          >
            <span className="text-lg font-black">42</span> Network
          </button> */}
        </div>
      </div>
    </div>
  );
};
