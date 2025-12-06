'use client';

import { ReactNode } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // A menüpontok (NavLink-ek)
  footer?: ReactNode;  // A nyelvváltó vagy egyéb elemek alul
};

export const MobileMenu = ({ isOpen, onClose, children, footer }: Props) => {
  return (
    <>
      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-white/10 backdrop-blur-md border-l border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-4 text-white">
          <button
            type="button"
            className="mb-6 self-end p-2"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-4 text-lg">
              {children}
            </ul>
          </nav>

          {footer && <div className="mt-auto"><ul className="space-y-4">{footer}</ul></div>}
        </div>
      </div>

      {/* Háttér overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
          onClick={onClose}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
        />
      )}
    </>
  );
};