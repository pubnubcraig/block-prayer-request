import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

export const metadata: Metadata = {
  title: 'Data Deletion — GoFish.Life',
  description:
    'How to request deletion of your data from GoFish.Life. We respect your right to delete your account, prayer history, and preferences.',
  openGraph: {
    title: 'Data Deletion — GoFish.Life',
    description: 'How to request deletion of your data from GoFish.Life.',
    url: 'https://gofish.life/data-deletion',
  },
  alternates: {
    canonical: 'https://gofish.life/data-deletion',
  },
};

export default function DataDeletionPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Data Deletion', url: 'https://gofish.life/data-deletion' },
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
        <span>Data Deletion</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        Data Deletion
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        How to request the deletion of your data from GoFish.
      </p>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Your Right to Delete
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          You have the right to request the deletion of your personal data from
          GoFish at any time. This includes your account information, prayer
          request history, profile details, and any other data associated with
          your account.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          How to Request Deletion
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          To request deletion of your data, send an email to{' '}
          <a
            href="mailto:support@gofish.life"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
          >
            support@gofish.life
          </a>{' '}
          with the subject line &ldquo;Data Deletion Request.&rdquo; Please
          include the email address associated with your GoFish account so we
          can locate your data.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          What Gets Deleted
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          Upon processing your request, we will permanently delete the
          following: your account credentials, profile information (name,
          avatar, and preferences), prayer request history and saved responses,
          and any other personally identifiable data stored in our systems.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Processing Time
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          Data deletion requests are typically processed within 30 days. You
          will receive a confirmation email once your data has been
          permanently removed.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Facebook Login Users
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          If you signed in using Facebook, you can also remove GoFish&apos;s
          access to your Facebook data through your{' '}
          <a
            href="https://www.facebook.com/settings?tab=applications"
            target="_blank"
            rel="noopener noreferrer"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
          >
            Facebook App Settings
          </a>
          . Removing the app from Facebook will revoke GoFish&apos;s access
          but will not delete data already stored. To fully delete your data,
          please also submit a deletion request as described above.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Questions
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          If you have any questions about data deletion, please contact us at{' '}
          <a
            href="mailto:support@gofish.life"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
          >
            support@gofish.life
          </a>
          .
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
