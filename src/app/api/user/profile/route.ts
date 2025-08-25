import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, connect, disconnect } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connect();
    
    const clerkUser = await currentUser();
    if (!clerkUser) {
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, avatar } = await req.json();

    console.log('🔄 Processing user profile setup:', {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      username: username,
    });

    // First, check if user already exists by clerkId
    const existingUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (existingUser) {
      // User exists - update their profile
      const updatedUser = await db.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          username: username.toLowerCase(),
          avatar: avatar || clerkUser.imageUrl || '',
          onboarded: true,
          isOnline: true,
          updatedAt: new Date(),
        },
      });

      console.log('✅ User profile updated:', updatedUser.id);
      const response = NextResponse.json({ user: updatedUser });
      response.headers.set('Connection', 'close');
      await disconnect();
      return response;
    }

    // User doesn't exist - create new user
    const newUser = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        username: username.toLowerCase(),
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: avatar || clerkUser.imageUrl || '',
        onboarded: true,
        isOnline: true,
      },
    });

    console.log('✅ New user created:', newUser.id);
    const response = NextResponse.json({ user: newUser });
    response.headers.set('Connection', 'close');
    await disconnect();
    return response;

  } catch (error) {
    console.error('❌ Error in user profile setup:', error);

    // Handle Prisma unique constraint errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        let errorResponse;
        
        if (target?.includes('email')) {
          errorResponse = NextResponse.json({ 
            error: 'An account with this email already exists. Please contact support.' 
          }, { status: 409 });
        } else if (target?.includes('username')) {
          errorResponse = NextResponse.json({ 
            error: 'This username is already taken. Please choose a different one.' 
          }, { status: 409 });
        } else {
          errorResponse = NextResponse.json({ 
            error: 'This information is already in use. Please try different details.' 
          }, { status: 409 });
        }
        
        errorResponse.headers.set('Connection', 'close');
        await disconnect();
        return errorResponse;
      }
    }

    const errorResponse = NextResponse.json({ 
      error: 'Failed to setup your profile. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
    
    errorResponse.headers.set('Connection', 'close');
    await disconnect();
    return errorResponse;
  }
}

export async function GET() {
  try {
    // Connect to the database
    await connect();
    
    const clerkUser = await currentUser();
    if (!clerkUser) {
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        friends: {
          include: {
            friend: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        receivedRequests: {
          where: { status: 'PENDING' },
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
      },
    });

    const response = NextResponse.json({ user });
    response.headers.set('Connection', 'close');
    await disconnect();
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    await disconnect();
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
