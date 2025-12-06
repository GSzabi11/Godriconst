'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import BeforeAfter from '@/frontend/components/BeforeAfter';
import { MapEmbed } from '../components/MapEmbed';
import { SectionTitle } from '@/frontend/components/SectionTitle';
import { PageHero } from '../components/PageHero';
import { StatItem } from '@/frontend/components/StatItem';

// Kezdőlap, amely bemutatja a vállalkozást videós szekcióval, szolgáltatásokkal és statisztikákkal.
export default function HomePage() {
  const t = useTranslations('Index');

  return (
    <div className="bg-[#f5f2ef] font-sans text-[#1c1c1c]">
      {/* Videós hero, amely azonnal bemutatja a céget */}
      <PageHero
        title="Godri SRL"
        subtitle={t('meta_description')}
        videoSrc="/assets/videos/intro_video.mp4"
        videoPoster="/assets/images/first_landing.jpg"
        showScrollArrow={true}
      >
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
      </PageHero>

      {/* Bemutatkozó szekció before/after sliderrel kombinálva */}
      <section className="flex flex-col md:flex-row items-start bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-[8%] py-16 gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-4">
            <SectionTitle
              subtitle={t('about_parag')}
              title={t('slideing_photo')}
            />
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

      {/* Fő szolgáltatások kártyákban*/}
      <section className="bg-[#f6f0ec] px-[8%] py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <SectionTitle title={t('services_button')} className="mb-0" />
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

      {/* Kiemelt before/after blokk a galéria felé vezető gombal*/}
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

      {/* Statisztikák számláló animációkkal */}
      <section className="bg-[#f6f0ec] px-[8%] py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '/assets/icons/house.png', end: 250, label: t('home_fin') },
            { icon: '/assets/icons/roof.png', end: 113, label: t('roof_fin') },
            { icon: '/assets/icons/church.png', end: 12, label: t('church_fin') },
            { icon: '/assets/icons/worker.png', end: 7, label: t('workers') },
          ].map(item => (
            <StatItem
              key={item.label}
              icon={item.icon}
              end={item.end}
              label={item.label}
            />
          ))}
        </div>
      </section>

      {/* Térkép kiemelve a helységet */}
      <section className="bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-[8%] py-16">
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <MapEmbed />
      </section>
    </div>
  );
}
