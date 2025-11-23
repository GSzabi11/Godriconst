import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Inicializáljuk a nyelvi plugint a helyes útvonallal
const withNextIntl = createNextIntlPlugin('./src/backend/libs/I18n.ts');

const nextConfig: NextConfig = {
  // Kikapcsolja a "X-Powered-By: Next.js" fejlécet (biztonsági best practice)
  poweredByHeader: false,
  
  // Szigorú React mód (ajánlott)
  reactStrictMode: true,

  // Eslint beállítások
  eslint: {
    dirs: ['.'],
  },

  // Képek konfigurációja (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

// Csak a nyelvi plugint fűzzük hozzá a konfigurációhoz
export default withNextIntl(nextConfig);