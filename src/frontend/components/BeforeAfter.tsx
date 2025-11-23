'use client';

import dynamic from 'next/dynamic';
import 'react-before-after-slider-component/dist/build.css';

// Dinamikus import SSR nélkül
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

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
}: Props) {
  return (
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
