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
                className="text-oceanblue hover:text-seateal transition-colors flex items-center gap-2"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
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
