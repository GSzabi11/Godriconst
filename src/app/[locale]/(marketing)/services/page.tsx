import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Services',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function ServicesPage() {
  const t = useTranslations('Services');

  const services = [
    'Vopsitorie lavabila si tapet',
    'Placari gips- carton si structuri gips- carton.',
    'Montaj gresie si faianta.',
    'Turnari sape de nivel si autonivelante.',
    'Montaj parchet laminat si stratificat.',
    'Executie instalatii sanitare si termice.',
    'Executie instalatii electrice.',
    'Executam hidroizolatii si termoizolatii.',
    'Amenajări interioare şi exterioare.',
  ];

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative flex h-80 items-center justify-center bg-[url('/assets/images/first_landing.jpg')] bg-cover bg-center">
        <h1 className="bg-black bg-opacity-60 p-4 text-3xl text-white md:text-4xl">
          {t('heading')}
        </h1>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <p className="mb-6 text-lg">{t('paragraph')}</p>
        <ul className="list-disc space-y-2 pl-5">
          {services.map(service => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <h2 className="mb-10 text-3xl md:text-4xl">Some photos</h2>
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          {['bar.jpg', 'bathroom.jpg', 'garden.jpg'].map(img => (
            <Image
              key={img}
              src={`/assets/images/${img}`}
              alt="Service"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full flex-1 rounded"
              loading="lazy"
              draggable={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
