import { useTranslation } from 'react-i18next';
import { i18n, LANGUAGES, type LanguageCode } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation();
  const currentLng = (i18nInstance.language?.split('-')[0] || 'en') as LanguageCode;
  const effectiveLng = LANGUAGES[currentLng] ? currentLng : 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value as LanguageCode;
    i18n.changeLanguage(lng);
    const config = LANGUAGES[lng];
    document.documentElement.setAttribute('dir', config.dir);
    document.documentElement.setAttribute('lang', lng);
  };

 return (
  <div className="relative flex items-center justify-center h-10 w-10 sm:w-auto transition-all duration-300">
    
    <div className="
      absolute inset-0 
      flex items-center justify-center 
      sm:justify-start sm:px-3
      bg-gray-700/50 hover:bg-gray-600 
      rounded-xl sm:rounded-lg border border-gray-600 
      pointer-events-none transition-colors
    ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      
      <span className="hidden sm:inline-block ml-2 text-sm text-gray-200 whitespace-nowrap overflow-hidden">
        {LANGUAGES[effectiveLng].name}
      </span>

      <svg 
        className="hidden sm:block ml-1 w-4 h-4 text-gray-500" 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <select
      value={effectiveLng}
      onChange={handleChange}
      className="
        absolute inset-0 
        w-full h-full 
        opacity-0 
        cursor-pointer
        appearance-none
      "
      aria-label="Select language"
    >
      {(Object.keys(LANGUAGES) as LanguageCode[]).map((lng) => (
        <option key={lng} value={lng} className="text-gray-200 bg-gray-800">
          {LANGUAGES[lng].name}
        </option>
      ))}
    </select>
  </div>
);
}
