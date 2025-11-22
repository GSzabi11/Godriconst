'use client';

import Link from 'next/link';
import { cloneElement, isValidElement, useState } from 'react';

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

  const enhancedLeftNav = Array.isArray(leftNav)
    ? leftNav.map((node, idx) => {
        if (isValidElement(node)) {
          return cloneElement(node as React.ReactElement<any>, {
            key: idx,
            onClick: () => setMenuOpen(false),
          });
        }
        return node;
      })
    : isValidElement(leftNav)
      ? cloneElement(leftNav as React.ReactElement<any>, {
          onClick: () => setMenuOpen(false),
        })
      : leftNav;

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100">
      {/* Háttérkép + overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/images/background3.png"
          alt="Background"
          className="h-full w-full object-cover blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Tartalom mozgatása drawer esetén */}
      <div
        className={`transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-[-16rem]' : 'translate-x-0'
        }`}
      >
        <div className="w-full antialiased flex flex-col items-center">
          {/* HEADER */}
          <header
            className="relative z-30 mt-3 w-full sm:w-[95%] lg:w-[97%] rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex flex-col sm:flex-row sm:items-center py-1 px-3 sm:px-5 lg:px-7 gap-4"
          >
            {/* LOGÓ */}
            <div className="w-full flex justify-center lg:justify-start items-center">
              <Link href="/" className="block" onClick={() => setMenuOpen(false)}>
                <img
                  src="/assets/images/logo.png"
                  alt="Logo"
                  className="h-24 w-auto lg:h-20"
                  loading="lazy"
                  draggable={false}
                />
              </Link>
            </div>

            {/* MENÜ — abszolút középre helyezve, de kattintható marad */}
            <div
              className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <ul className="flex items-center space-x-6 text-lg lg:text-xl font-semibold text-white/90 hover:[&>*]:text-white transition-colors pointer-events-auto">
                {leftNav}
              </ul>
            </div>

            {/* JOBB OLDALI NYELVVÁLTÓ */}
            <nav className="hidden lg:flex items-center justify-end flex-1">
              {rightNav && <ul className="flex items-center space-x-4 text-lg lg:text-xl">{rightNav}</ul>}
            </nav>

            {/* Hamburger menü gomb */}
            <button
              type="button"
              className="absolute right-4 top-4 lg:hidden"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen
                  ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )
                  : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
              </svg>
            </button>
          </header>

          {/* MAIN */}
          <main
            className="mt-6 w-full max-w-full sm:w-[98%] lg:w-[97%] rounded-2xl bg-white/10 backdrop-blur-lg p-2 sm:p-6 shadow-lg border border-white/20"
          >
            {children}
          </main>

          {/* FOOTER */}
          <footer className="w-full sm:w-[95%] lg:w-[96%] text-center text-sm text-gray-300 py-8">
            ©
            {' '}
            {new Date().getFullYear()}
            <span className="ml-6">Monday-Friday: 8:00–17:00</span>
            <span className="ml-6">Tel: 0036703251636</span>
          </footer>
        </div>
      </div>

      {/* DRAWER – Mobil */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-white/10 backdrop-blur-md border-l border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-4 text-white">
          <button
            type="button"
            className="mb-6 self-end p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-4 text-lg">{enhancedLeftNav}</ul>
          </nav>

          <div className="mt-auto">
            {rightNav && <ul className="space-y-4">{rightNav}</ul>}
          </div>
        </div>
      </div>

      {/* DRAWER háttér overlay */}
      {menuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMenuOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
