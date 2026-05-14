import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../api/auth';
import { translateApiMessage } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('errors.invalidResetLink'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(t('errors.passwordsDoNotMatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('errors.passwordMinLength'));
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(translateApiMessage(err instanceof Error ? err.message : 'Failed to reset password', t));
    } finally {
      setLoading(false);
    }
  };

  const cardContent = success ? (
    <>
      <h1 className="text-2xl font-bold text-white mb-6">{t('resetPassword.title')}</h1>
      <p className="text-green-400 mb-4">{t('resetPassword.successMessage')}</p>
      <Link
        to="/login"
        className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
      >
        {t('resetPassword.goToLogin')}
      </Link>
    </>
  ) : !token ? (
    <>
      <div className="text-center">
        <div className="mx-auto h-20 w-20 bg-blue-500 rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
          🏓
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">ft_transcendence</h2>
        <p className="mt-2 text-sm text-gray-400 font-medium">{t('resetPassword.title')}</p>
      </div>
      <p className="text-red-400 mb-4">{t('resetPassword.invalidLink')}</p>
      <Link
        to="/forgot-password"
        className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
      >
        {t('resetPassword.requestNewLink')}
      </Link>
    </>
  ) : (
    <>
      <div className="text-center">
        <div className="mx-auto h-20 w-20 bg-blue-500 rounded-xl flex items-center justify-center text-4xl mb-4 shadow-lg text-white">
          🏓
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">ft_transcendence</h2>
        <p className="mt-2 text-sm text-gray-400 font-medium">{t('resetPassword.title')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs ml-1">{t('resetPassword.newPassword')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 mt-1"
            required
            minLength={6}
            autoComplete="new-password"
            maxLength={20}
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs ml-1">{t('resetPassword.confirmPassword')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 mt-1"
            required
            minLength={6}
            autoComplete="new-password"
            maxLength={20}
          />
        </div>
        {error && (
          <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? t('resetPassword.resetting') : t('resetPassword.submit')}
          </button>
          <Link
            to="/login"
            className="flex-1 flex items-center justify-center py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all border border-gray-600"
          >
            {t('resetPassword.backToLogin')}
          </Link>
        </div>
      </form>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-sans relative">
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
        {cardContent}
      </div>
    </div>
  );
}
