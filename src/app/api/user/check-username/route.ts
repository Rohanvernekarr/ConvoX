import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username parameter required' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ available: false, error: 'Username must be 3-20 characters' });
    }

    // Check if username exists
    const existingUser = await db.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    return NextResponse.json({ 
      available: !existingUser,
      username: username.toLowerCase() 
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
