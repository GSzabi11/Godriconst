import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServicesClient from './ServicesPage';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Services',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ServicesPage({ params }: Props) {
  setRequestLocale(params.locale);
  return <ServicesClient />;
}
