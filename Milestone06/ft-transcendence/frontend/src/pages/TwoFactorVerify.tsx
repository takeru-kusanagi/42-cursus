import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { verifyTwoFactor } from '../api/auth';
import { translateApiMessage } from '../i18n';

export default function TwoFactorVerify() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const tempToken = (location.state as { tempToken?: string })?.tempToken;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;
    setError('');
    setLoading(true);
    try {
      const { user, token } = await verifyTwoFactor(tempToken, code);
      setAuth(user, token);
      navigate('/');
    } catch (err) {
      setError(translateApiMessage(err instanceof Error ? err.message : 'Invalid code', t));
    } finally {
      setLoading(false);
    }
  };

  if (!tempToken) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <h1 className="text-2xl font-bold mb-6">{t('twoFactor.title')}</h1>
        <p className="text-gray-400 mb-4">{t('twoFactor.sessionExpired')}</p>
        <Link to="/login" className="text-blue-400 hover:underline">
          {t('twoFactor.backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6">{t('twoFactor.title')}</h1>
      <p className="text-gray-400 mb-6">{t('twoFactor.description')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('twoFactor.verificationCode')}</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none text-center text-xl tracking-widest"
            placeholder="000000"
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? t('common.verifying') : t('common.verify')}
          </button>
          <Link
            to="/login"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-center"
          >
            {t('twoFactor.backToLogin')}
          </Link>
        </div>
      </form>
    </div>
  );
}
