'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

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
      {/* Animált fejléc szekció */}
      <section className="relative flex items-center justify-center h-[70vh] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="/assets/images/first_landing.jpg"
            alt="Services Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl px-6 py-12 rounded-2xl shadow-xl backdrop-blur-md bg-white/10 border border-white/20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide drop-shadow font-light tracking-widest uppercase">
            {t('heading')}
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl opacity-90 font-extralight tracking-wide italic">
            {t('paragraph')}
          </p>
          <div className="mt-6 h-1 w-16 mx-auto bg-white rounded-full opacity-80" />
        </motion.div>
      </section>

      {/* Szolgáltatás lista */}
      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <ul className="list-disc space-y-2 pl-5 text-lg">
          {services.map(service => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Képek */}
      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <h2 className="mb-10 text-3xl md:text-4xl">Some photos</h2>
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          {['table.jpg', 'bathroom.jpg', 'garden.jpg'].map(img => (
            <img
              key={img}
              src={`/assets/images/${img}`}
              alt="Service"
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
