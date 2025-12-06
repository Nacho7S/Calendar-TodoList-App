// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/helper/jwt';

export async function middleware(request: NextRequest) {
  // Check if user is trying to access protected routes
  const protectedPaths = ['/home'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Check if user is trying to access public routes
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  let isAuthenticated = false;
  
  if (token) {
    try {
      await verifyToken(token);
      isAuthenticated = true;
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }


  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Redirect root path "/" to "/home" if user is authenticated
  if (request.nextUrl.pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // If user is on root path and not authenticated, redirect to login
  if (request.nextUrl.pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect unauthenticated users from protected routes to login
  
  // Redirect authenticated users from public routes (like login) to protected routes

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/login', '/register', '/'], // Updated matcher to include root path as well
};