import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/members/new') || 
    pathname.startsWith('/events/new') || 
    pathname.startsWith('/groups/new') || 
    pathname.startsWith('/donations/new') || 
    pathname.startsWith('/announcements/new') || 
    pathname.startsWith('/attendance/new') || 
    pathname.startsWith('/notifications');
  
  // Check if the path is an API route
  const isApiRoute = pathname.startsWith('/api');
  
  // Skip middleware for non-protected routes and API routes
  if (!isProtectedRoute && !isApiRoute) {
    return NextResponse.next();
  }
  
  // For API routes, we'll check the token but handle auth in the API route itself
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  // Get the token
  const token = await getToken({ req: request });
  
  // If there's no token and it's a protected route, redirect to sign in
  if (!token && isProtectedRoute) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // If there's a token, check role-based access
  if (token) {
    const userRole = token.role as string;
    
    // Admin-only routes
    const isAdminRoute = 
      pathname.startsWith('/notifications') || 
      pathname.startsWith('/dashboard');
    
    // Leader and above routes
    const isLeaderRoute = 
      pathname.startsWith('/members/new') || 
      pathname.startsWith('/groups/new');
    
    // Check permissions
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (isLeaderRoute && !['admin', 'pastor', 'leader'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
