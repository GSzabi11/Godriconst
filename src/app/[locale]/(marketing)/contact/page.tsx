import { getTranslations } from 'next-intl/server';

import ContactForm from './contactForm';

type IIndexProps = {
  params: { locale: string };
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

// A Page komponensnek nincs szüksége a params destruktúrálására, mert a ContactForm kliens-oldalon kezeli a i18n-t.
export default function Page() {
  return <ContactForm />;
}
