import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin/rezervacije')) {
    const isAdmin = request.cookies.get('admin_token')?.value === 'bemata_admin_secret';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/rezervacije', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
