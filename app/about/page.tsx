import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateOrganizationSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

export const metadata: Metadata = {
  title: 'About — GoFish.Life',
  description:
    'GoFish.Life provides free, AI-assisted prayer support grounded in Scripture. Learn about our mission, how the platform works, and our commitment to privacy.',
  openGraph: {
    title: 'About GoFish.Life — Our Mission',
    description:
      'Free, AI-assisted prayer support grounded in Scripture. Learn about our mission and commitment to privacy.',
    url: 'https://gofish.life/about',
  },
  alternates: {
    canonical: 'https://gofish.life/about',
  },
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'About', url: 'https://gofish.life/about' },
  ]);

  const howToSchema = generateHowToSchema({
    name: 'How to Get a Scripture-Based Prayer on GoFish.Life',
    description:
      'Share a prayer concern and receive a personalized Bible verse, interpretation, guidance, and prayer.',
    steps: [
      {
        name: 'Share your prayer concern',
        text: 'Type anything on your heart — a worry, a question, a situation you are facing.',
      },
      {
        name: 'Receive a Scripture-based response',
        text: 'Our AI selects a relevant Bible verse using the YouVersion Platform and generates a faithful interpretation, practical guidance, and a personalized prayer grounded in Scripture.',
      },
      {
        name: 'Read, save, and return',
        text: 'You receive encouragement you can read, save, and return to whenever you need it.',
      },
    ],
  });

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            wrapInGraph([
              generateOrganizationSchema(),
              breadcrumbSchema,
              howToSchema,
            ]),
          ),
        }}
      />
      <SiteHeader />

      <nav
        aria-label="Breadcrumb"
        className="text-[0.82rem] text-[var(--ink-subtle)] mt-4 mb-6"
      >
        <Link
          href="/"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>About</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        About GoFish.Life
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        Scripture-based prayer responses for everyday life. Free, private, and
        always available.
      </p>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">Our Mission</h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish.Life exists to make Scripture-based spiritual encouragement
          accessible to everyone. Whether you&apos;re facing anxiety, seeking
          guidance for your marriage, grieving a loss, or simply looking for a
          verse to anchor your day, GoFish meets you where you are with
          personalized, Bible-grounded prayer responses.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">How It Works</h2>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 p-0 list-none grid gap-3">
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">1.</span>
            <span>
              You share a prayer concern in your own words&mdash;anything on your
              heart.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">2.</span>
            <span>
              Our AI selects a relevant Bible verse using the YouVersion Platform
              and generates a faithful interpretation, practical guidance, and a
              personalized prayer grounded in Scripture.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">3.</span>
            <span>
              You receive encouragement you can read, save, and return to
              whenever you need it.
            </span>
          </li>
        </ul>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Privacy &amp; Trust
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-3">
          Your prayer requests are personal. We take that seriously:
        </p>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-1">
          <li>Prayer requests are processed ephemerally and are not stored unless you choose to save them</li>
          <li>Saved prayer history is encrypted at rest</li>
          <li>No prayer data is sold or shared with third parties</li>
          <li>No account is required to use the prayer tool</li>
        </ul>
        <p className="text-[var(--ink-subtle)] text-[0.85rem] mt-3 mb-0">
          Read our full{' '}
          <Link
            href="/privacy"
            className="text-oceanblue hover:text-seateal transition-colors"
          >
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            href="/transparency"
            className="text-oceanblue hover:text-seateal transition-colors"
          >
            Transparency
          </Link>{' '}
          page for more details.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Always Free
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          The core prayer experience on GoFish.Life will always be free. We
          believe access to Scripture-based encouragement should never be gated
          by a paywall.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Important Note
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish.Life is a tool for spiritual encouragement, not a substitute
          for pastoral care, professional counseling, or emergency services. If
          you are in crisis, please contact the{' '}
          <a
            href="https://988lifeline.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-oceanblue hover:text-seateal transition-colors"
          >
            988 Suicide &amp; Crisis Lifeline
          </a>{' '}
          (call or text 988).
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
