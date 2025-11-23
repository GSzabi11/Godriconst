'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Fixen elhelyezett hívás gomb, amely mobilon közvetlenül telefonál, asztali nézetben pedig a kapcsolati oldalra visz.
// Komponensfüggvény, amely felismeri az eszköz típusát és ennek megfelelően kezeli a kattintásokat.
export const DemoBadge = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ellenőrizzük, hogy a kód a böngészőben fut-e, majd userAgent alapján mobil-e az eszköz.
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone/i.test(window.navigator.userAgent));
    }
  }, []);

  // Kattintáskezelő: asztali nézetben a kontakt oldalra navigál, mobilon hagyja a hívást.
  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      // Asztali nézetben megakadályozzuk a telefonhívás indítását.
      e.preventDefault();

      // Átvitel a /contact oldalra
      router.push('/contact');
    }
  };

  return (
    <>
      {/* Fixen a jobb alsó sarokban elhelyezett CTA gomb a gyors kapcsolatfelvételhez */}
      <div className="fixed bottom-0 right-20 z-10 cursor-pointer">
        <a
          href="tel:+36703251636"
          onClick={handleClick}
          className="rounded-md bg-gray-900 px-3 py-2 font-semibold text-gray-100"
        >
          {/* Felirat és hívható telefonszám megjelenítése */}
          <span className="text-[#d8cdcd]">Contact us</span>
          {' '}
          +36 70 325 1636
        </a>
      </div>
    </>
  );
};