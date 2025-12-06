'use client';

import { cloneElement, isValidElement, useState, ReactElement, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { MobileMenu } from '../components/MobileMenu';

type BaseTemplateProps = {
  leftNav: React.ReactNode[];
  rightNav?: React.ReactNode;
  children: React.ReactNode;
};

// Fő layout komponens
export function BaseTemplate({
  leftNav,
  rightNav,
  children,
}: BaseTemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Aktuális útvonal figyelése

  // Oldal váltásnál bezárja a mobilos menűt
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Biztosítjuk, hogy a leftNav mindig tömb legyen
  const navArray = Array.isArray(leftNav) ? leftNav : [leftNav];

  // Minden menüpontra (NavLink) ráteszünk egy onClick eseményt, hogy ha kattintottak zárja be
  const LeftNav = navArray.map((node, idx) => {
    if (isValidElement(node)) {
      return cloneElement(node as ReactElement<any>, {
        key: node.key || `nav-item-${idx}`,
        onClick: () => {
          // Ha az eredeti komponensnek (NavLink) van saját onClick-je, azt is meghívjuk
          const originalOnClick = (node.props as any).onClick;
          if (originalOnClick) originalOnClick();
          
          setMenuOpen(false);
        },
      });
    }
    return node;
  });

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100 font-sans">
      {/* Háttérkép + sötétítés */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/images/background3.png"
          alt="Background"
          className="h-full w-full object-cover blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Tartalom eltolása, ha a mobil menü nyitva van */}
      <div
        className={`transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-[-16rem]' : 'translate-x-0'
        }`}
      >
        <div className="w-full antialiased flex flex-col items-center min-h-screen">
          
          {/* FEJLÉC (Header) */}
          <header className="relative z-30 mt-3 w-full sm:w-[95%] lg:w-[97%] rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex flex-col sm:flex-row sm:items-center py-1 px-3 sm:px-5 lg:px-7 gap-4">
            
            {/* Logó komponens */}
            <Logo />

            {/* ASZTALI MENÜ — Csak nagy képernyőn (lg) látszik */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <ul className="flex items-center space-x-6 text-lg lg:text-xl font-semibold text-white/90 transition-colors pointer-events-auto">
                {/* Itt az eredeti nav elemeket használjuk */}
                {leftNav}
              </ul>
            </div>

            {/* JOBB OLDALI ELEMEK (Nyelvváltó) */}
            <nav className="hidden lg:flex items-center justify-end flex-1">
              {rightNav && <ul className="flex items-center space-x-4 text-lg lg:text-xl">{rightNav}</ul>}
            </nav>

            {/* HAMBURGER GOMB (Csak mobilon látszik) */}
            <button
              type="button"
              className="absolute right-4 top-4 lg:hidden p-2"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </header>

          {/* FŐ TARTALOM */}
          <main className="mt-6 w-full max-w-full sm:w-[98%] lg:w-[97%] rounded-2xl bg-white/10 backdrop-blur-lg p-2 sm:p-6 shadow-lg border border-white/20 flex-grow">
            {children}
          </main>

          {/* LÁBLÉC */}
          <Footer />

        </div>
      </div>

      {/* MOBIL MENÜ (Fiók) */}
      <MobileMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        footer={rightNav}
      >
        {/* Itt adjuk át az "okosított" linkeket, amik kattintásra zárnak */}
        {LeftNav}
      </MobileMenu>

    </div>
  );
}