import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GoFish.Life — Scripture-Based Prayer Responses',
    short_name: 'GoFish',
    description:
      'Bring your concern and receive a Bible verse, faithful interpretation, practical guidance, and a prayer grounded in Scripture. Free, private, and always available.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D2B45',
    theme_color: '#0D2B45',
    icons: [
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
