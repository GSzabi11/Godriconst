import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, roRO } from '@clerk/localizations';

// Meghatározzuk, mikor használjon a rendszer nyelvi prefixet az útvonalakban (csak ha szükséges).
const localePrefix: LocalePrefixMode = 'as-needed';

// Alap konfiguráció az alkalmazáshoz: név, támogatott nyelvek és lokalizációs beállítások.
export const AppConfig = {
  // Az alkalmazás megjelenő neve (pl. meta adatokban vagy láblécben).
  name: 'Godri Srl',
  // A támogatott nyelvi kódok listája.
  locales: ['ro', 'en'],
  // Az alapértelmezett nyelvi kód, amely akkor lép életbe, ha nincs explicit locale.
  defaultLocale: 'ro',
  localePrefix,
};

// Az előkészített lokalizációs erőforrások (kulcs-érték páros az elérhető nyelvekkel).
const supportedLocales: Record<string, LocalizationResource> = {
  // Angol lokalizációs csomag hozzárendelése.
  en: enUS,
  // Román lokalizációs csomag hozzárendelése.
  ro: roRO,
};

// A defaultLocale határozza meg, hogy a bejelentkezési felület milyen nyelven jelenik meg, ha nincs választott nyelv.
export const ClerkLocalizations = {
  // Alapértelmezett nyelv komponensek számára.
  defaultLocale: roRO,
  supportedLocales,
};