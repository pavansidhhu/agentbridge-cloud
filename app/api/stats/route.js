import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET || 'your_super_secret_admin_key_here';
    const providedKey = request.headers.get('x-admin-key');

    // Secure endpoint check: Validate x-admin-key
    if (providedKey !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('agentbridge');

    // 1. Total users
    const totalUsers = await db.collection('users').countDocuments();

    // 2. Active users today (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await db.collection('users').countDocuments({
      lastSeen: { $gte: twentyFourHoursAgo }
    });

    // 3. Latest version from config
    const config = await db.collection('config').findOne({ _id: 'global' });
    const latestVersion = config?.latestVersion || '1.0.1';

    return NextResponse.json({
      users: totalUsers,
      activeToday: activeToday,
      latestVersion: latestVersion
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
