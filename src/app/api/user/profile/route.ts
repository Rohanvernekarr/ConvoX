import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        receivedRequests: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        friends: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, avatar } = await req.json();

    // Create user in your Aiven database with all Clerk data
    const userData = {
      clerkId: clerkUser.id,
      username: username.toLowerCase(),
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      avatar: avatar || clerkUser.imageUrl || '',
      onboarded: true,
      isOnline: true
    };

    const dbUser = await db.user.create({
      data: userData,
    });

    console.log('✅ User manually saved to Aiven database:', {
      clerkId: clerkUser.id,
      username: username,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      databaseId: dbUser.id
    });

    return NextResponse.json({ user: dbUser });
  } catch (error: unknown) {
    console.error('❌ Error saving user to database:', error);
    
    // If username already exists, provide helpful error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
