'use client';

import { motion } from 'framer-motion';
import React from 'react';

type Props = {
  title: string;
  subtitle: string;
  bgImage?: string;       // Háttérkép (ha nincs videó)
  videoSrc?: string;      // Videó forrás (opcionális)
  videoPoster?: string;   // Videó borítókép (opcionális)
  showScrollArrow?: boolean; // Görgetés jelző nyíl (opcionális)
  children?: React.ReactNode;
};

export const PageHero = ({
  title,
  subtitle,
  bgImage = '/assets/images/first_landing.jpg',
  videoSrc,
  videoPoster,
  showScrollArrow = false,
  children,
}: Props) => {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Háttér kezelése: Videó vagy Kép */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={videoPoster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover scale-105"
          />
        )}
        {/* Sötétítés */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/70" />
      </div>

      {/* Tartalom */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl text-center text-white bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-2xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {children && (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {children}
            </div>
          )}
        </motion.div>
      </div>

      {/* Opcionális görgetés jelző nyíl */}
      {showScrollArrow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white"
        >
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      )}
    </section>
  );
};