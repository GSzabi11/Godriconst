'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Kapcsolatfelvételi űrlap, amely honeypot mezővel védi a spamet és API hívással küldi az üzenetet.
type ContactFormData = {
  name: string;
  email: string;
  message: string;
  trap?: string;
};

// Komponensfüggvény, amely az űrlap validálását, elküldését és az állapot visszajelzéseit kezeli.
export default function ContactForm() {
  // Fordítások lekérése a Contact kulcsból
  const t = useTranslations('Contact');
  const locale = useLocale();
  // Státuszkövetés: alap, küldés alatt, elküldve vagy hiba.
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // A react-hook-form kicsomagolása a regisztrációhoz és validációhoz.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: { name: '', email: '', message: '', trap: '' },
  });

  // Küldés: spam szűrés után meghívja a /api/contact végpontot és frissíti az állapotot.
  const onSubmit = async (data: ContactFormData) => {
    if (data.trap?.trim()) {
      setStatus('sent');
      reset();
      return;
    }

    setStatus('sending');
    try {
      // POST kérés a saját API-hoz az űrlapadatokkal.
      const res = await fetch(`/${locale}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('sent');
        reset();
      } else {
        throw new Error(await res.text());
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f7f2ed] via-[#eee6df] to-[#e4d9d3] text-[#1c1c1c] font-sans">
      {/* Hero szekció, amely kiemeli az elérhetőségi információkat */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/first_landing.jpg"
            alt="Contact Background"
            className="h-full w-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Wrapper */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-5xl text-center text-white bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto mb-8">
              {t('subheading')}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="tel:+36703251636"
                className="inline-flex items-center justify-center rounded-full bg-white 
                     px-6 py-3 md:px-8 md:py-4 
                     text-[#1c1c1c] font-bold shadow-lg shadow-black/20 
                     hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                +36 70 325 1636
              </a>
              <a
                href="mailto:godri04@gmail.com"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 
                     px-6 py-3 md:px-8 md:py-4 
                     text-white font-semibold backdrop-blur-sm 
                     hover:bg-white hover:text-[#1c1c1c] hover:-translate-y-1 transition-all duration-300"
              >
                godri04@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tartalom + űrlap szekció */}
      <section className="relative px-6 py-20 md:px-[8%] bg-gradient-to-b from-[#f6f0ec] via-[#efe6e0] to-[#e9dfd7]">
        <div className="absolute left-[5%] top-10 h-24 w-24 rounded-full bg-[#c5b3a8]/25 blur-3xl" />
        <div className="absolute right-[12%] bottom-10 h-32 w-32 rounded-full bg-[#1c1c1c]/6 blur-3xl" />

        <div className="relative grid gap-14 xl:grid-cols-[1.1fr_1fr] items-start max-w-7xl mx-auto">
          {/* Bal oldali komponensek: szöveg és elérhetőségek */}
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-[#6b5b53] font-bold">{t('meta_title')}</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#2c2420]">{t('form_title')}</h2>
              <p className="text-lg text-[#4a3e38] leading-relaxed max-w-2xl">{t('description')}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[{
                label: 'Phone',
                value: '+36 70 325 1636',
                href: 'tel:+36703251636',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                )
              }, {
                label: 'Email',
                value: 'godri04@gmail.com',
                href: 'mailto:godri04@gmail.com',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                )
              }].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex flex-col gap-4 rounded-2xl bg-white/90 backdrop-blur-xl p-6 shadow-md shadow-[#1c1c1c]/10 border border-white/70 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c1c1c] text-white group-hover:bg-[#4a3e38] transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6b5b53] font-bold mb-1">{item.label}</p>
                    <p className="text-lg font-semibold text-[#1c1c1c]">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Jobb oldali komponensek: maga az űrlap és visszajelzések */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-white/50 via-white/20 to-transparent blur-3xl rounded-[2rem]" />
            <div className="relative rounded-[2rem] bg-white/90 backdrop-blur-lg p-8 md:p-10 shadow-2xl shadow-[#1c1c1c]/15 border border-gray-100">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a3e38] uppercase tracking-wide" htmlFor="name">
                    {t('name_label')}
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base transition-all focus:border-[#1c1c1c] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1c1c1c]"
                    {...register('name', { required: true })}
                    required
                    placeholder={t('name_placeholder')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{t('name_required')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a3e38] uppercase tracking-wide" htmlFor="email">
                    {t('email_label')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base transition-all focus:border-[#1c1c1c] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1c1c1c]"
                    {...register('email', { required: true })}
                    required
                    placeholder={t('email_placeholder')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{t('email_required')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4a3e38] uppercase tracking-wide" htmlFor="message">
                    {t('message_label')}
                  </label>
                  <textarea
                    id="message"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base min-h-[160px] transition-all focus:border-[#1c1c1c] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1c1c1c] resize-y"
                    {...register('message')}
                    placeholder={t('message_placeholder')}
                  />
                </div>

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="trap">Do not fill</label>
                  <input
                    id="trap"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('trap')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-xl bg-[#1c1c1c] px-8 py-4 text-white font-bold text-lg shadow-lg shadow-[#1c1c1c]/25 hover:bg-[#000] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? t('sending') : t('send_message_button')}
                </button>

                {status === 'sent' && (
                  <div className="rounded-lg bg-green-50 p-4 text-center border border-green-100">
                    <p className="text-sm font-medium text-green-800">{t('email_sent')}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-center border border-red-100">
                    <p className="text-sm font-medium text-red-800">{t('email_error')}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Térkép szekció*/}
      <section className="w-full bg-[#f5f2ef] py-20 px-6 md:px-[8%] flex justify-center">
        <div className="w-full max-w-6xl rounded-[2rem] overflow-hidden shadow-2xl shadow-[#1c1c1c]/15 border border-white/60 bg-white">
          <div className="w-full h-[500px] bg-gray-200 relative  transition-all duration-700 ease-in-out">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </section>
    </div>
  );
}