'use client';

import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// Számláló komponens, amely csak akkor kezdi el az animációt, amikor a felhasználó látóterébe kerül.
//Megadjuk a végső értéket és az animáció időtartalmát.
type CounterProps = {
  end: number;
  duration?: number;
};

// Komponensfüggvény, amely csak akkor indítja el a számláló animációt, ha a blokk legalább félig látható a viewportban.
export default function CounterOnVisible({ end, duration = 2 }: CounterProps) {
  // Hook, amely jelzi, hogy az elem látható-e, és referenciát ad a megfigyeléshez.
  const { ref, inView } = useInView({
    // Csak egyszer indítsa el az animációt.
    triggerOnce: true,
    // Akkor váltson láthatóra, ha legalább a felét látjuk.
    threshold: 0.5,
  });

  return (
    <div ref={ref}>
      {/* Ha az elem látható, elindítjuk a CountUp animációt, különben nullát mutatunk. */}
      {inView ? <CountUp end={end} duration={duration} /> : 0}
    </div>
  );
}