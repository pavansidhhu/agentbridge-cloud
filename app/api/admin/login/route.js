import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

async function createSessionToken(username) {
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_change_me';
  const payload = { username, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const sig = createHmac('sha256', secret).update(payloadB64).digest('hex');
  return `${payloadB64}.${sig}`;
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createSessionToken(username);
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
                    request.url.startsWith('https');

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
