import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is trying to access an /admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Check for a cookie named 'admin_session'
    const adminSession = request.cookies.get('admin_session')

    // If the cookie doesn't exist or is invalid, redirect to login
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}