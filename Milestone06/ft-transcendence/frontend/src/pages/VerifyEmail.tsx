import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyEmail } from '../api/auth';
import { translateApiMessage } from '../i18n';

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const executedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('errors.invalidVerificationLink'));
      return;
    }
    if (executedRef.current) return;
    executedRef.current = true;

    verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        let msg = err instanceof Error ? err.message : 'Verification failed';
        if (msg.includes('Invalid') || msg.includes('expired')) {
          msg = t('errors.linkInvalidOrUsed');
        } else {
          msg = translateApiMessage(msg, t);
        }
        setMessage(msg);
      });
  }, [token, t]);

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      {status === 'loading' && (
        <p className="text-gray-400">{t('verifyEmail.verifying')}</p>
      )}
      {status === 'success' && (
        <div>
          <p className="text-green-400 text-xl font-semibold mb-4">
            {t('verifyEmail.success')}
          </p>
          <Link
            to="/profile"
            className="text-blue-400 hover:underline"
          >
            {t('verifyEmail.goToProfile')}
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p className="text-red-400 text-xl font-semibold mb-4">{message}</p>
          <Link
            to="/profile"
            className="text-blue-400 hover:underline"
          >
            {t('verifyEmail.backToProfile')}
          </Link>
        </div>
      )}
    </div>
  );
}
