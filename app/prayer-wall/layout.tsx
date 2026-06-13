import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Share Wall — GoFish.Life',
  description:
    'A community prayer wall where believers lift each other up in prayer. Read and pray for shared prayer requests.',
  openGraph: {
    title: 'Prayer Share Wall — GoFish.Life',
    description:
      'Join a community lifting each other up in prayer.',
    url: 'https://gofish.life/prayer-wall',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gofish.life/prayer-wall',
  },
};

export default function PrayerWallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
