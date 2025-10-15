import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                       req.nextUrl.pathname.startsWith("/register");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/favorites");

    // If user is authenticated and trying to access auth pages, redirect to favorites
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/favorites", req.url));
    }

    // If user is not authenticated and trying to access protected pages, redirect to login
    if (isProtectedPage && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: ["/favorites/:path*", "/login", "/register"],
};
