'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';

interface Friend {
  id: string;
  isOnline: boolean;
  lastSeen?: string;
  username?: string;
  // Add other friend properties as needed
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderUsername: string;
  timestamp: string;
}

export function useDashboardSocket(dbUser: any) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (!socket || !dbUser) return;

    // Join user room
    socket.emit('join', {
      userId: dbUser.id,
      username: dbUser.username
    });

    // Listen for messages
    socket.on('receive-direct-message', (data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.content,
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, newMessage]);
    });

    // Listen for friend status updates
    socket.on('user-status-change', (data) => {
      setFriends(prev => 
        prev.map(friend => 
          friend.id === data.userId 
            ? { ...friend, isOnline: data.isOnline, lastSeen: data.lastSeen } 
            : friend
        )
      );
    });

    // Listen for friend request notifications
    socket.on('friend-request-received', (data) => {
      console.log('📥 Received friend request:', data);
      alert(`${data.senderUsername} sent you a friend request!`);
    });

    socket.on('friend-request-responded', (data) => {
      console.log('📥 Friend request responded:', data);
      if (data.accepted) {
        alert(`${data.responderUsername} accepted your friend request! 🎉`);
      } else {
        alert(`${data.responderUsername} declined your friend request.`);
      }
    });

    return () => {
      socket.off('receive-direct-message');
      socket.off('user-status-change');
      socket.off('friend-request-received');
      socket.off('friend-request-responded');
    };
  }, [socket, dbUser]);

  const sendMessage = () => {
    if (!currentMessage.trim() || !socket) return;

    const messageData = {
      receiverId: 'activeChat', // You'll need to pass this
      content: currentMessage,
      type: 'text'
    };

    socket.emit('send-direct-message', messageData);

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      senderId: dbUser.id,
      senderUsername: dbUser.username,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
  };

  return {
    socket,
    isConnected,
    friends,
    setFriends,
    messages,
    sendMessage,
    currentMessage,
    setCurrentMessage
  };
}
