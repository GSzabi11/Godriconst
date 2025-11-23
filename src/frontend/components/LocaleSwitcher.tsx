'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@backend/libs/I18nNavigation';

// Nyelvváltó gomb zászló ikonokkal, amely a jelenlegi útvonalat megtartva vált locale-t.
// A menü elhelyezése dinamikusan változik, hogy mindig látható maradjon a képernyőn.
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
  {
    code: 'hu',
    name: 'Magyar',
    flag: '/assets/flags/hu_flag.png',
  },

];

// Komponensfüggvény, amely a jelenlegi útvonal megtartása mellett vált a kiválasztott nyelvre.
export const LocaleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find(lang => lang.code === locale);

  // Nyelvváltó handler: átirányít az aktuális útvonalra az új locale prefixszel, majd frissít.
  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}${pathname}`);
    router.refresh();
    setIsOpen(false);
  };

  // Menüirány dinamikus beállítása
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Ha kevés hely van lefelé, de elég hely van felfelé, nyíljon felfelé
      setOpenUpward(spaceBelow < 150 && spaceAbove > 200);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full max-w-full text-left">
      {/* Nyelvváltó gomb */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-white/30 bg-white/10 backdrop-blur-md px-3 py-2 text-xs text-white hover:bg-white/20 transition whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
          <Image
            src={currentLang?.flag || ''}
            alt={`${currentLang?.name} flag`}
            width={20}
            height={15}
            className="rounded-sm border shrink-0"
          />
          <span className="truncate">{currentLang?.name}</span>
        </div>
        <svg
          className="h-4 w-4 text-white shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.134l3.71-3.905a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {/* Lenyíló nyelvválasztó menü */}
      {isOpen && (
        <ul
          className={`absolute ${openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
            } w-full min-w-[120px] max-w-[200px] rounded-md border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-lg z-50`}
        >
          {languages
            .filter(lang => lang.code !== locale)
            .map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLocaleChange(lang.code)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-white/20 transition"
                >
                  <Image
                    src={lang.flag}
                    alt={`${lang.name} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm border"
                  />
                  <span className="truncate">{lang.name}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
