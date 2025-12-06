'use client'; 

import { useTranslations } from 'next-intl';
import { DemoBadge } from './DemoBadge'; 

// A Footer (Lábléc) komponens definíciója
export const Footer = () => {
  // A 'Template' névtérhez tartozó fordítások betöltése
  // Ezzel érjük el a szövegeket
  const t = useTranslations('Template');
  
  return (
    // A lábléc szemantikus HTML eleme (footer) Tailwind stílusokkal:
    <footer className="w-full sm:w-[95%] lg:w-[96%] text-center text-xs sm:text-sm text-gray-300 py-6 px-4">
      
      {/* Belső konténer a tartalom elrendezéséhez */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        
        {/* Szerzői jogi szöveg az aktuális évszám dinamikus lekérésével */}
        <span>© {new Date().getFullYear()}</span>
        
        {/* Nyitvatartás szövege a nyelvi fájlból + fix időpont */}
        <span>{t('openDays')}: 8:00–17:00</span>
        
        {/* A DemoBadge komponens beillesztése (pl. a lebegő telefon ikon) */}
        <DemoBadge />
      </div>
    </footer>
  );
};