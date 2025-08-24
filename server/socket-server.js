const { createServer } = require('http');
const { Server } = require('socket.io');

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
    socket.userId = userId;
    socket.username = username;
    
    activeUsers.set(userId, {
      socketId: socket.id,
      username,
      isOnline: true,
      lastSeen: new Date(),
    });

    socket.join(`user:${userId}`);
    console.log(`User ${username} (${userId}) joined`);
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
