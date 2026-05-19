import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Simple hardcoded password for demo purposes
    if (password === 'BE9L8td15LMA<C?>06TA') {
      const response = NextResponse.json({ success: true });
      
      const url = request.url || '';
      const forwardedProto = request.headers.get('x-forwarded-proto') || '';
      const isHttps = url.startsWith('https:') || forwardedProto === 'https';

      response.cookies.set('admin_token', 'bemata_admin_secret', {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
