import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST() {
  try {
    // Create some test users for searching
    const testUsers = await db.$transaction([
      db.user.create({
        data: {
          clerkId: 'test_user_1',
          username: 'testuser1',
          email: 'test1@example.com',
          firstName: 'Test',
          lastName: 'User1',
          avatar: '',
          onboarded: true,
          isOnline: false,
        },
      }),
      db.user.create({
        data: {
          clerkId: 'test_user_2',
          username: 'testuser2',
          email: 'test2@example.com',
          firstName: 'Demo',
          lastName: 'User2',
          avatar: '',
          onboarded: true,
          isOnline: true,
        },
      }),
      db.user.create({
        data: {
          clerkId: 'test_user_3',
          username: 'suneo',
          email: 'suneo@example.com',
          firstName: 'Suneo',
          lastName: 'Test',
          avatar: '',
          onboarded: true,
          isOnline: false,
        },
      }),
    ]);

    return NextResponse.json({ 
      message: 'Test users created',
      users: testUsers 
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to create test users',
      details: errorMessage 
    }, { status: 500 });
  }
}
