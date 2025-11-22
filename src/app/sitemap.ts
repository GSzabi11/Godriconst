import { MetadataRoute } from 'next';
import { routing } from '@/backend/libs/I18nRouting';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://godri-ro.com'; 
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/services'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

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

  return sitemapEntries;
}