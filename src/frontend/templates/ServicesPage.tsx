'use client';

import { motion } from 'framer-motion';
import { Droplet, Flame, Hammer, Home, Paintbrush, Plug, Ruler, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SectionTitle } from '@/frontend/components/SectionTitle';
import { PageHero } from '@/frontend/components/PageHero';

// Szolgáltatások oldal, amely bemutatja az elérhető munkákat és referenciára, kapcsolatfelvételre irányít.
// Az ikonlista és az animációk vizuálisan támogatják a tartalmat.
const serviceIcons = [
  // eslint-disable-next-line react/no-missing-key
  <Paintbrush size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Ruler size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Hammer size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Wrench size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Ruler size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Droplet size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Plug size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Flame size={32} />,
  // eslint-disable-next-line react/no-missing-key
  <Home size={32} />,
];

export default function ServicesPage() {
  const t = useTranslations('Services');
  const c = useTranslations('Contact');


  const services = [
    t('service1_title'),
    t('service2_title'),
    t('service3_title'),
    t('service4_title'),
    t('service5_title'),
    t('service6_title'),
    t('service7_title'),
    t('service8_title'),
    t('service9_title'),
  ];

  return (
    <div className="bg-gradient-to-b from-[#f7f2ed] via-[#eee6df] to-[#e4d9d3] text-[#1c1c1c] font-sans">
      {/* Hero szekció, amely kiemeli a szolgáltatásokat*/}
      <PageHero title={t('heading')} subtitle={t('subheading')}>
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[#1c1c1c] font-semibold shadow-lg shadow-black/20 hover:-translate-y-[2px] hover:shadow-xl transition"
        >
          {t('referenes')}
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-white font-semibold hover:bg-white/10 hover:-translate-y-[2px] transition"
        >
          {c('title')}
        </Link>
      </PageHero>


      {/* Rövid bevezető a szolgáltatásokról */}
      <section className="px-6 md:px-[10%] py-14">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
          <div className="space-y-5">
            <SectionTitle
              subtitle={t('title')}
              title={t('heading')}
            />
            <p className="text-lg text-[#3a2f2a] leading-relaxed">{t('paragraph')}</p>
          </div>

          <div className="rounded-3xl bg-white shadow-xl shadow-[#1c1c1c]/10 border border-white/60 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#1c1c1c] text-white flex items-center justify-center shadow-lg shadow-[#1c1c1c]/20">
                <Hammer size={24} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#6b5b53]">{t('title')}</p>
                <h3 className="text-xl font-semibold text-[#1c1c1c]">{t('heading')}</h3>
              </div>
            </div>
            <div className="space-y-3 text-[#3a2f2a] leading-relaxed">
              <p>{t('subheading')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Szolgáltatások rácsos listája ikonokkal és leírással */}
      <section className="px-6 md:px-[10%] pb-16">
        <div className="mb-8">
          <SectionTitle title={t('title')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white p-6 rounded-3xl shadow-lg shadow-[#1c1c1c]/10 border border-white/60 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#f3ede7] via-transparent to-[#e5dbd4]" />
              <div className="relative z-10 flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[#1c1c1c] text-white flex items-center justify-center shadow-md shadow-[#1c1c1c]/20">
                  {serviceIcons[index]}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6b5b53]">{t('title')}</p>
                  <h3 className="text-xl font-semibold text-[#1c1c1c]">{service}</h3>
                </div>
              </div>
              <p className="relative z-10 text-[#4a3c34] leading-relaxed text-base">
                {t('paragraph')}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galéria felé irányító blokk */}
      <section className="bg-gradient-to-br from-[#f8f3f1] to-[#e9e2dd] px-6 md:px-[10%] py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="space-y-3">
            <SectionTitle
              subtitle={t('referenes')}
              title={t('heading')}
            />
            <p className="text-lg text-[#3a2f2a] leading-relaxed max-w-2xl">{t('subheading')}</p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full bg-[#1c1c1c] text-white
             px-3 py-2 text-sm
             sm:px-4 sm:py-2.5
             md:px-6 md:py-3 md:text-base
             font-semibold shadow-lg shadow-[#1c1c1c]/20 hover:bg-[#111] transition
             w-auto"
          >
            {t('referenes')}
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['table.jpg', 'bathroom.jpg', 'garden.jpg'].map(img => (
            <Link href="/gallery" key={img} className="group block overflow-hidden rounded-3xl shadow-lg shadow-[#1c1c1c]/10 border border-white/60">
              <motion.img
                src={`/assets/images/${img}`}
                alt="Gallery Image"
                loading="lazy"
                className="w-full h-72 object-cover transition duration-500 group-hover:scale-105"
                whileHover={{ scale: 1.02 }}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}