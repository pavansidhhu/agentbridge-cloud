import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    let { email } = body;

    // Sanitize and trim
    if (typeof email === 'string') email = email.trim();

    // Server-side validation
    if (!email || typeof email !== 'string' || email.length > 200) {
      return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('agentbridge');
    const users = db.collection('users');

    // Update lastSeen (only if user exists, or do we upsert? heartbeat typically just updates, but let's update with upsert or simple update. The spec says: Called every launch: lastSeen = now. Let's do updateOne)
    const result = await users.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          lastSeen: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      // User wasn't found in database (maybe registration didn't complete or DB was reset)
      // Let's still return success: true or a specific message. Standard is returning success: true, or we can upsert.
      // Let's just return success: true to keep the client happy, but log a warning.
      console.warn(`Heartbeat received for non-existent user: ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
