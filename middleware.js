import { NextResponse } from "next/server";

const ROLE_ROUTES = {
  user: [
    "/dashboard/my-appointment",
    "/dashboard/book-history",
    "/dashboard/payment-history",
    "/dashboard/user",
  ],
  specialist: ["/dashboard/specialist"],
  agency: ["/dashboard/agency"],
  care_institutions: ["/dashboard/care-institution"],
};

function matchRoute(pathname, routes) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function middleware(req) {
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }


  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;


  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const allowedRoutes = ROLE_ROUTES[role];

  
  if (!allowedRoutes) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  const isAllowed = matchRoute(pathname, allowedRoutes);
  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
