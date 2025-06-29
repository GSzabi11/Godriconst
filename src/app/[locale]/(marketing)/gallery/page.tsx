// app/[locale]/(marketing)/gallery/page.tsx

import { getTranslations } from 'next-intl/server';
import GalleryClient from './GalleryClient';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Gallery',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Page() {
  return <GalleryClient />;
}
