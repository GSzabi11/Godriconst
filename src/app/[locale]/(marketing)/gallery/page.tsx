import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Gallery',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function GalleryPage() {
  const t = useTranslations('Gallery');

  const galleryGroups = [
    {
      title: t('interior_renovation'),
      images: ['/assets/images/bar.jpg', '/assets/images/table.jpg', '/assets/images/gerenda.jpg'],
    },
    {
      title: t('bathroom_renovation'),
      images: [
        '/assets/images/bathroom.jpg',
        '/assets/images/before_csur.jpg',
        '/assets/images/after_csur.jpg',
      ],
    },
    {
      title: t('garden_renovation'),
      images: ['/assets/images/garden.jpg', '/assets/images/first_landing.jpg'],
    },
  ];

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative flex h-64 items-center bg-[url('/assets/images/first_landing.jpg')] bg-cover bg-center pl-[5%]">
        <div className="max-w-xl bg-black bg-opacity-60 p-10">
          <h1 className="text-4xl leading-tight text-white md:text-5xl">
            {t('heading')}
          </h1>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <p className="mb-8 text-lg">{t('paragraph')}</p>
        <div className="space-y-12">
          {galleryGroups.map(group => (
            <div key={group.title}>
              <h2 className="mb-4 text-2xl md:text-3xl">{group.title}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {group.images.map(src => (
                  <img
                    key={src}
                    src={src}
                    alt={group.title}
                    className="w-full rounded shadow"
                    loading="lazy"
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
