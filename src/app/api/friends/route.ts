import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, connect, disconnect } from '@/lib/prisma';

export async function GET() {
  try {
    // Connect to the database
    await connect();
    
    console.log('🔍 Starting friends API request');
    const clerkUser = await currentUser();
    console.log('🔍 Clerk user:', clerkUser?.id);
    
    if (!clerkUser) {
      console.error('❌ Unauthorized: No clerk user');
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      console.log('🔍 Fetching user with friends');
      
      // Get the user with their friend relationships
      const userWithFriends = await db.user.findUnique({
        where: { 
          clerkId: clerkUser.id 
        },
        include: {
          // Friends where this user is the user (friendOf)
          friendOf: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  isOnline: true,
                  lastSeen: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          // Friends where this user is the friend (friends)
          friends: {
            select: {
              friend: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  isOnline: true,
                  lastSeen: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!userWithFriends) {
        console.error('❌ User not found');
        await disconnect();
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Combine both friend types into a single array
      const friendOfFriends = userWithFriends.friendOf.map(f => f.user);
      const friends = userWithFriends.friends.map(f => f.friend);
      const allFriends = [...friendOfFriends, ...friends];

      // Remove duplicates by ID
      const uniqueFriends = Array.from(new Map(
        allFriends.map(friend => [friend.id, friend])
      ).values());

      console.log(`✅ Found ${uniqueFriends.length} friends`);
      console.log('✅ Friends processed:', friends.length);
      
      return NextResponse.json({ friends });
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError?.message || 'Unknown database error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Unexpected error in friends API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
