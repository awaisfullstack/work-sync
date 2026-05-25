// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";

const protectedRoutes = [
  "/dashboard",
  "/projects",
  "/tasks",
  "/shifts",
  "/users",
  "/departments",
  "/activity-logs",
];

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/shifts/:path*",
    "/users/:path*",
    "/departments/:path*",
    "/activity-logs/:path*",
    "/login",
    "/register",
  ],
};