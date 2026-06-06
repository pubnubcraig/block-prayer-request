import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

export const metadata: Metadata = {
  title: 'Transparency — GoFish.Life',
  description:
    'How GoFish.Life operates, our costs, and where revenue goes. Full transparency on our mission and finances.',
  openGraph: {
    title: 'Transparency — GoFish.Life',
    description: 'How GoFish.Life operates, our costs, and where revenue goes.',
    url: 'https://gofish.life/transparency',
  },
  alternates: {
    canonical: 'https://gofish.life/transparency',
  },
};

export default function TransparencyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Transparency', url: 'https://gofish.life/transparency' },
  ]);

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wrapInGraph([breadcrumbSchema])),
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
        <span>Transparency</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        Transparency
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        GoFish is committed to operating openly. Here&apos;s how the platform
        works and where resources go.
      </p>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">Our Mission</h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish provides free, AI-assisted prayer support grounded in
          Scripture. The core prayer experience will always be free. We aim to
          build a sustainable ministry platform through respectful
          monetization while maintaining emotional safety and spiritual trust.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          How It Works
        </h2>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 p-0 list-none grid gap-3">
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">1.</span>
            <span>
              You share a prayer concern. Our AI selects a relevant Bible verse
              using the YouVersion Platform SDK.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">2.</span>
            <span>
              The AI generates a faithful interpretation, practical guidance,
              and a short prayer grounded in the selected Scripture.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-seateal shrink-0">3.</span>
            <span>
              Your prayer text is processed ephemerally and is <strong>not stored</strong>.
            </span>
          </li>
        </ul>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Operating Costs
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-3">
          GoFish incurs costs for:
        </p>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-1">
          <li>OpenAI API usage (verse selection and response generation)</li>
          <li>Vercel hosting and serverless functions</li>
          <li>Infrastructure and maintenance</li>
        </ul>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Future Revenue Allocation
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-3">
          When donations and sponsorships launch:
        </p>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-1">
          <li>
            <strong>Donations:</strong> 50% to YouVersion, 50% to GoFish
            operations
          </li>
          <li>
            <strong>Sponsorships:</strong> 10% to YouVersion, remainder to
            GoFish operations
          </li>
        </ul>
        <p className="text-[var(--ink-subtle)] text-[0.85rem] mt-3 mb-0">
          Detailed financial reporting will be published monthly once these
          features are active.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          YouVersion Attribution
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish voluntarily donates a portion of revenue to support
          YouVersion&apos;s mission. This is a voluntary contribution and does
          not imply a formal partnership or endorsement by YouVersion or
          Life.Church.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
