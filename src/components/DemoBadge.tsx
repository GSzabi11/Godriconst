'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const DemoBadge = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone/i.test(window.navigator.userAgent));
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault(); // ne indítsa el a tel: linket

      // Átvitel a /contact oldalra
      router.push('/contact');
    }
    // Mobilon hagyjuk a <a href="tel:..."> működni
  };

  return (
    <>
      <div className="fixed bottom-0 right-20 z-10 cursor-pointer">
        <a
          href="tel:+40123123456"
          onClick={handleClick}
          className="rounded-md bg-gray-900 px-3 py-2 font-semibold text-gray-100"
        >
          <span className="text-[#d8cdcd]">Contact us</span>
          {' '}
          +40 123 123 456
        </a>
      </div>
    </>
  );
};
