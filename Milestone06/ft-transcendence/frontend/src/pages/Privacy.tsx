import { useTranslation } from 'react-i18next';

export const Privacy = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-400 p-4 sm:p-8 selection:bg-blue-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center gap-2 text-xs font-black tracking-[0.2em] text-gray-500 hover:text-blue-400 transition-colors mb-6 uppercase"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {t('legal.back')}
        </button>

        <div className="bg-[#0d1117]/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter italic uppercase">
              {t('legal.privacyTitle')}
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
              <span className="w-12 h-[1px] bg-gray-800" />
              {t('legal.lastUpdated')}
            </div>
          </header>

          <div className="space-y-16 relative">
            {/* Section 01: 取得情報 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all group-hover:h-8" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {t('legal.p_section1')}
                </h2>
              </div>
              <div className="pl-6 border-l border-gray-800/50 ml-0.5">
                <p className="text-sm sm:text-base leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                  {t('legal.p_section1Body')}
                </p>
              </div>
            </section>

            {/* Section 02: 利用目的 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all group-hover:h-8" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {t('legal.p_section2')}
                </h2>
              </div>
              <div className="pl-6 border-l border-gray-800/50 ml-0.5">
                <p className="text-sm sm:text-base leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                  {t('legal.p_section2Body')}
                </p>
              </div>
            </section>

            {/* Section 03: データの保存 */}
            <section className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-all group-hover:h-8" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {t('legal.p_section3')}
                </h2>
              </div>
              <div className="pl-6 border-l border-gray-800/50 ml-0.5">
                <p className="text-sm sm:text-base leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                  {t('legal.p_section3Body')}
                </p>
              </div>
            </section>
          </div>

          <footer className="mt-20 pt-8 border-t border-gray-800/50 flex flex-col items-center gap-4">
            <div className="text-[10px] font-bold tracking-[0.4em] text-gray-700 uppercase">
              Secure Data Protocol Active
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              {t('legal.copyright')}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};