import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register } from '../api/auth';
import { translateApiMessage } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (password.length < 6) {
      setError(t('errors.passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('errors.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await register(username, password, displayName);
      navigate('/login', { state: { message: t('success.passwordResetSuccess') } });
    } catch (err) {
      setError(translateApiMessage(err instanceof Error ? err.message : 'Registration failed', t));
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

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-800">
        
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-500 rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
            🏓
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">ft_transcendence</h2>
          <p className="mt-2 text-sm text-gray-400">{t('register.title')}</p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-400 text-xs animate-pulse text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-gray-400 text-xs ml-1">{t('login.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#0f1219] border border-gray-800 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                required
                maxLength={20}
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 text-xs ml-1">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#0f1219] border border-gray-800 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
                maxLength={20}
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 text-xs ml-1">{t('resetPassword.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#0f1219] border border-gray-800 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
                maxLength={20}
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 text-xs ml-1">{t('register.name')}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#0f1219] border border-gray-800 text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
                maxLength={20}
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#3b66f5] hover:bg-blue-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg"
              >
                {loading ? t('register.submitting') : t('register.submit')}
              </button>
              
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center py-3 bg-[#323844] hover:bg-[#3d4452] text-white font-bold rounded-lg transition-all text-sm shadow-md"
              >
                {t('register.backToLogin')}
              </Link>
            </div>
          </div>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">Pong Account</span>
          <div className="flex-grow border-t border-gray-800"></div>
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

        <p className="text-center text-[10px] text-gray-500 px-4 leading-relaxed">
          {t('register.policies')}
        </p>
      </div>
    </div>
  );
}