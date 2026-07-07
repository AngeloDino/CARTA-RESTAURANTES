import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (path === "/menu" || path.startsWith("/menu/")) {
          if (path.split("/").length === 3) return true;
          return !!token;
        }

        if (
          path.startsWith("/login") ||
          path.startsWith("/api/auth") ||
          path.startsWith("/_next") ||
          path === "/favicon.ico"
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|icons|sw.js).*)",
  ],
};
