import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServicesClient from './ServicesPage';

type ServicesProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: ServicesProps) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Services',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ServicesPage({ params }: ServicesProps) {
  setRequestLocale(params.locale);
  return <ServicesClient />;
}
