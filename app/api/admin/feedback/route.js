import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function verifySessionToken(token) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_change_me';
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const payloadB64 = token.slice(0, dotIdx);
    const sigHex = token.slice(dotIdx + 1);

    const expectedSig = createHmac('sha256', secret).update(payloadB64).digest('hex');
    if (sigHex !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    // Verify session cookie
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query all feedback from MongoDB sorted by submittedAt desc
    const client = await clientPromise;
    const db = client.db('agentbridge');
    const feedbackCollection = db.collection('feedback');

    const feedbackList = await feedbackCollection.find({}).sort({ submittedAt: -1 }).toArray();

    // Remove internal _id field
    const sanitized = feedbackList.map(({ _id, ...rest }) => rest);

    const response = NextResponse.json({ feedback: sanitized, total: sanitized.length });
    // Add caching headers
    response.headers.set('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('Admin feedback fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
