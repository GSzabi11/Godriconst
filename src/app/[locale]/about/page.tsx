import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AboutPage from '../../../frontend/templates/AboutPage';

// A paraméter típus, amely tartalmazza a nyelvi kódot ígéreti formában
type Props = {
  // A Next által biztosított params Promise a locale értékkel
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Lekérjük a fordításokat az About oldal metaadataihoz
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'About',
  });

  return {
    // Az oldal címe a fordítások alapján
    title: t('meta_title'),
    // Meta leírás az About oldalhoz
    description: t('meta_description'),
  };
}

export default async function About({ params }: Props) {
  // A kérés nyelvi környezetének beállítása
  setRequestLocale((await params).locale);
  // Az About oldal komponens megjelenítése
  return <AboutPage />;
}