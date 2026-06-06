import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

export const metadata: Metadata = {
  title: 'Editorial Policy — GoFish.Life',
  description:
    'How GoFish.Life generates Scripture-based prayer responses: our AI methodology, Scripture selection process, content standards, and commitment to transparency.',
  openGraph: {
    title: 'Editorial Policy — GoFish.Life',
    description:
      'How GoFish.Life generates Scripture-based prayer responses using AI grounded in biblical principles.',
    url: 'https://gofish.life/about/editorial-policy',
  },
  alternates: {
    canonical: 'https://gofish.life/about/editorial-policy',
  },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'About', url: 'https://gofish.life/about' },
    {
      name: 'Editorial Policy',
      url: 'https://gofish.life/about/editorial-policy',
    },
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
        <Link
          href="/about"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          About
        </Link>
        <span className="mx-2">/</span>
        <span>Editorial Policy</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        Editorial Policy
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        How GoFish.Life generates prayer responses and the standards we uphold.
      </p>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          AI-Assisted Response Generation
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish.Life uses AI language models to understand your prayer concern
          and generate a response. Each response includes a relevant Bible verse,
          a faithful interpretation, practical guidance, and a personalized
          prayer. The AI is guided by carefully designed prompts that prioritize
          biblical accuracy, pastoral sensitivity, and practical helpfulness.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Scripture Selection Process
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          Bible verses are selected using the YouVersion Platform based on the
          themes, emotions, and topics identified in your prayer request. The AI
          analyzes your concern and matches it with Scripture that speaks
          directly to your situation. Verses are drawn from a wide range of
          books across the Old and New Testaments to provide comprehensive
          biblical perspective.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Content Standards
        </h2>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-2">
          <li>
            All responses are grounded in Scripture and aim for faithfulness to
            the biblical text in its original context
          </li>
          <li>
            Interpretations are interdenominational and avoid promoting specific
            theological traditions
          </li>
          <li>
            Content moderation filters ensure responses are appropriate, safe,
            and family-friendly
          </li>
          <li>
            Crisis detection identifies requests that may indicate a user is in
            danger and provides appropriate resources
          </li>
          <li>
            Responses never claim to replace pastoral care, professional
            counseling, or medical advice
          </li>
        </ul>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Transparency &amp; Limitations
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-3">
          We are transparent about the role of AI in our platform:
        </p>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-2">
          <li>
            GoFish.Life is an AI-assisted tool, not a human counselor or pastor
          </li>
          <li>
            AI-generated responses may occasionally miss nuance or context that
            a human advisor would catch
          </li>
          <li>
            We continuously refine our prompts and models to improve the quality
            and faithfulness of responses
          </li>
          <li>
            Users are encouraged to verify interpretations with their own Bible
            study and trusted spiritual mentors
          </li>
        </ul>
        <p className="text-[var(--ink-subtle)] text-[0.85rem] mt-4 mb-0">
          For more details on how we handle your data, see our{' '}
          <Link
            href="/transparency"
            className="text-oceanblue hover:text-seateal transition-colors"
          >
            Transparency
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-oceanblue hover:text-seateal transition-colors"
          >
            Privacy Policy
          </Link>{' '}
          pages.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Topic Page Content
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          The prayer and Bible verse topic pages on GoFish.Life feature curated
          Scripture selections, sample prayers, and reflection prompts for over
          100 life situations. This content is reviewed for biblical accuracy and
          pastoral appropriateness. Each topic page includes a primary verse with
          context, additional supporting passages, and guidance for personal
          prayer.
        </p>
      </section>

      <p className="text-[0.9rem] text-[var(--ink-muted)]">
        <Link
          href="/about"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          &larr; Back to About
        </Link>
        <span className="mx-3">|</span>
        <Link
          href="/about/statement-of-faith"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Statement of Faith &rarr;
        </Link>
      </p>

      <SiteFooter />
    </div>
  );
}
