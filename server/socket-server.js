const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

const app = next({ dev, hostname, port: 3000 });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    // Handle Next.js requests
    return handler(req, res);
  });
  
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User authentication and joining
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
      
      // Notify friends about online status
      socket.broadcast.emit('user-status-change', {
        userId,
        isOnline: true,
      });

      console.log(`User ${username} (${userId}) joined`);
    });

    // Handle direct messages
    socket.on('send-direct-message', (data) => {
      const { receiverId, content, type = 'text' } = data;
      const receiverData = activeUsers.get(receiverId);
      
      if (receiverData) {
        io.to(`user:${receiverId}`).emit('receive-direct-message', {
          senderId: socket.userId,
          senderUsername: socket.username,
          content,
          type,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Handle voice/video call requests
    socket.on('call-request', (data) => {
      const { receiverId, callType, offer } = data;
      const receiverData = activeUsers.get(receiverId);
      
      if (receiverData) {
        io.to(`user:${receiverId}`).emit('incoming-call', {
          callerId: socket.userId,
          callerUsername: socket.username,
          callType, // 'voice' or 'video'
          offer,
        });
      }
    });

    // Handle call responses
    socket.on('call-response', (data) => {
      const { callerId, accepted, answer } = data;
      const callerData = activeUsers.get(callerId);
      
      if (callerData) {
        io.to(`user:${callerId}`).emit('call-answered', {
          receiverId: socket.userId,
          accepted,
          answer,
        });
      }
    });

    // Handle WebRTC signaling
    socket.on('ice-candidate', (data) => {
      const { targetUserId, candidate } = data;
      const targetData = activeUsers.get(targetUserId);
      
      if (targetData) {
        io.to(`user:${targetUserId}`).emit('ice-candidate', {
          fromUserId: socket.userId,
          candidate,
        });
      }
    });

    // Handle call end
    socket.on('end-call', (data) => {
      const { targetUserId } = data;
      const targetData = activeUsers.get(targetUserId);
      
      if (targetData) {
        io.to(`user:${targetUserId}`).emit('call-ended', {
          fromUserId: socket.userId,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        
        // Notify friends about offline status
        socket.broadcast.emit('user-status-change', {
          userId: socket.userId,
          isOnline: false,
          lastSeen: new Date().toISOString(),
        });

        console.log(`User ${socket.username} (${socket.userId}) disconnected`);
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { receiverId } = data;
      const receiverData = activeUsers.get(receiverId);
      
      if (receiverData) {
        io.to(`user:${receiverId}`).emit('user-typing', {
          userId: socket.userId,
          username: socket.username,
        });
      }
    });

    socket.on('typing-stop', (data) => {
      const { receiverId } = data;
      const receiverData = activeUsers.get(receiverId);
      
      if (receiverData) {
        io.to(`user:${receiverId}`).emit('user-stopped-typing', {
          userId: socket.userId,
        });
      }
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Socket.IO server ready on http://${hostname}:${port}`);
  });
});
