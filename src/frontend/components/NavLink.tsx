'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  href: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export const NavLink = ({ href, label, icon, onClick }: Props) => {
  const pathname = usePathname();
  
  // 1. Levágjuk a nyelvi prefixet (pl. "/ro/about" -> "/about")
  // Így a "/about" href pont egyezni fog a rendszer által látott útvonallal.
  const pathWithoutLocale = pathname.replace(/^\/(en|ro|hu)/, '') || '/';

  // 2. Pontos egyezést vizsgálunk, de megengedjük az aloldalakat is (pl. /services/something)
  // Ha a href "/", akkor csak a főoldalon legyen aktív.
  const isActive = href === '/' 
    ? pathWithoutLocale === '/' 
    : pathWithoutLocale.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`
          relative border-none transition-all duration-300 flex items-center gap-2 whitespace-nowrap font-medium
          
          /* Alapállapot */
          text-gray-300
          
          /* Hover effekt (desktop) */
          hover:text-white
          
          /* Mobil érintés effekt */
          active:scale-95 active:text-white
          
          /* Aláhúzás pszeudo-elem */
          after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white 
          after:transition-all after:duration-300
          
          /* Ha aktív, akkor 100% széles, egyébként 0 (de hoverre megnő) */
          ${isActive ? 'text-white after:w-full' : 'after:w-0 hover:after:w-full'}
        `}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};