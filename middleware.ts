import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdmin = token?.role === 'ADMIN'
        const path = req.nextUrl.pathname

        // Create response
        const response = NextResponse.next()

        // Add security headers
        const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

        // Content Security Policy
        const isDev = process.env.NODE_ENV === 'development'
        const cspHeader = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://checkout.paystack.com https://js.paystack.co https://widget.cloudinary.com https://upload-widget.cloudinary.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' data: https: blob:;
            font-src 'self' https://fonts.gstatic.com;
            connect-src 'self' https://api.paystack.co https://api.cloudinary.com;
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
            upgrade-insecure-requests;
        `.replace(/\s{2,}/g, ' ').trim()

        response.headers.set('Content-Security-Policy', cspHeader)
        response.headers.set('X-DNS-Prefetch-Control', 'on')
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        response.headers.set('X-Frame-Options', 'DENY')
        response.headers.set('X-Content-Type-Options', 'nosniff')
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
        response.headers.set('X-XSS-Protection', '1; mode=block')
        response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

        // Allow access to auth pages and auth APIs without authentication
        if (
            path.startsWith('/admin/login') ||
            path.startsWith('/admin/signup') ||
            path.startsWith('/api/admin/auth')
        ) {
            return response
        }

        // Protect all other admin routes - require admin role
        if (path.startsWith('/admin') && !isAdmin) {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }

        // Protect admin API routes
        if (path.startsWith('/api/admin') && !isAdmin) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized - Admin access required' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        return response
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname

                // Allow auth pages and auth APIs
                if (
                    path.startsWith('/admin/login') ||
                    path.startsWith('/admin/signup') ||
                    path.startsWith('/api/admin/auth')
                ) {
                    return true
                }

                // Allow public API routes
                if (path.startsWith('/api/') && !path.startsWith('/api/admin')) {
                    return true
                }

                // Require token for admin routes
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/upload/:path*',
    ],
}
