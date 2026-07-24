import { MetadataRoute } from 'next';
import { siteConfig } from '../lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'polotno',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f5',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
