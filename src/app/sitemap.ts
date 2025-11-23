import { MetadataRoute } from 'next';
import { routing } from '@/backend/libs/I18nRouting';

// Dinamikusan generált sitemap bejegyzések
export default function sitemap(): MetadataRoute.Sitemap {
  // Az alkalmazás alap URL-je
  const baseUrl = 'https://godri-ro.com';

  // Azon útvonalak listája, amelyeket minden nyelvre felveszünk
  const routes = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/services'
  ];

  // Gyűjtő tömb a sitemap bejegyzésekhez
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Minden útvonalat és nyelvet kombinálunk
  routes.forEach(route => {
    routing.locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        priority: route === '' ? 1.0 : 0.8,
        changeFrequency: 'weekly',
      });
    });
  });

  // Visszatérés a generált sitemap elemekkel
  return sitemapEntries;
}