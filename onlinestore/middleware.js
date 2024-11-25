//onlinestore/middleware.js

import { NextResponse } from 'next/server';
import { verifyToken } from '@/util/auth';

export function middleware(request) {
  try {
    // Get the token from the headers
    const token = request.headers.get('authorization')?.split(' ')[1];

    // If the token exists, verify it
    if (token) {
      const decoded = verifyToken(token);
      
      // Add user information to request headers
      request.headers.set('user', JSON.stringify(decoded));
    }
    
    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Redirect to login page if unauthorized or other error occurred
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which paths to run middleware for (only admin routes, for example)
export const config = {
  matcher: ['/admin/:path*'],
};