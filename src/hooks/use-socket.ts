'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';

// Use the same origin for WebSocket if in browser
const getSocketUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  
  // If running on localhost, use localhost:3001
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // For production, use the same host with wss://
  return `wss://${window.location.host}`;
};

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const connectSocket = useCallback(() => {
    if (!user) return null;

    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to WebSocket server at:', socketUrl);

    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected with ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      
      // Attempt to reconnect after a delay
      if (connectionAttempts < 5) {
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
        console.log(`🔄 Reconnecting in ${delay}ms...`);
        setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          socketInstance.connect();
        }, delay);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    socketInstance.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after multiple attempts');
    });

    return socketInstance;
  }, [user, connectionAttempts]);

  useEffect(() => {
    if (!user) return;

    const socketInstance = connectSocket();
    setSocket(socketInstance);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('connect_error');
        socketInstance.off('error');
        socketInstance.disconnect();
      }
    };
  }, [user, connectSocket]);

  return { socket, isConnected };
}
