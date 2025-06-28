'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname } from '@/libs/I18nNavigation';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '/assets/flags/en_flag.png',
  },
  {
    code: 'ro',
    name: 'Română',
    flag: '/assets/flags/ro_flag.png',
  },
];

export const LocaleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find(lang => lang.code === locale);

  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}${pathname}`);
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Gomb a nyelvváltáshoz */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white hover:bg-white/20 transition"
      >
        <Image
          src={currentLang?.flag || ''}
          alt={`${currentLang?.name} flag`}
          width={20}
          height={15}
          className="rounded-sm border"
        />
        <span>{currentLang?.name}</span>
        <svg
          className="ml-1 h-4 w-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.134l3.71-3.905a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {/* Lenyíló menü */}
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-36 rounded-md border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-lg z-50">
          {languages
            .filter(lang => lang.code !== locale)
            .map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLocaleChange(lang.code)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-white/20 transition"
                >
                  <Image
                    src={lang.flag}
                    alt={`${lang.name} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm border"
                  />
                  <span>{lang.name}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
