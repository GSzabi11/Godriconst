import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServicesClient from '../../../frontend/templates/ServicesPage';

// A paramétertípus, amely a nyelvi kódot hordozza Promise-ben
type Props = {
  // A Next-től érkező params objektum a locale mezővel
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Lekérjük a fordításokat a szolgáltatások oldal metaadataihoz
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Services',
  });

  return {
    // Az oldal címe a fordításból
    title: t('meta_title'),
    // Meta leírás a SEO támogatásához
    description: t('meta_description'),
  };
}

export default async function ServicesPage({ params }: Props) {
  // Beállítjuk a kérést az aktuális nyelvre
  setRequestLocale((await params).locale);
  // Rendereljük a szolgáltatások kliensoldali sablonját
  return <ServicesClient />;
}