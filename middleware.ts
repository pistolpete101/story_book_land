import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Test mode - allow access without authentication
const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Public routes that don't require authentication
const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/auth'];

export default async function middleware(request: NextRequest) {
  // In test mode, allow all requests
  if (TEST_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If no token and trying to access protected route, redirect to sign-in
  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
