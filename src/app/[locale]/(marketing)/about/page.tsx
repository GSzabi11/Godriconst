import { getTranslations, setRequestLocale } from 'next-intl/server';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function About(props: IAboutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative flex h-64 items-center justify-center bg-[url('/assets/images/logo_bg.jpg')] bg-cover bg-center">
        <div className="bg-black bg-opacity-60 p-8">
          <h1 className="text-3xl text-white md:text-4xl">{t('About_us')}</h1>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-10">
        <p className="text-lg">
          Our company has over 15 years of experience in architectural design
          and construction. We strive to create modern, functional and aesthetic
          spaces for our clients.
        </p>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-10">
        <img
          src="/assets/images/gerenda.jpg"
          alt="Our team at work"
          className="mx-auto w-full max-w-3xl rounded"
          loading="lazy"
          draggable={false}
        />
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-10">
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro"
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
};
