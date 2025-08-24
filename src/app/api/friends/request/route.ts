import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId } = await req.json();

    const sender = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!sender) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if request already exists
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: sender.id, receiverId: receiverId },
          { senderId: receiverId, receiverId: sender.id }
        ]
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'Friend request already exists or you are already friends' }, { status: 400 });
    }

    // Check if they're already friends
    const existingFriendship = await db.friend.findFirst({
      where: {
        OR: [
          { userId: sender.id, friendId: receiverId },
          { userId: receiverId, friendId: sender.id }
        ]
      },
    });

    if (existingFriendship) {
      return NextResponse.json({ error: 'You are already friends with this user' }, { status: 400 });
    }

    // Create friend request
    const friendRequest = await db.friendRequest.create({
      data: {
        senderId: sender.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      friendRequest,
      message: 'Friend request sent successfully'
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, action } = await req.json();

    const currentDbUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!currentDbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the friend request
    const friendRequest = await db.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!friendRequest || friendRequest.receiverId !== currentDbUser.id) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    if (action === 'accept') {
      // Check if friendship already exists
      const existingFriendship = await db.friend.findFirst({
        where: {
          OR: [
            { userId: friendRequest.senderId, friendId: friendRequest.receiverId },
            { userId: friendRequest.receiverId, friendId: friendRequest.senderId }
          ]
        }
      });

      if (existingFriendship) {
        // If friendship exists, just update the request status to accepted
        await db.friendRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        });
      } else {
        // Create friendship (both directions) and update request status
        await db.$transaction([
        db.friend.create({
          data: {
            userId: friendRequest.senderId,
            friendId: friendRequest.receiverId,
          },
        }),
        db.friend.create({
          data: {
            userId: friendRequest.receiverId,
            friendId: friendRequest.senderId,
          },
        }),
        db.friendRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' }
        })
      ]);
      }

      return NextResponse.json({ 
        message: 'Friend request accepted',
        accepted: true
      });
    } else if (action === 'decline') {
      // Update request status to declined
      await db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'DECLINED' },
      });

      return NextResponse.json({ 
        message: 'Friend request declined',
        accepted: false
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
