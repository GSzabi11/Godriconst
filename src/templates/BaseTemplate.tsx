// import { useTranslations } from 'next-intl';
'use client';

import { useState } from 'react';

type BaseTemplateProps = {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
};

export function BaseTemplate({
  leftNav,
  rightNav,
  children,
}: BaseTemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerWidth = 64; // Tailwind w-64 → 16rem
  // const t = useTranslations('BaseTemplate');

  return (
    <div className="relative overflow-hidden">
      {/* OLDALTARTALOM, ami csúszik */}
      <div
        className={`
          transition-transform duration-300 ease-in-out
          ${menuOpen ? `-translate-x-${drawerWidth}` : 'translate-x-0'}
        `}
      >
        <div className="w-full px-1 text-gray-700 antialiased">
          <header className="site-header flex items-center py-4">
            <div className="logo">
              <img
                src="/assets/images/logo_uj.png"
                alt="Logo"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* A gomb most jobbra tolva */}
            <button
              type="button"
              className="ml-auto p-2 md:hidden"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              {/* hamburger / close ikon */}
              <svg
                className="size-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen
                  ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    )
                  : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
              </svg>
            </button>

            {/* nagyobb képernyőn sima nav */}
            <nav className="hidden md:ml-auto md:flex">
              <ul className="flex space-x-5 text-xl">{leftNav}</ul>
            </nav>

            <nav className="hidden md:flex">
              {rightNav && <ul className="flex space-x-5">{rightNav}</ul>}
            </nav>
          </header>

          <main className="px-4">{children}</main>

          <footer className="border-t border-gray-300 py-8 text-center text-sm">
            © Copyright
            {' '}
            {new Date().getFullYear()}
            .
            {' '}
            <a
              href="https://creativedesignsguru.com"
              className="text-blue-600 underline"
            >
              CreativeDesignsGuru
            </a>
            <span className="ml-10">Luni-Vineri: 8:00-17:00</span>
            <span className="ml-10">Tel: 0722971124</span>
          </footer>
        </div>
      </div>

      {/* OLDALMENÜ (drawer) */}
      <div
        className={`
          fixed right-0 top-0 z-50 h-full w-64 bg-white shadow-xl transition-transform
          duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col p-4">
          {/* menüben is legyen close gomb */}
          <button
            type="button"
            className="mb-6 self-end p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <svg
              className="size-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-4 text-lg">{leftNav}</ul>
          </nav>

          <div className="mt-auto">
            <ul className="space-y-4">{rightNav}</ul>
          </div>
        </div>
      </div>

      {/* Áttetsző háttér a drawer mögött (opcionális) */}
      {menuOpen && (
        <div
          role="button" // ✔ szerep megadása
          tabIndex={0} // ✔ fókuszálhatóvá tesszük
          aria-label="Close navigation" // ✔ hozzáadunk egy leíró címkét
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMenuOpen(false);
            }
          }} // ✔ billentyűzet-kezelés
        />
      )}
    </div>
  );
};
