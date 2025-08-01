import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServicesClient from './ServicesPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'Services',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ServicesPage({ params }: Props) {
  setRequestLocale((await params).locale);
  return <ServicesClient />;
}
