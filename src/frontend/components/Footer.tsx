'use client';

import { useTranslations } from 'next-intl';
import { DemoBadge } from './DemoBadge';

export const Footer = () => {
  const t = useTranslations('Template');
  
  return (
    <footer className="w-full sm:w-[95%] lg:w-[96%] text-center text-xs sm:text-sm text-gray-300 py-6 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        <span>© {new Date().getFullYear()}</span>
        <span>{t('openDays')}: 8:00–17:00</span>
        <DemoBadge />
      </div>
    </footer>
  );
};