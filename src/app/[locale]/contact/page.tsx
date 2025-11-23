import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '../../../frontend/components/contactForm';

// Paraméter típus a locale mezővel
type Props = {
  // A Next által biztosított Promise, amely a nyelvi kódot tartalmazza
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  // Fordítások lekérése a Contact névtérből metaadatokhoz
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Contact',
  });

  return {
    // Oldalcím beállítása fordítás alapján
    title: t('meta_title'),
    // Meta leírás a kapcsolat oldalhoz
    description: t('meta_description'),
  };
}

export default async function Page({ params }: Props) {
  // A kérést az aktuális nyelvre állítjuk
  setRequestLocale((await params).locale);
  // A kapcsolatfelvételi űrlap kirenderelése
  return <ContactForm />;
}