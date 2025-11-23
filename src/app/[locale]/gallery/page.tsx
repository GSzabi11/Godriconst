// app/[locale]/(marketing)/gallery/page.tsx

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import GalleryClient from '../../../frontend/templates/GalleryPage';

// A paraméterek típusa, amely tartalmazza az aktuális nyelvet
type Props = {
  // Promise alapú params objektum a locale mezővel
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fordítások lekérése a galéria oldal metaadataihoz
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Gallery',
  });

  return {
    // Oldalcím beállítása a fordítás szerint
    title: t('meta_title'),
    // Meta leírása támogatásához
    description: t('meta_description'),
  };
}

export default async function Page({ params }: Props) {
  // A kérés nyelvének beállítása
  setRequestLocale((await params).locale);
  // A galéria oldal sablon komponens renderelése
  return <GalleryClient />;
}