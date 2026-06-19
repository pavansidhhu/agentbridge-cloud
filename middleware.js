import { NextResponse } from 'next/server';

// Simple token verification using Web Crypto (Edge Runtime compatible)
// Token format: base64(payload).base64(sig)
async function verifySessionToken(token) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_change_me';
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const payloadB64 = token.slice(0, dotIdx);
    const sigHex = token.slice(dotIdx + 1);

    // Re-compute HMAC-SHA256 signature using Web Crypto
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuffer = await crypto.subtle.sign('HMAC', keyMaterial, enc.encode(payloadB64));
    const expectedHex = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (sigHex !== expectedHex) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin/dashboard — redirect to login if no valid session
  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // If already logged in and visiting /admin login page, redirect to dashboard
  if (pathname === '/admin') {
    const token = request.cookies.get('admin_session')?.value;
    if (token && (await verifySessionToken(token))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
