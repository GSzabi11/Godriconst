import { getTranslations } from 'next-intl/server';
import ContactForm from './contactForm';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Page() {
  return <ContactForm />;
}
