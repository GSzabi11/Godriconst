import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/', // vagy bármelyik admin/internal rész
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl, // opcionális, de ajánlott
  };
}
