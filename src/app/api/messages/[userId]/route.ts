import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, connect, disconnect } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Connect to the database
    await connect();
    
    const clerkUser = await currentUser();
    if (!clerkUser) {
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true }
    });
    
    if (!user) {
      await disconnect();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otherUserId = params.userId;
    console.log('Fetching messages between', user.id, 'and', otherUserId);

    // Get messages between the current user and the other user
    const messages = await db.directMessage.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: user.id,
          },
        ],
        deleted: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    console.log('Fetched', messages.length, 'messages');
    const response = NextResponse.json({ messages });
    
    // Disconnect from the database after the response is sent
    response.headers.set('Connection', 'close');
    await disconnect();
    
    return response;
  } catch (error) {
    console.error('Error fetching messages:', error);
    await disconnect();
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Connect to the database
    await connect();
    
    const clerkUser = await currentUser();
    if (!clerkUser) {
      await disconnect();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, username: true, avatar: true }
    });

    if (!user) {
      await disconnect();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { content, fileUrl } = await request.json();
    const receiverId = params.userId;

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: 'Message content or file is required' },
        { status: 400 }
      );
    }

    console.log('Saving message:', { content, fileUrl, senderId: user.id, receiverId });

    const message = await db.directMessage.create({
      data: {
        content: content || null,
        fileUrl: fileUrl || null,
        senderId: user.id,
        receiverId,
      },
    });

    const response = NextResponse.json({
      ...message,
      sender: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    });
    
    // Disconnect from the database after the response is sent
    response.headers.set('Connection', 'close');
    await disconnect();
    
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    await disconnect();
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
