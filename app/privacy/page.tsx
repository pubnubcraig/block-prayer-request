import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

export const metadata = {
  title: 'Privacy Policy — GoFish',
  description: 'How GoFish handles your data, privacy, and security.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <SiteHeader />

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        Your privacy matters to us. Here&apos;s how GoFish handles your data.
      </p>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Prayer Requests
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          Prayer text is processed ephemerally. Your prayer request is sent to
          OpenAI for verse selection and response generation, then discarded.{' '}
          <strong>We do not store your prayer text.</strong> No prayer content
          is saved to any database, log file, or persistent storage.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Anonymous Analytics
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          We track anonymous, aggregated metrics only: prayer completion
          counts, Bible version selection, API response times, and error
          rates. No personally identifiable information is collected or stored
          as part of analytics.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Cookies &amp; Tracking
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish does not use tracking cookies, behavioral advertising, or
          personal ad targeting. No third-party analytics trackers are
          embedded on the site.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Content Moderation
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          Prayer requests are screened by the OpenAI Moderation API for safety
          (detecting self-harm, abuse, or harmful content). Moderation
          decisions are logged anonymously (category and action taken only)
          for platform safety monitoring. No prayer text is stored during
          moderation.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Third-Party Services
        </h2>
        <ul className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 pl-5 grid gap-2">
          <li>
            <strong>OpenAI:</strong> Processes prayer text for verse selection
            and response generation. Subject to{' '}
            <a
              href="https://openai.com/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
            >
              OpenAI&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>YouVersion:</strong> Provides Bible verse text and links.
            Subject to{' '}
            <a
              href="https://www.bible.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
            >
              YouVersion&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Vercel:</strong> Hosts the application. Subject to{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam"
            >
              Vercel&apos;s privacy policy
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          AI Disclaimer
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish provides AI-assisted spiritual encouragement and prayer
          support. Responses are not professional counseling, legal advice, or
          authoritative theological instruction.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Mental Health Disclaimer
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          GoFish is not a replacement for licensed mental health care,
          emergency services, or pastoral counseling. If you are in crisis,
          please contact the{' '}
          <strong>988 Suicide &amp; Crisis Lifeline</strong> (call or text
          988) or your local emergency services.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          Changes to This Policy
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0">
          This policy may be updated as features are added (such as donations
          or user accounts). Significant changes will be noted on this page.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
