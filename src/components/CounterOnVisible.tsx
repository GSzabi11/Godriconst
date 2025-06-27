'use client';

import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

type CounterProps = {
  end: number;
  duration?: number;
};

export default function CounterOnVisible({ end, duration = 2 }: CounterProps) {
  const { ref, inView } = useInView({
    triggerOnce: true, // csak egyszer indítsa el
    threshold: 0.5, // akkor indul, ha 50%-ban látható
  });

  return (
    <div ref={ref}>
      {inView ? <CountUp end={end} duration={duration} /> : 0}
    </div>
  );
}
