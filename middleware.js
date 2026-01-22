import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
