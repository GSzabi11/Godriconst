import { getTranslations, setRequestLocale } from 'next-intl/server';
import IndexClient from './IndexClient';

type IIndexProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: IIndexProps) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Index' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index({ params }: IIndexProps) {
  await setRequestLocale(params.locale);
  return <IndexClient />;
}
