import { NextResponse, type NextRequest } from "next/server";

/**
 * Tags each page request with its locale (ro at /, ru at /ru, en at /en) in an
 * `x-locale` request header, so the root layout can set the correct <html lang>
 * server-side. Reading it there makes rendering dynamic — the accepted trade-off
 * for a correct language attribute in the raw HTML.
 */
export function middleware(req: NextRequest) {
  const seg = req.nextUrl.pathname.split("/")[1];
  const locale = seg === "ru" || seg === "en" ? seg : "ro";

  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // All page routes (incl. district pages) — but not api, _next, or static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
