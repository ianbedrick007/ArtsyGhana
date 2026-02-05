import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const isAdmin = token?.role === 'ADMIN'

    // Create response
    const response = NextResponse.next()

    // Add security headers
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const isDev = process.env.NODE_ENV === 'development'

    // Content Security Policy
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

    // 1. PUBLIC ROUTES (No login needed)
    if (
        path.startsWith('/admin/login') ||
        path.startsWith('/admin/signup') ||
        path.startsWith('/api/admin/auth')
    ) {
        return response
    }

    // 2. PROTECT ADMIN UI ROUTES
    if (path.startsWith('/admin')) {
        if (!isAdmin) {
            console.log('🚫 Unauthorized UI access, redirecting to login:', path)
            const url = new URL('/admin/login', req.url)
            url.searchParams.set('callbackUrl', path)
            return NextResponse.redirect(url)
        }
    }

    // 3. PROTECT ADMIN API ROUTES
    if (path.startsWith('/api/admin') || path.startsWith('/api/upload')) {
        if (!isAdmin) {
            console.log('🚫 Unauthorized API access blocked:', path)
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized - Admin access required' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/upload/:path*',
    ],
}
