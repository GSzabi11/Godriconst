import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/"
              className="relative border-none text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gray-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                  <path d="M9 21V12h6v9" />
                </svg>
                {t('home_link')}
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/about/"
              className="relative border-none text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gray-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8h.01M11 12h2v4h-2z" fill="#fff" />
                </svg>
                {t('about_link')}
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/contact/"
              className="relative border-none text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gray-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M2 4h20v16H2z" />
                  <path d="M2 4l10 8 10-8" />
                </svg>
                {t('contact_link')}
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/services/"
              className="relative border-none text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gray-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                {t('services_link')}
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/gallery/"
              className="relative border-none text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gray-300 after:transition-all after:duration-300 hover:after:w-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                {t('gallery_link')}
              </span>
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <li>
          <LocaleSwitcher />
        </li>
      )}
    >
      <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
    </BaseTemplate>
  );
}
