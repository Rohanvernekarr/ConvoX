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
    const existingRequest = await db.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: sender.id,
          receiverId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'Friend request already sent' }, { status: 400 });
    }

    // Create friend request
    const friendRequest = await db.friendRequest.create({
      data: {
        senderId: sender.id,
        receiverId,
      },
    });

    return NextResponse.json({ friendRequest });
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

    const friendRequest = await db.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest || friendRequest.receiverId !== currentDbUser.id) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 });
    }

    if (action === 'accept') {
      // Create friendship (both directions)
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
          data: { status: 'ACCEPTED' },
        }),
      ]);
    } else {
      await db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'DECLINED' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling friend request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
