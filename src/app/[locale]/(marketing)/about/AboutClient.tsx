'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutClient() {
  const t = useTranslations('About');

  return (
    <main className="bg-[#f8f6f5] text-[#1c1c1c] font-sans">
      {/* Hero szekció */}
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
            {t('About_us')}
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl opacity-90 font-extralight tracking-wide italic">
            {t('About_tagline')}
          </p>

          <div className="mt-6 h-1 w-16 mx-auto bg-white rounded-full opacity-80" />
        </motion.div>
      </section>

      {/* Küldetés és vízió */}
      <section className="py-20 px-6 md:px-[10%] bg-[#f1edeb]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">{t('mission_title')}</h2>
            <p className="text-lg leading-relaxed">{t('mission_text')}</p>
          </motion.div>

          <motion.img
            src="/assets/images/gerenda.jpg"
            alt={t('image_alt')}
            loading="lazy"
            className="rounded-xl shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </section>

      {/* Értékek ikonblokkok */}
      <section className="py-20 px-6 md:px-[10%] bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">{t('values_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: <Briefcase size={32} />, title: t('value1_title'), desc: t('value1_desc') },
            { icon: <Building2 size={32} />, title: t('value2_title'), desc: t('value2_desc') },
            { icon: <Users size={32} />, title: t('value3_title'), desc: t('value3_desc') },
            { icon: <Star size={32} />, title: t('value4_title'), desc: t('value4_desc') },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#f9f7f6] p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4 text-[#1c1c1c] flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Térkép / Elérhetőség */}
      <section className="bg-[#f3efef] px-6 md:px-[10%] py-20">
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-medium">
          {t('find_us')}
        </h2>
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro"
          width="100%"
          height="400"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow"
        />
      </section>
    </main>
  );
}
