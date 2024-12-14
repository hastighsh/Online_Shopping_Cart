import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request) {
    const adminOnlyPath = '/admin';
    const token = request.cookies.get('token');

    console.log('Request Path:', request.nextUrl.pathname);
    console.log('Token:', token);

    try {
        if (!token) {
            console.log('No token found. Redirecting...');
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }

        const decoded = verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        // if the user is not an admin, redirect to the homepage - this is not working :(
        if (!decoded.isAdmin && request.nextUrl.pathname.startsWith(adminOnlyPath)) {
            console.log('User is not an admin. Redirecting to /catalog...');
            const catalogUrl = request.nextUrl.clone();
            catalogUrl.pathname = '/catalog';
            return NextResponse.redirect(catalogUrl);
        }

        // if the user is an admin, allow access
        console.log('Admin access granted.');
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware Error:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/admin/:path*', '/admin'],
};
