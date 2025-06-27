'use client';

import React from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  width?: number;
};

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  width = 1200,
}: Props) {
  return (
    <div
      className="mx-auto my-8"
      style={{
        width: `100%`,
        maxWidth: `${width}px`, // maximális szélesség
        height: `auto`,
        position: 'relative', // biztos, hogy a belső wrapper jól pozícionálódjon
        overflow: 'hidden', // nehogy kilógjanak a fotók
      }}
    >
      <ReactBeforeSliderComponent
        firstImage={{ imageUrl: beforeSrc, alt: beforeAlt }}
        secondImage={{ imageUrl: afterSrc, alt: afterAlt }}
      />
    </div>
  );
}
