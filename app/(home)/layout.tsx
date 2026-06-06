import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GoFish.Life — Free Scripture-Based Prayer Responses',
  description:
    'Share your prayer concern and receive a relevant Bible verse, faithful interpretation, practical guidance, and a personalized prayer. Free, private, always available.',
  openGraph: {
    title: 'GoFish.Life — Free Scripture-Based Prayer Responses',
    description:
      "Bring your concern and receive hope from God's Word.",
    url: 'https://gofish.life',
    type: 'website',
  },
  alternates: {
    canonical: 'https://gofish.life',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
