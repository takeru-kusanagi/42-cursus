import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useFriendsStore } from '../store/friendsStore';
import LanguageSwitcher from './LanguageSwitcher';
import type { ReactNode } from 'react';

type LayoutProps = {
  children?: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { me, user, logout } = useAuthStore();
  const currentUser = me ?? user;
  const { t } = useTranslation();
  const totalUnread = useChatStore((state) =>
    Object.values(state.unreadByUserId).reduce((sum, count) => sum + count, 0),
  );
  const pendingRequests = useFriendsStore((state) => state.requests.length);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <aside className="fixed bottom-0 left-0 w-full h-20 bg-gray-800 border-t border-gray-700 flex flex-row md:relative md:flex-col md:h-full md:w-20 lg:w-64 md:border-t-0 md:border-r p-2 md:p-4 z-50 transition-all duration-300">
        <h1 className="hidden lg:block text-xl font-black mb-3 text-blue-400 tracking-tighter italic uppercase">
          {t('nav.brand')}
        </h1>

        <nav className="flex-1 w-full">
          <ul className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 h-full">
            {[
              { to: '/', label: t('nav.game'), icon: '🎮' },
              { to: '/profile', label: t('nav.profile'), icon: '👤' },
              { to: '/friends', label: t('nav.friends'), icon: '👥', unread: pendingRequests },
              { to: '/chat', label: 'DM', icon: '💬', unread: totalUnread },
              { to: '/settings', label: t('settings.title'), icon: '⚙️' },
            ].map((item) => (
              <li key={item.to} className="flex-1 md:flex-none">
                <Link
                  to={item.to}
                  className="relative flex flex-col md:flex-row items-center gap-1 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-gray-700 hover:text-blue-400 transition-all group"
                >
                  <span className="text-xl md:text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[10px] md:hidden lg:block md:text-sm font-bold uppercase tracking-widest">
                    {item.label}
                  </span>

                  {item.unread !== undefined && item.unread > 0 && (
                    <span className="absolute top-1 right-2 md:static min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">
                      {Math.min(item.unread, 99)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-row md:flex-col items-center md:items-stretch mt-0 md:mt-auto pt-0 md:pt-4 border-l md:border-l-0 md:border-t border-gray-700 ml-2 md:ml-0 pl-2 md:pl-0 space-y-0 md:space-y-4">
          <div className="min-w-[40px] lg:min-w-[120px] transition-all">
            <div className="transform scale-90 md:scale-100 origin-center">
              <LanguageSwitcher />
            </div>
          </div>

          {currentUser && (
            <div className="flex flex-row md:flex-col items-center lg:items-start gap-2 ml-2 md:ml-0">
              <p className="hidden lg:block text-[10px] text-gray-500 uppercase font-black px-2">
                {t('login.username')}: <span className="text-gray-300 truncate max-w-[80px] block">{currentUser.username}</span>
              </p>

              <button
                onClick={() => logout()}
                className="flex items-center justify-center p-2 lg:px-4 lg:py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors text-[10px] font-black uppercase"
                title={t('nav.logout')}
              >
                <span className="text-lg md:text-base">🚪</span>
                <span className="hidden lg:inline ml-2">{t('nav.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-900 overflow-y-auto md:mb-0">
        <div className="flex-grow p-4 md:p-8">
          <div className="max-w-5xl mx-auto">{children ?? <Outlet />}</div>
        </div>

        <footer className="py-10 border-t border-gray-800 bg-[#0f1219]/30 flex-shrink-0 mb-16 md:mb-0">
          <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-start">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} {t('nav.brand') || 'ft_transcendence'}
              </p>
              <p className="text-[9px] text-gray-700 mt-1 uppercase font-bold tracking-widest">
                Developed by 42 Tokyo Student
              </p>
            </div>

            <nav>
              <ul className="flex flex-wrap justify-center gap-6">
                <li>
                  <Link
                    to="/terms"
                    className="text-[10px] font-black text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-tighter"
                  >
                    {t('legal.termsTitle') || 'Terms of Service'}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-[10px] font-black text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-tighter"
                  >
                    {t('legal.privacyTitle') || 'Privacy Policy'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
};
