import { getTranslations, setRequestLocale } from 'next-intl/server';
import BeforeAfter from '@/components/BeforeAfter';
import CounterOnVisible from '@/components/CounterOnVisible';
import 'react-before-after-slider-component/dist/build.css';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section
        className="relative  h-[80vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: 'url(\'/assets/images/first_landing.jpg\')' }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-start pl-[5%]">
          <div className="max-w-3xl text-white space-y-6 backdrop-blur-sm bg-black/40 p-10 rounded-xl">
            <h1 className="text-5xl md:text-6xl font-light tracking-widest uppercase">
              Godri SRL
            </h1>
            <p className="text-xl italic tracking-wide opacity-90">
              {t('meta_description')}
            </p>
            <a
              href="/services"
              className="inline-block mt-4 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition"
            >
              {t('renovations_button')}
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start bg-[#d8cdcd] px-[10%] py-16 md:flex-row md:gap-10">
        {/* Bal oldal: szöveg és gomb */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="mb-5 text-3xl md:text-4xl">{t('about_parag')}</h2>
            <div className="text-lg">
              {t('paragraph')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line !== '')
                .map((line, idx) => (
                  <p key={idx} className="mb-3 text-lg">
                    {line}
                  </p>
                ))}
            </div>
          </div>

          <a
            href="/services"
            className="mt-6 inline-block w-max rounded bg-[#1c1c1c] px-6 py-3 text-white"
          >
            {t('renovations_button')}
          </a>
        </div>

        <div className="flex-1 h-full mt-10 w-full max-w-md flex-1 md:ml-10 md:mt-0">
          <BeforeAfter
            beforeSrc="/assets/images/after2.jpg"
            afterSrc="/assets/images/before2.jpg"
            beforeAlt="Before renovation"
            afterAlt="After renovation"
            width={600}
          />
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <h2 className="mb-10 text-3xl md:text-4xl">{t('services_button')}</h2>
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="flex-1 rounded bg-white p-5 text-left">
            <img
              src="/assets/images/interior.jpg"
              alt="Kitchen Remodel"
              className="mb-5 w-full rounded"
              loading="lazy"
              draggable={false}
            />
            <h3 className="mb-2 text-xl">{t('interior_renovation')}</h3>
            <p className="text-base">{t('interios_desc')}</p>
          </div>
          <div className="flex-1 rounded bg-white p-5 text-left">
            <img
              src="/assets/images/bathroom.jpg"
              alt="Bathroom Renovation"
              className="mb-5 w-full rounded"
              loading="lazy"
              draggable={false}
            />
            <h3 className="mb-2 text-xl">{t('bathroom_renovation')}</h3>
            <p className="text-base">{t('bathroom_desc')}</p>
          </div>
          <div className="flex-1 rounded bg-white p-5 text-left">
            <img
              src="/assets/images/garden.jpg"
              alt="Living Room Makeover"
              className="mb-5 w-full rounded"
              loading="lazy"
              draggable={false}
            />
            <h3 className="mb-2 text-xl">{t('garden_renovation')}</h3>
            <p className="text-base">{t('garden_desc')}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-3xl md:text-4xl leading-tight">{t('slideing_photo')}</h2>
          <p className="max-w-md text-lg pt-5 md:pt-6">{t('befor_after_desc')}</p>
        </div>

        <div className="w-full max-w-[1600px] mx-auto">
          <BeforeAfter
            beforeSrc="/assets/images/after_csur.jpg"
            afterSrc="/assets/images/before_csur.jpg"
            beforeAlt="Before renovation"
            afterAlt="After renovation"
            width={1600}
          />
        </div>
      </section>

      <section className="stats-wrapper bg-gray-200 px-[10%] py-16">
        <div className="stat">
          <img
            src="/assets/icons/house.png"
            alt="Icon"
            loading="lazy"
            draggable={false}
          />
          <div>
            <CounterOnVisible end={175} />
            <p>{t('home_fin')}</p>
          </div>
        </div>
        <div className="stat">
          <img
            src="/assets/icons/roof.png"
            alt="Icon"
            loading="lazy"
            draggable={false}
          />
          <div>
            <CounterOnVisible end={113} />
            <p>{t('roof_fin')}</p>
          </div>
        </div>
        <div className="stat">
          <img
            src="/assets/icons/church.png"
            alt="Icon"
            loading="lazy"
            draggable={false}
          />
          <div>
            <CounterOnVisible end={48} />
            <p>{t('church_fin')}</p>
          </div>
        </div>
        <div className="stat">
          <img
            src="/assets/icons/worker.png"
            alt="Icon"
            loading="lazy"
            draggable={false}
          />
          <div>
            <CounterOnVisible end={7} />
            <p>{t('workers')}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
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
