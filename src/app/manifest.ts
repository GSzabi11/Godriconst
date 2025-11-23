import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Godri Const',
    short_name: 'Godri Const',
    description: 'Professional Construction Services / Servicii Profesionale de Construcții',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/assets/images/logo7uj.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/assets/images/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}