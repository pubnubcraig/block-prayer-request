import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

const faqs = [
  {
    question: 'What is GoFish.Life?',
    answer:
      'GoFish.Life is a free, AI-assisted prayer tool that provides Scripture-based responses to your prayer requests. You share a concern, and GoFish selects a relevant Bible verse, provides a faithful interpretation, offers practical guidance, and generates a personalized prayer grounded in Scripture.',
  },
  {
    question: 'Is GoFish.Life free to use?',
    answer:
      'Yes, GoFish.Life is completely free. The core prayer experience will always be free. No account is required to submit a prayer request and receive a response.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account is needed to use the prayer tool. However, creating a free account lets you save your prayer history, set a preferred Bible version, and personalize your experience.',
  },
  {
    question: 'How does GoFish select Bible verses?',
    answer:
      'GoFish uses AI to analyze your prayer concern and match it with a relevant Bible verse from the YouVersion Platform. The verse is selected based on the themes, emotions, and topics in your request.',
  },
  {
    question: 'What Bible version does GoFish use?',
    answer:
      'By default, GoFish uses the NIV (New International Version). If you create an account, you can choose from multiple Bible versions including ESV, KJV, NLT, and others in your profile settings.',
  },
  {
    question: 'Is my prayer request private?',
    answer:
      'Yes. Prayer requests are processed ephemerally and are not stored on our servers unless you explicitly choose to save them to your prayer history. Saved prayers are encrypted at rest. We never sell or share prayer data with third parties.',
  },
  {
    question: 'Can I save my prayer responses?',
    answer:
      'Yes. Create a free account to save your prayer history. You can revisit past prayers, view them in different layouts, and delete them at any time.',
  },
  {
    question: 'Is GoFish.Life affiliated with a specific church or denomination?',
    answer:
      'No. GoFish.Life is a non-denominational platform. The prayer responses are grounded in Scripture and aim to be faithful to the Bible without promoting a specific denominational perspective.',
  },
  {
    question: 'Can GoFish replace pastoral care or professional counseling?',
    answer:
      'No. GoFish.Life is a tool for spiritual encouragement, not a substitute for pastoral care, professional counseling, or emergency services. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline (call or text 988).',
  },
  {
    question: 'How does the AI work?',
    answer:
      'GoFish uses AI language models to understand your prayer concern, select a relevant Bible verse, and generate a faithful interpretation and prayer. The AI is guided by Scripture and designed to provide biblically grounded responses.',
  },
  {
    question: 'Is GoFish.Life safe for children?',
    answer:
      'GoFish.Life is designed to be a safe, family-friendly platform. Content moderation is in place to ensure responses remain appropriate. However, we recommend parental supervision for children using any online service.',
  },
  {
    question: 'How can I delete my data?',
    answer:
      'You can delete individual prayer history entries from your history page. To delete your entire account and all associated data, visit the Data Deletion page in the footer for instructions.',
  },
  {
    question: 'How can I give feedback or report an issue?',
    answer:
      'Visit the Feedback page (linked in the footer) to submit feedback, report a bug, or suggest a feature. Your feedback helps us improve the platform.',
  },
  {
    question: 'What prayer topics does GoFish cover?',
    answer:
      'GoFish covers over 100 prayer topics across 15 categories including Comfort, Peace, Hope, Faith, Strength, Wisdom, Forgiveness, Family, Health, Praise, Community, Service, Provision, Patience, Protection, Relationships, Purpose, and Guidance. You can also submit any prayer concern in your own words.',
  },
  {
    question: 'Does GoFish.Life work on mobile devices?',
    answer:
      'Yes. GoFish.Life is fully responsive and works on smartphones, tablets, and desktop computers. You can access it from any modern web browser.',
  },
];

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — GoFish.Life',
  description:
    'Common questions about GoFish.Life: how it works, privacy, Bible versions, account features, and more.',
  openGraph: {
    title: 'Frequently Asked Questions — GoFish.Life',
    description:
      'Common questions about GoFish.Life: how it works, privacy, Bible versions, account features, and more.',
    url: 'https://gofish.life/faq',
  },
  alternates: {
    canonical: 'https://gofish.life/faq',
  },
};

export default function FAQPage() {
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'FAQ', url: 'https://gofish.life/faq' },
  ]);

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wrapInGraph([faqSchema, breadcrumbSchema])),
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
        <span>FAQ</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        Frequently Asked Questions
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        Everything you need to know about GoFish.Life.
      </p>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <section key={faq.question} className="card">
            <h2 className="text-[1rem] font-bold mb-2 tracking-tight">
              {faq.question}
            </h2>
            <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
              {faq.answer}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-10 text-center">
        <p className="text-[var(--ink-muted)] text-[0.95rem] mb-4">
          Have another question?
        </p>
        <Link
          href="/feedback"
          className="inline-block px-6 py-3 rounded-lg bg-seateal text-white font-semibold no-underline hover:opacity-90 transition-opacity"
        >
          Send Us Feedback
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
