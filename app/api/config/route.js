import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('agentbridge');
    const configCollection = db.collection('config');

    let config = await configCollection.findOne({ _id: 'global' });

    // Ensure config exists with required defaults and correct version
    if (!config) {
      config = {
        _id: 'global',
        latestVersion: '1.0.1',
        forceUpdate: false,
        announcement: ''
      };
      await configCollection.updateOne({ _id: 'global' }, { $setOnInsert: config }, { upsert: true });
    } else {
      // Update missing or outdated fields
      const updates = {};
      if (config.latestVersion !== '1.0.1') updates.latestVersion = '1.0.1';
      if (typeof config.forceUpdate !== 'boolean') updates.forceUpdate = false;
      if (typeof config.announcement !== 'string') updates.announcement = '';
      if (Object.keys(updates).length > 0) {
        await configCollection.updateOne({ _id: 'global' }, { $set: updates });
        config = { ...config, ...updates };
      }
    }

    // Return the config properties (excluding internal database _id if desired, or return entire object)
    return NextResponse.json({
      latestVersion: (config.latestVersion?.trim()) || '1.0.1',
      forceUpdate: !!config.forceUpdate,
      announcement: config.announcement || ''
    });
  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
