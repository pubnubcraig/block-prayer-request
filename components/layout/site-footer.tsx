import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-10 pt-6 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
      <p className="text-center text-[0.8rem]">
        Responses are generated with care and are not a substitute for pastoral
        care or professional help.
      </p>
      <div className="flex justify-center gap-4 mt-3 text-[0.78rem]">
        <Link
          href="/transparency"
          className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
        >
          Transparency
        </Link>
        <Link
          href="/privacy"
          className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
        >
          Terms
        </Link>
        <Link
          href="/feedback"
          className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
        >
          Feedback
        </Link>
      </div>
    </footer>
  );
}
