import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { fetchMe } from '../api/auth';

export default function LoginCallback() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMe(token).then((me) => {
      if (me) {
        setAuth(me, token);
        navigate('/', { replace: true });
      } else {
        navigate('/login');
      }
    });
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-gray-400">{t('loginCallback.signingIn')}</p>
    </div>
  );
}
