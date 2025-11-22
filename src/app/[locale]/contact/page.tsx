import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '../../../frontend/components/contactForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Page({ params }: Props) {
  setRequestLocale((await params).locale);
  return <ContactForm />;
}
