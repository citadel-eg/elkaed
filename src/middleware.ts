import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { unsealData } from 'iron-session';
import type { AdminSessionData } from '@/types/auth';
import { ADMIN_COOKIE_NAME, sessionOptions } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow unauthenticated access to /admin/login and /admin/logout
    if (pathname === '/admin/login' || pathname === '/admin/logout') {
      return NextResponse.next();
    }

    const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    let isLoggedIn = false;
    if (cookieValue) {
      try {
        const session = await unsealData<AdminSessionData>(cookieValue, {
          password: sessionOptions.password,
        });
        isLoggedIn = Boolean(session?.isLoggedIn);
      } catch {
        // Invalid or corrupted session cookie
        isLoggedIn = false;
      }
    }

    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
