import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = new Set(['/login'])
const PUBLIC_PREFIXES = ['/api/', '/manifest.json', '/sw.js', '/icons/']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')

  // Logged-in users visiting /login → home
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Prevent authenticated pages from being stored in bfcache.
  // Without this the browser's Back button restores stale authenticated
  // content after logout without ever hitting the server.
  const response = NextResponse.next()
  if (!isPublic) {
    response.headers.set('Cache-Control', 'no-store')
  }
  return response
}

export const config = {
  // Exclude Next.js internals and static assets; match everything else
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.ico$).*)'],
}
