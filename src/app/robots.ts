import type { MetadataRoute } from 'next';

// Robots.txt konfiguráció összeállítása
export default function robots(): MetadataRoute.Robots {
  // Alap URL a generált linkekhez
  const baseUrl = 'https://godri-ro.com';

  return {
    // Feltérképezési szabályok meghatározása
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/',
      },
    ],
    // Hivatkozás a sitemap fájlra
    sitemap: `${baseUrl}/sitemap.xml`,
    // A host megadása
    host: baseUrl,
  };
}