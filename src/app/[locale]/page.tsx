import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePage from '@/frontend/templates/HomePage';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: IIndexProps) {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'Index' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index({ params }: IIndexProps) {
  setRequestLocale((await params).locale);
  return <HomePage />;
}
