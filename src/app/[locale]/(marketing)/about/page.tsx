import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AboutClient from './AboutClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function AboutPage({ params }: Props) {
  setRequestLocale((await params).locale);
  return <AboutClient />;
}
