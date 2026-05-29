import { PrayerResult, escapeHtml } from '@/lib/types';

export default function ResultsSection({ result }: { result: PrayerResult | null }) {
  if (!result) return null;

  return (
    <>
      <section id="results" className="mt-8" aria-live="polite">
        <div className="flex items-end justify-between gap-4 mb-4 max-[520px]:flex-col max-[520px]:items-start">
          <h2 className="font-serif text-[1.65rem] m-0 tracking-tight">
            Your response
          </h2>
          <p className="m-0 text-[0.88rem] text-[var(--ink-subtle)]">
            Generated from Scripture and pastoral care principles
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          {/* Scripture card */}
          <article className="card col-span-2 max-[900px]:col-span-1">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Scripture
            </div>
            <p className="font-serif font-semibold text-[1.35rem] mb-3">
              <a
                href={escapeHtml(result.verse_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-seateal no-underline border-b border-seateal/35 hover:text-oceanblue hover:border-oceanblue transition-colors"
              >
                {result.bible_verse}
              </a>
              {result.bible_version_used && (
                <span className="text-[0.78rem] font-sans font-normal text-[var(--ink-subtle)] ml-2">
                  ({result.bible_version_used})
                </span>
              )}
            </p>
            {result.bible_version_fallback && result.bible_version_used && (
              <p className="text-[0.82rem] text-[var(--ink-subtle)] mt-1 mb-0 italic">
                {result.bible_version_used} was used because the requested version is not currently available through YouVersion.
              </p>
            )}
            <blockquote className="verse-text">
              {result.verse_content}
            </blockquote>
            {result.verse_copyright?.trim() && (
              <p className="mt-4 text-[0.78rem] leading-snug text-[var(--ink-subtle)]">
                {result.verse_copyright}
              </p>
            )}
          </article>

          {/* Interpretation card */}
          <article className="card">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Interpretation
            </div>
            <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
              {result.verse_interpretation}
            </div>
          </article>

          {/* Guidance card */}
          <article className="card">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Practical guidance
            </div>
            <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
              {result.advice}
            </div>
          </article>

          {/* Prayer card */}
          <article className="card card-prayer col-span-2 max-[900px]:col-span-1">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Prayer
            </div>
            <div className="whitespace-pre-wrap text-[var(--ink)] text-base">
              {result.prayer}
            </div>
          </article>
        </div>
      </section>

      {/* Scripture attribution */}
      <div className="mt-10 pt-6 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
        <div className="grid gap-4 max-w-[42rem] mx-auto">
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-1">
              Scripture
            </p>
            <p className="m-0 leading-relaxed">
              Bible text and verse links are provided through the{' '}
              <a
                href="https://platform.youversion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
              >
                YouVersion Platform
              </a>{' '}
              SDK (
              <code className="font-mono text-[0.88em] text-seateal">
                @youversion/platform-core
              </code>
              ). Translation copyright notices appear with each response when
              supplied by YouVersion. Read passages on{' '}
              <a
                href="https://www.bible.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
              >
                Bible.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
