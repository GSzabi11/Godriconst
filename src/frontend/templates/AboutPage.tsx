'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MapEmbed } from '../components/MapEmbed';
import { PageHero } from '@/frontend/components/PageHero';
import { ValueCard } from '@/frontend/components/ValueCard';

// A bemutatkozó oldal
// Minden szakasz animációt kap a framer-motionnel, hogy a megjelenés dinamikus legyen.
export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <main className="bg-[#f5f2ef] text-[#1c1c1c] font-sans">
      {/* Hero */}
      <PageHero title={t('About_us')} subtitle={t('About_tagline')}>
        <div className="h-1 w-16 bg-white rounded-full opacity-80" />
      </PageHero>

      {/* Mission & Vision */}
      <section className="relative px-6 py-20 md:px-[8%] bg-gradient-to-b from-[#f6f0ec] via-[#efe6e0] to-[#e2d7cf] overflow-hidden">
        <div className="absolute left-[4%] top-10 h-24 w-24 rounded-full bg-[#c5b3a8]/30 blur-3xl" />
        <div className="absolute right-[10%] bottom-12 h-32 w-32 rounded-full bg-[#1c1c1c]/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b5b53] font-bold">{t('meta_title')}</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#2c2420]">{t('mission_title')}</h2>
            <p className="text-lg text-[#4a3e38] leading-relaxed">{t('mission_text')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-white/50 via-white/20 to-transparent blur-3xl rounded-[2rem]" />
            <img
              src="/assets/images/gerenda.jpg"
              alt={t('image_alt')}
              loading="lazy"
              className="relative w-full rounded-[2rem] shadow-2xl shadow-[#1c1c1c]/15 border border-white/60"
            />
          </motion.div>
        </div>
      </section>

      {/* Vállalati értékek ikonokkal és rövid leírással */}
      <section className="px-6 py-20 md:px-[8%] bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12 space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-[#6b5b53] font-bold">{t('values_title')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c2420]">{t('values_title')}</h2>
          <p className="text-lg text-[#4a3e38] max-w-3xl mx-auto">{t('mission_text')}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Briefcase size={28} />, title: t('value1_title'), desc: t('value1_desc') },
            { icon: <Building2 size={28} />, title: t('value2_title'), desc: t('value2_desc') },
            { icon: <Users size={28} />, title: t('value3_title'), desc: t('value3_desc') },
            { icon: <Star size={28} />, title: t('value4_title'), desc: t('value4_desc') },
          ].map((item, index) => (
            <ValueCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              delay={index * 0.12}
            />
          ))}
        </div>
      </section>

      {/* Térkép szekció, ahol könnyen megtalálható a vállalkozás */}
      <section className="px-6 md:px-[8%] py-24 flex flex-col justify-center min-h-[60vh]">
        <div className="max-w-6xl mx-auto space-y-8 text-center w-full">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c2420]">{t('find_us')}</h2>
            <p className="text-lg text-[#4a3e38] max-w-3xl mx-auto">{t('mission_text')}</p>
          </div>

          <MapEmbed />
        </div>
      </section>
    </main>
  );
}