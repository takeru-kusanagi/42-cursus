import { useTranslation } from 'react-i18next';

export const Terms = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

return (
  <div className={`min-h-screen bg-[#05070a] text-gray-400 p-4 sm:p-8 selection:bg-blue-500/30`} dir={isRtl ? 'rtl' : 'ltr'}>
    {/* 背景の装飾：うっすらとした光の溜まり */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
    </div>

    <div className="max-w-3xl mx-auto relative">
      {/* 戻るボタンを上部に配置してアクセシビリティ向上 */}
      <button 
        onClick={() => window.history.back()} 
        className="group flex items-center gap-2 text-xs font-black tracking-widest text-gray-500 hover:text-blue-400 transition-colors mb-6 uppercase"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {t('legal.back')}
      </button>

      <div className="bg-[#0d1117]/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* 装飾用の細いライン */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter italic uppercase">
            {t('legal.termsTitle')}
          </h1>
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
            <span className="w-8 h-[1px] bg-gray-800" />
            {t('legal.lastUpdated')}
          </div>
        </header>

        <div className="space-y-12 relative">
          {/* Section 01 */}
          <section className="group">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] font-mono text-blue-500/50 font-bold tracking-tighter">01 //</span>
              <h2 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                {t('legal.sectionAbout')}
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed pl-10 border-l border-gray-800/50 group-hover:border-blue-500/30 transition-colors">
              {t('legal.sectionAboutBody')}
            </p>
          </section>

          {/* Section 02 */}
          <section className="group">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] font-mono text-blue-500/50 font-bold tracking-tighter">02 //</span>
              <h2 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                {t('legal.sectionProhibited')}
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed pl-10 border-l border-gray-800/50 group-hover:border-blue-500/30 transition-colors">
              {t('legal.sectionProhibitedBody')}
            </p>
          </section>

          {/* Section 03: Disclaimer (Warning Style) */}
          <section className="group">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] font-mono text-yellow-500/50 font-bold tracking-tighter">03 //</span>
              <h2 className="text-lg font-black text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                {t('legal.sectionDisclaimer')}
              </h2>
            </div>
            <div className="pl-10">
              <div className="bg-yellow-500/5 p-5 rounded-2xl border border-yellow-500/20 text-yellow-200/80 text-sm leading-relaxed relative overflow-hidden">
                {/* 警告用の斜線背景をうっすら入れる */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
                {t('legal.sectionDisclaimerBody')}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-800/50 flex justify-center text-[10px] font-bold tracking-[0.3em] text-gray-600 uppercase">
          {t('legal.copyright') || '© 2026 FT_TRANSCENDENCE'}
        </footer>
      </div>
    </div>
  </div>
);
};