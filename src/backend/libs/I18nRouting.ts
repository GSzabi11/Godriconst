import { defineRouting } from 'next-intl/routing';
import { AppConfig } from '@/backend/utils/AppConfig';

// Az alkalmazás elérhető lokalizációit és alapértelmezett beállításait definiáljuk.
// A konfigurációt a központi AppConfig adja meg, így az útválasztás és a nyelvválasztás összhangban marad.
export const routing = defineRouting({
  // A támogatott nyelvek listájának átadása az útválasztónak.
  locales: AppConfig.locales,
  // A nyelvi prefix szabály beállítása.
  localePrefix: AppConfig.localePrefix,
  // Alapértelmezett lokalizáció kijelölése.
  defaultLocale: AppConfig.defaultLocale,
});