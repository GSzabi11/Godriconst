import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './I18nRouting';

// Ez a modul tölti be a lokalizációs üzeneteket és beállítja az aktuális nyelvet.

// Konfigurációs függvény, amely a kért locale alapján visszaadja a fordítási fájlokat és az aktuális nyelvi beállítást.
export default getRequestConfig(async ({ requestLocale }) => {
  // A kért locale általában a dinamikus `[locale]` útvonalrészhez tartozik.
  const requested = await requestLocale;
  // Ha a kért nyelv támogatott, azt használjuk, különben visszatérünk az alapértelmezett nyelvre.
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    // Az aktuális nyelvi kód, amelyet a rendszer használni fog.
    locale,
    // A kiválasztott nyelvhez tartozó fordítási fájl dinamikus importja.
    messages: (await import(`../../backend/i18n/locales/${locale}.json`)).default
  };
});