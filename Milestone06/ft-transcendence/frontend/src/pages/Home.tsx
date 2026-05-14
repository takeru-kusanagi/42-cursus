import { useTranslation } from 'react-i18next';
import { Game } from './Game';

export const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white">{t('home.title')}</h1>
      </div>

      <div className="w-full flex-shrink-0">
        <Game />
      </div>
    </div>
  );
};