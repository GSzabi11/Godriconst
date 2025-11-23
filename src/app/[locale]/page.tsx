import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePage from '@/frontend/templates/HomePage';

// A route paraméterek típusa, amely tartalmazza az aktuális nyelvi kódot
type IIndexProps = {
  // A Next.js által biztosított Promise alapú params objektum a nyelvi kóddal
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: IIndexProps) {
  // Lekérjük a fordításokat a kezdőoldalhoz az aktuális nyelvi kód alapján
  const t = await getTranslations({ locale: (await params).locale, namespace: 'Index' });

  return {
    // Oldalcím beállítása a fordítások alapján
    title: t('meta_title'),
    // Meta leírás beállítása a keresőoptimalizálás miatt
    description: t('meta_description'),
  };
}

export default async function Index({ params }: IIndexProps) {
  // Beállítjuk a kérést az aktuális nyelvre, hogy a fordítások működjenek
  setRequestLocale((await params).locale);
  // Rendereljük a kezdőoldal komponensét
  return <HomePage />;
}
