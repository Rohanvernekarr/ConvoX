import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    console.log('🔍 User search query:', query);

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    if (query.length < 2) {
      return NextResponse.json({ 
        users: [],
        message: 'Query must be at least 2 characters' 
      });
    }

    // Get current user to exclude from search
    const currentDbUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!currentDbUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    // Search users in your database
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                username: {
                  contains: query.toLowerCase(),
                  mode: 'insensitive',
                },
              },
              {
                firstName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            NOT: {
              id: currentDbUser.id, // Exclude current user
            },
          },
          {
            onboarded: true, // Only show users who completed onboarding
          },
        ],
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        email: true,
        isOnline: true,
      },
      take: 10, // Limit results
    });

    console.log('✅ Found users:', users.length);

    return NextResponse.json({ 
      users,
      count: users.length,
      query: query 
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}
