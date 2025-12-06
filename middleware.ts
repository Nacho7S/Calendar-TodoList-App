import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/helper/jwt';

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/home'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  const token = request.cookies.get('auth-token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      await verifyToken(token);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }


  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }



  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (request.nextUrl.pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (request.nextUrl.pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/login', '/register', '/'],
};