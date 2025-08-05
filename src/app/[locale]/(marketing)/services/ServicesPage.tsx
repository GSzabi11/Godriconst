'use client';

import { motion } from 'framer-motion';
import { Droplet, Flame, Hammer, Home, Paintbrush, Plug, Ruler, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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
    <div className="bg-[#d8cdcd] text-[#1c1c1c] font-sans">
      {/* Hero */}
      <section
        className="relative flex items-center justify-center h-[70vh] bg-gray-900"
      >
        <div className="absolute inset-0">
          <img
            src="/assets/images/first_landing.jpg"
            alt="Gallery Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl px-6 py-12 rounded-2xl shadow-xl backdrop-blur-md bg-white/10 border border-white/20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide drop-shadow  font-light tracking-widest uppercase">
            {t('heading')}
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl opacity-90 font-extralight tracking-wide italic">
            {t('subheading')}
          </p>

          <div className="mt-6 h-1 w-16 mx-auto bg-white rounded-full opacity-80" />
        </motion.div>
      </section>

      {/* Szolgáltatások */}
      <section className="py-20 px-6 md:px-[10%] bg-[#e6dddd]">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">{t('title')}</h2>
        <h2 className="text-3xl md:text-lg font-semibold text-center mb-12">{t('paragraph')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#f0eeea] p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4 text-[#1c1c1c]">{serviceIcons[index]}</div>
              <h2 className="text-xl font-medium">{service}</h2>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Képgaléria */}
      <section className="bg-[#d8cdcd] px-6 md:px-[10%] py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">{t('referenes')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['table.jpg', 'bathroom.jpg', 'garden.jpg'].map(img => (
            <Link href="/gallery" key={img}>
              <motion.img
                src={`/assets/images/${img}`}
                alt="Gallery Image"
                loading="lazy"
                className="w-full h-72 object-cover rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
