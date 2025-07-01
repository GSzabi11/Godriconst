import type { LocalizationResource } from '@clerk/types';
import { enUS, roRO } from '@clerk/localizations';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Nextjs Starter',
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed', // fontos!
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  ro: roRO,
};

export const ClerkLocalizations = {
  defaultLocale: roRO,
  supportedLocales,
};
