import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        clerkId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        onboarded: true,
        isOnline: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      users: allUsers,
      count: allUsers.length,
      message: 'All users in database'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: errorMessage
    }, { status: 500 });
  }
}
