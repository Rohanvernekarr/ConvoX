import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, email, firstName, lastName, avatar } = await req.json();

    // Check if user already has a profile
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
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
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    );
  }
}
