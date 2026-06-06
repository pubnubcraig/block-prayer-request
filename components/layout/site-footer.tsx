import Link from 'next/link';

const linkClass =
  'text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors';

export default function SiteFooter() {
  return (
    <footer className="mt-16 pt-10 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
      <div className="grid grid-cols-4 gap-8 max-[720px]:grid-cols-2 max-[420px]:grid-cols-1 max-[420px]:gap-6">
        {/* Column 1: Brand */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            GoFish.Life
          </h4>
          <p className="m-0 leading-relaxed text-[var(--ink-subtle)]">
            Scripture-based prayer responses for everyday life. Free, private, and always available.
          </p>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            Explore
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><Link href="/prayers" className={linkClass}>Prayer Topics</Link></li>
            <li><Link href="/bible-verses" className={linkClass}>Bible Verses</Link></li>
            <li><Link href="/about" className={linkClass}>About</Link></li>
            <li><Link href="/about/statement-of-faith" className={linkClass}>Statement of Faith</Link></li>
            <li><Link href="/about/editorial-policy" className={linkClass}>Editorial Policy</Link></li>
            <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
            <li><Link href="/feedback" className={linkClass}>Feedback</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            Legal
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
            <li><Link href="/terms" className={linkClass}>Terms</Link></li>
            <li><Link href="/transparency" className={linkClass}>Transparency</Link></li>
            <li><Link href="/data-deletion" className={linkClass}>Data Deletion</Link></li>
            <li>
              <a href="https://gofishlife.instatus.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                System Status
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div>
          <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-2 mt-0">
            Connect
          </h4>
          <ul className="list-none m-0 p-0 grid gap-1.5">
            <li>
              <a href="https://www.facebook.com/gofishlife" target="_blank" rel="noopener noreferrer" className="text-oceanblue hover:text-seateal transition-colors flex items-center gap-2" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/gofishlife" target="_blank" rel="noopener noreferrer" className="text-oceanblue hover:text-seateal transition-colors flex items-center gap-2" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Popular topics row */}
      <div className="mt-8 pt-5 border-t border-[var(--border)]">
        <h4 className="text-[0.78rem] font-bold tracking-[0.06em] uppercase text-seateal mb-3 mt-0">
          Popular Topics
        </h4>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <Link href="/prayers/anxiety" className={linkClass}>Prayers for Anxiety</Link>
          <Link href="/bible-verses/healing" className={linkClass}>Verses About Healing</Link>
          <Link href="/prayers/marriage" className={linkClass}>Marriage Prayers</Link>
          <Link href="/bible-verses/strength" className={linkClass}>Verses About Strength</Link>
          <Link href="/prayers/peace" className={linkClass}>Prayers for Peace</Link>
          <Link href="/bible-verses/hope" className={linkClass}>Verses About Hope</Link>
          <Link href="/prayers/forgiveness" className={linkClass}>Prayers for Forgiveness</Link>
          <Link href="/bible-verses/faith" className={linkClass}>Verses About Faith</Link>
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
