import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/', 
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl, 
  };
}
