const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Handle database connection
prisma.$connect()
  .then(() => console.log('✅ Database connected in socket server'))
  .catch(err => {
    console.error('❌ Failed to connect to database in socket server:', err);
    process.exit(1);
  });

// Handle process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Store active users and their socket IDs
const activeUsers = new Map(); // userId -> { socketId, username, isOnline }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their data
  socket.on('join', (userData) => {
    const { userId, username } = userData;
    if (!userId || !username) {
      console.error('❌ Invalid join data:', { userId, username });
      return;
    }
    
    socket.userId = userId;
    socket.username = username;
    
    const userInfo = {
      socketId: socket.id,
      username,
      isOnline: true,
      lastSeen: new Date(),
    };
    
    activeUsers.set(userId, userInfo);
    socket.join(`user:${userId}`);
    
    console.log('👥 Active users after join:', Array.from(activeUsers.entries()));
    console.log(`✅ User ${username} (${userId}) joined with socket ${socket.id}`);
    
    // Send current user list to the newly connected user
    const usersList = Array.from(activeUsers.entries()).map(([id, data]) => ({
      userId: id,
      username: data.username,
      isOnline: data.isOnline,
      lastSeen: data.lastSeen
    }));
    
    socket.emit('user-list', usersList);
    
    // Notify others about the new user
    socket.broadcast.emit('user-joined', {
      userId,
      username,
      isOnline: true,
      lastSeen: new Date()
    });
  });

  // ✅ NEW: Handle friend request sending
  socket.on('send-friend-request', async (data) => {
    const { senderId, receiverId, senderUsername } = data;
    
    console.log(`📤 Friend request: ${senderUsername} → ${receiverId}`);
    
    // Check if receiver is online
    const receiverData = activeUsers.get(receiverId);
    
    if (receiverData) {
      // Send real-time notification to receiver
      io.to(`user:${receiverId}`).emit('friend-request-received', {
        senderId: senderId,
        senderUsername: senderUsername,
        message: `${senderUsername} sent you a friend request`,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`✅ Notified ${receiverId} about friend request from ${senderUsername}`);
    } else {
      console.log(`❌ User ${receiverId} is offline`);
    }
  });

  // ✅ NEW: Handle friend request responses
  socket.on('respond-friend-request', async (data) => {
    const { requestId, senderId, receiverId, accepted, responderUsername } = data;
    
    console.log(`📥 Friend request response: ${responderUsername} ${accepted ? 'accepted' : 'declined'}`);
    
    // Notify the original sender
    const senderData = activeUsers.get(senderId);
    
    if (senderData) {
      io.to(`user:${senderId}`).emit('friend-request-responded', {
        requestId: requestId,
        accepted: accepted,
        responderUsername: responderUsername,
        message: `${responderUsername} ${accepted ? 'accepted' : 'declined'} your friend request`,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`✅ Notified ${senderId} about response from ${responderUsername}`);
    }
  });

  // Handle user status changes
  socket.on('user-status-change', (data) => {
    const { userId, isOnline } = data;
    
    if (activeUsers.has(userId)) {
      activeUsers.get(userId).isOnline = isOnline;
      
      // Broadcast status to all users
      socket.broadcast.emit('user-status-update', {
        userId,
        isOnline,
      });
    }
  });

  // Handle direct messages
  socket.on('send-direct-message', async (data, ack) => {
    console.log('🔵 Incoming message request:', data);
    
    const { messageId, senderId, receiverId, content, senderUsername, timestamp } = data;
    
    if (!senderId || !receiverId || (!content && !data.fileUrl)) {
      console.error('❌ Missing required fields:', { senderId, receiverId, content });
      if (typeof ack === 'function') {
        ack({ status: 'error', message: 'Missing required fields' });
      }
      return;
    }
    
    // Save message to database
    let savedMessage;
    try {
      savedMessage = await prisma.directMessage.create({
        data: {
          id: messageId,
          content: content || null,
          fileUrl: data.fileUrl || null,
          senderId,
          receiverId,
          read: false,
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
      console.log('💾 Message saved to database:', savedMessage.id);
    } catch (error) {
      console.error('❌ Error saving message to database:', error);
      if (typeof ack === 'function') {
        ack({ status: 'error', message: 'Failed to save message' });
      }
      return;
    }
    
    console.log(`💬 DM from ${senderUsername} (${senderId}) to ${receiverId}: ${content}`);
    
    // Prepare message data for sending
    const messageData = {
      id: savedMessage.id,
      senderId: savedMessage.senderId,
      senderUsername: savedMessage.sender?.username || senderUsername || 'Unknown',
      senderAvatar: savedMessage.sender?.avatar,
      content: savedMessage.content,
      fileUrl: savedMessage.fileUrl,
      timestamp: savedMessage.createdAt.toISOString(),
      receiverId: savedMessage.receiverId,
    };
    
    // Check if receiver is online
    const receiverData = activeUsers.get(receiverId);
    const receiverSocketId = receiverData?.socketId;
    
    console.log('🔍 Active users:', Array.from(activeUsers.entries()));
    console.log(`🔍 Looking for receiver ${receiverId}, found socket:`, receiverSocketId);
    
    if (receiverSocketId) {
      console.log(`📡 Sender socket rooms:`, Array.from(io.sockets.adapter.sids.get(socket.id) || []));
      console.log(`📡 Receiver ${receiverId} is in rooms:`, Array.from(io.sockets.adapter.sids.get(receiverSocketId) || []));
      console.log(`📤 Sending message to ${receiverId} (socket: ${receiverSocketId})`);
      
      // Send to the specific socket
      io.to(receiverSocketId).emit('receive-direct-message', messageData);
      
      // Also send to the user's room as a fallback
      io.to(`user:${receiverId}`).emit('receive-direct-message', messageData);
      console.log(`✅ Message delivered to ${receiverId}`);
    } else {
      console.log(`ℹ️ Receiver ${receiverId} is offline, message saved for later`);
    }
    
    // Send confirmation to sender
    if (typeof ack === 'function') {
      ack({ 
        status: 'delivered', 
        messageId: messageId,
        timestamp: timestamp || new Date().toISOString(),
        message: data
      });
    }
    
    // Here you would typically store the message in the database
    // and deliver it when the user comes online
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      
      // Notify others about offline status
      socket.broadcast.emit('user-status-update', {
        userId: socket.userId,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      });

      console.log(`User ${socket.username} (${socket.userId}) disconnected`);
    }
  });
});

const port = process.env.SOCKET_PORT || 3001;
httpServer.listen(port, () => {
  console.log(`🚀 Socket.IO server ready on http://localhost:${port}`);
});
