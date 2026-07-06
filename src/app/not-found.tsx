import Link from "next/link";

/**
 * Trilingual 404 — the root not-found boundary cannot know the locale of an
 * unmatched URL, so it speaks all three languages and links to each homepage.
 */
export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf__card">
        <p className="nf__brand">DARSAN</p>
        <h1 className="nf__code">404</h1>
        <p className="nf__msg">
          Pagina nu a fost găsită. · Страница не найдена. · Page not found.
        </p>
        <div className="nf__links">
          <Link href="/" className="btn btn--brand">
            Pagina principală
          </Link>
          <Link href="/ru" className="nf__alt">
            Главная страница
          </Link>
          <Link href="/en" className="nf__alt">
            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
