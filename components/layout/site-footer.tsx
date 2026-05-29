import Link from 'next/link';

const linkClass =
  'text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors';

export default function SiteFooter() {
  return (
    <footer className="mt-16 pt-10 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
      <div className="grid grid-cols-3 gap-8 max-[520px]:grid-cols-1 max-[520px]:gap-6">
        {/* Column 1: Brand */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            GoFish.Life
          </h4>
          <p className="m-0 leading-relaxed text-[var(--ink-subtle)]">
            Scripture-based prayer responses for everyday life. Free, private, and always available.
          </p>
        </div>

        {/* Column 2: Resources */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            Resources
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                Terms
              </Link>
            </li>
            <li>
              <Link href="/transparency" className={linkClass}>
                Transparency
              </Link>
            </li>
            <li>
              <Link href="/data-deletion" className={linkClass}>
                Data Deletion
              </Link>
            </li>
            <li>
              <Link href="/feedback" className={linkClass}>
                Feedback
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Connect */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            Connect
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li>
              <a
                href="https://www.facebook.com/gofishlife"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-8 pt-5 border-t border-[var(--border)] text-center">
        <p className="m-0 mb-2 text-[0.8rem]">
          Responses are generated with care and are not a substitute for pastoral
          care or professional help.
        </p>
        <p className="m-0 text-[0.75rem] text-[var(--ink-subtle)]">
          &copy; 2024&ndash;2026 GoFish.Life
        </p>
      </div>
    </footer>
  );
}
