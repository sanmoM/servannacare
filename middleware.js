import useLocalUser from "@/hooks/useLocalUser";
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
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  const token = localStorage.getItem("token");
  const { user, loaded } = useLocalUser();

  if (!token || !user?.role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  s;
  const allowedRoutes = ROLE_ROUTES[role];

  if (!allowedRoutes) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  const isAllowed = matchRoute(pathname, allowedRoutes);
  if (!isAllowed) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
