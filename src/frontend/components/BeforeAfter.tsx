'use client';

import dynamic from 'next/dynamic';
import 'react-before-after-slider-component/dist/build.css';

const ReactBeforeSliderComponent = dynamic(
  () => import('react-before-after-slider-component'),
  { ssr: false },
);

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  width?: number;
};

// Egyszerű wrapper a before/after sliderhez, amely átadja a képek forrását és alt szövegét.
// Komponensfüggvény, amely a dinamikus sliderhez illeszti a kapott képadatokat és méreteket.
export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
}: Props) {
  return (
      // A slider konténerének méretezése és elrejtett
    <div
      className="h-full w-full relative overflow-hidden"
    >
      <ReactBeforeSliderComponent
        firstImage={{ imageUrl: beforeSrc, alt: beforeAlt }}
        secondImage={{ imageUrl: afterSrc, alt: afterAlt }}
      />
    </div>
  );
}
