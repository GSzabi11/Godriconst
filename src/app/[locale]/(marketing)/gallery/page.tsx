// app/[locale]/(marketing)/gallery/page.tsx

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import GalleryClient from './GalleryClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Gallery',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Page() {
  return <GalleryClient />;
}
