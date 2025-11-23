'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, MouseEvent } from 'react';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';

export const DemoBadge = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone/i.test(window.navigator.userAgent));
    }
  }, []);

  // Mobil: hívás indul.
  // Desktop: nem hív, csak /contact oldalra navigál.
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile) {
      e.preventDefault();
      router.push('/contact');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-10 z-50">
      <a
        href="tel:+36703251636"
        onClick={handleClick}
        className="
          flex items-center justify-center
          h-14 w-14 rounded-full
          bg-gray-900/95
          text-xs font-semibold text-gray-50
          shadow-lg shadow-black/25
          backdrop-blur
          transition
          hover:bg-gray-800
          hover:shadow-xl
          active:scale-[0.97]
          md:h-auto md:w-auto
          md:px-5 md:py-3 md:gap-3
        "
      >
        {/* MUI telefon ikon – mobilon csak ez látszik, desktopon mellette szöveg is */}
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
          <LocalPhoneRoundedIcon fontSize="small" />
        </span>

        {/* Desktop szöveg – mobilon rejtve */}
        <div className="hidden md:flex flex-col leading-tight text-left">
          <span className="text-[0.65rem] md:text-xs uppercase tracking-wide text-gray-300">
            Contact us
          </span>
          <span className="text-xs md:text-sm font-semibold text-gray-50">
            +36 70 325 1636
          </span>
        </div>
      </a>
    </div>
  );
};
