// middleware.js

import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|favicon.ico).*)",
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;

  // Get the hostname of the request (e.g., client1.localhost:3000)
  const hostname = req.headers.get("host");

  // Check if we are working with a subdomain
  let subdomain = null;
  if (hostname) {
    const parts = hostname.split(".");
    if (parts.length === 3) {
      subdomain = parts[0];
    } else if (parts.length === 2 && hostname.includes("localhost")) {
      subdomain = parts[0];
    }
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // If a subdomain exists, rewrite the request
  if (subdomain) {
    return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  // Default behavior for no subdomain
  return NextResponse.next();
}
