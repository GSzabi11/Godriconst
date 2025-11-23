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
    <div className="bg-[#f5f2ef] font-sans text-[#1c1c1c]">
      {/* Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/videos/intro_video.mp4"
          poster="/assets/images/first_landing.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/70" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-5xl text-center text-white bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
              Godri SRL
            </h1>
            <p className="text-lg md:text-2xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto">
              {t('meta_description')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[#1c1c1c] font-semibold shadow-lg shadow-black/20 hover:-translate-y-[2px] hover:shadow-xl transition"
              >
                {t('services_button')}
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-white font-semibold hover:bg-white/10 hover:-translate-y-[2px] transition"
              >
                {t('gallery_button')}
              </Link>
            </div>
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

      {/* About + Before/After */}
      <section className="flex flex-col md:flex-row items-start bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-[8%] py-16 gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#6b5b53]">{t('about_parag')}</p>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              {t('slideing_photo')}
            </h2>
            <div className="text-lg text-[#3a2f2a] leading-relaxed space-y-3">
              {t('paragraph')
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean)
                .map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
            </div>
          </div>
          <Link
            href="/services"
            className="inline-flex w-max items-center gap-2 rounded-full bg-[#1c1c1c] px-6 py-3 text-white shadow-lg shadow-[#1c1c1c]/20 hover:bg-[#111] transition"
          >
            {t('renovations_button')}
          </Link>
        </div>

        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-[#1c1c1c]/10 border border-white/60">
            <BeforeAfter
              beforeSrc="/assets/images/after2.jpg"
              afterSrc="/assets/images/before2.jpg"
              beforeAlt="Before renovation"
              afterAlt="After renovation"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#f6f0ec] px-[8%] py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold">{t('services_button')}</h2>
          <Link
            href="/services"
            className="inline-flex items-center rounded-full border border-[#1c1c1c] px-5 py-2 font-semibold hover:bg-[#1c1c1c] hover:text-white transition"
          >
            {t('renovations_button')}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              src: '/assets/images/interior.jpg',
              title: t('interior_renovation'),
              desc: t('interios_desc'),
            },
            {
              src: '/assets/images/bathroom.jpg',
              title: t('bathroom_renovation'),
              desc: t('bathroom_desc'),
            },
            {
              src: '/assets/images/garden.jpg',
              title: t('garden_renovation'),
              desc: t('garden_desc'),
            },
          ].map(card => (
            <div
              key={card.title}
              className="group rounded-3xl bg-white p-5 shadow-lg shadow-[#1c1c1c]/10 border border-white/60 hover:-translate-y-[4px] transition"
            >
              <div className="overflow-hidden rounded-2xl mb-4">
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1f1f1f]">{card.title}</h3>
              <p className="text-base text-[#534941] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After highlight */}
      <section className="bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-[8%] py-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#6b5b53]">{t('slideing_photo')}</p>
            <Link
              href="/gallery"
              className="inline-flex items-center rounded-full bg-[#1c1c1c] text-white px-6 py-3 font-semibold hover:bg-[#111] transition"
            >
              {t('gallery_button')}
            </Link>
          </div>
          <p className="flex-1 text-lg text-[#3a2f2a] leading-relaxed">
            {t('befor_after_desc')}
          </p>
        </div>

        <div className="w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden bg-white shadow-xl shadow-[#1c1c1c]/10 border border-white/60">
          <BeforeAfter
            beforeSrc="/assets/images/after_csur.jpg"
            afterSrc="/assets/images/before_csur.jpg"
            beforeAlt="Before renovation"
            afterAlt="After renovation"
            width={1400}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f6f0ec] px-[8%] py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '/assets/icons/house.png', end: 250, label: t('home_fin') },
            { icon: '/assets/icons/roof.png', end: 113, label: t('roof_fin') },
            { icon: '/assets/icons/church.png', end: 12, label: t('church_fin') },
            { icon: '/assets/icons/worker.png', end: 7, label: t('workers') },
          ].map(item => (
            <div
              key={item.label}
              className="stat rounded-3xl bg-white p-5 shadow-lg shadow-[#1c1c1c]/10 border border-white/60 flex items-center gap-4"
            >
              <img src={item.icon} alt="Icon" className="h-12 w-12" loading="lazy" draggable={false} />
              <div>
                <CounterOnVisible end={item.end} />
                <p className="text-[#3a2f2a]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-[8%] py-16">
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#1c1c1c]/10 border border-white/60">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro"
            width="100%"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
