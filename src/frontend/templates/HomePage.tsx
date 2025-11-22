'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import BeforeAfter from '@/frontend/components/BeforeAfter';
import CounterOnVisible from '@/frontend/components/CounterOnVisible';
import 'react-before-after-slider-component/dist/build.css';

export default function HomePage() {
  const t = useTranslations('Index');

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/videos/intro_video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center px-4 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            // 👇 ITT A MÓDOSÍTÁS: Szürke háttér, padding, lekerekítés és homályosítás
            className="max-w-4xl text-center text-white bg-gray-900/60 backdrop-blur-xs p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase mb-6 drop-shadow-lg">
              Godri SRL
            </h1>
            <p className="text-xl md:text-2xl font-light italic tracking-wide opacity-90 max-w-2xl mx-auto">
              {t('meta_description')}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white"
        >
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      <section className="flex flex-col md:flex-row items-start bg-[#d8cdcd] px-[10%] py-16 gap-10">
        {/* Bal oldal: szöveg */}
        <div className="flex-1 flex flex-col justify-between order-1 md:order-none">
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

          {/* Gomb átmozgatva a kép után mobilon */}

          <Link href="/services" className="mt-6 inline-block w-max rounded bg-[#1c1c1c] px-6 py-3 text-white">
            {t('renovations_button')}
          </Link>

        </div>

        {/* Jobb oldal: kép */}
        <div className="h-full mt-10 w-full max-w-md flex-1 md:ml-10 md:mt-0
          draggable={false}"
        >
          <BeforeAfter
            beforeSrc="/assets/images/after2.jpg"
            afterSrc="/assets/images/before2.jpg"
            beforeAlt="Before renovation"
            afterAlt="After renovation"
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
        <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl leading-tight">{t('slideing_photo')}</h2>
            <div className="text-lg pt-20">
              <Link
                href="/gallery"
                className="mt-4 inline-block bg-[#1c1c1c] text-white px-6 py-3 rounded hover:bg-gray-800 transition"
              >
                {t('gallery_button')}
              </Link>
            </div>
          </div>
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
            <CounterOnVisible end={250} />
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
            <CounterOnVisible end={12} />
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
      {/* A többi tartalom mehet ide változatlanul (BeforeAfter, Counter stb.) */
      }
    </div>
  )
    ;
}
