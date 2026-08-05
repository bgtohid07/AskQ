import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(request: Request) {
  const url = new URL(request.url);
  const session = request.headers.get('cookie')?.includes('session=');

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged in users from seeing auth pages
  if (session && (url.pathname === '/login' || url.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
