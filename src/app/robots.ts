import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://godri-ro.com'; 
  
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