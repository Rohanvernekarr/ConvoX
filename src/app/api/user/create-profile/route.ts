import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, connect, disconnect } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connect();
    
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, email, firstName, lastName, avatar } = await req.json();

    // Check if user already has a profile
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      const response = NextResponse.json({ user: existingUser });
      response.headers.set('Connection', 'close');
      await disconnect();
      return response;
    }

    // Create new user profile
    const user = await db.user.create({
      data: {
        clerkId: userId,
        username: username || `user_${Math.random().toString(36).substr(2, 9)}`,
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        avatar: avatar || '',
        isOnline: true,
        onboarded: true, // Mark as onboarded when profile is created
      },
    });

    const response = NextResponse.json({ user });
    response.headers.set('Connection', 'close');
    await disconnect();
    return response;
  } catch (error) {
    console.error('Error creating profile:', error);
    await disconnect();
    return NextResponse.json(
      { 
        error: 'Failed to create user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
