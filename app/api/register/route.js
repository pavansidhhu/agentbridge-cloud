import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Helper to parse OS from User Agent string
function getOSFromUA(userAgent) {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('win')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  return 'Other';
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { email, version, machineId } = body;

    // Sanitize and trim strings
    if (typeof email === 'string') email = email.trim();
    if (typeof version === 'string') version = version.trim();
    if (typeof machineId === 'string') machineId = machineId.trim();

    // Server-side validation
    if (!email || typeof email !== 'string' || email.length > 200) {
      return NextResponse.json({ error: 'Invalid or missing email (max 200 chars)' }, { status: 400 });
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!version || typeof version !== 'string' || version.length > 20) {
      return NextResponse.json({ error: 'Invalid or missing version (max 20 chars)' }, { status: 400 });
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('agentbridge');
    const users = db.collection('users');

    // Perform upsert based on email, storing only required fields
    await users.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          version: version,
          lastSeen: new Date()
        },
        $setOnInsert: {
          email: email.toLowerCase(),
          firstSeen: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
