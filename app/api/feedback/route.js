import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, experience } = body;

    if (!email || !experience) {
      return NextResponse.json({ error: 'Email and experience are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('agentbridge');
    const feedbackCollection = db.collection('feedback');

    await feedbackCollection.insertOne({
      email: email.toLowerCase(),
      experience: experience,
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
