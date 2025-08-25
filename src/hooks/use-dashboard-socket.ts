'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';

export interface Friend {
  id: string;
  username: string;
  avatar?: string | null;
  isOnline: boolean;
  lastSeen: Date | string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  clerkId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    avatar?: string | null;
  };
  receiverId: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useDashboardSocket(dbUser: any) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/friends');
        if (response.ok) {
          const data = await response.json();
          setFriends(data.friends);
        }
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      }
    };

    fetchFriends();
  }, [dbUser?.id]);

  useEffect(() => {
    if (!socket || !dbUser) return;

    // Join user room
    socket.emit('join', {
      userId: dbUser.id,
      username: dbUser.username
    });

    // Listen for messages
    socket.on('receive-direct-message', (data) => {
      console.log('📥 Raw message received:', data);
      
      if (!data.senderId || !data.content) {
        console.error('❌ Invalid message format:', data);
        return;
      }
      
      const newMessage: Message = {
        id: data.id || `${data.senderId}-${Date.now()}`,
        content: data.content,
        senderId: data.senderId,
        sender: {
          id: data.senderId,
          username: data.sender?.username || data.senderUsername || 'Unknown',
          avatar: data.sender?.avatar || null
        },
        receiverId: data.receiverId,
        timestamp: data.timestamp || new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      
      console.log('📥 Processed message:', newMessage);
      console.log('📥 Active chat:', activeChat, 'Current user ID:', dbUser?.id);
      
      // Add message if:
      // 1. It's from the active chat, or
      // 2. The current user is the receiver
      const isFromActiveChat = data.senderId === activeChat;
      const isToCurrentUser = data.receiverId === dbUser?.id;
      
      if (isFromActiveChat || isToCurrentUser) {
        console.log('📥 Adding message to state');
        setMessages(prev => {
          // Prevent duplicate messages
          if (!prev.some(msg => msg.id === newMessage.id)) {
            return [...prev, newMessage];
          }
          console.log('📥 Duplicate message detected, not adding to state');
          return prev;
        });
      } else {
        console.log('📥 Message filtered out - not for current chat');
      }
      
      // Notify the user if the message is not from the active chat
      if (!isFromActiveChat && isToCurrentUser) {
        console.log('💬 New message from', data.senderUsername);
        // You could add a notification here
      }
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
    socket.on('friend-request-received', (data: any) => {
      console.log('📥 Received friend request:', data);
      alert(`${data.senderUsername} sent you a friend request!`);
    });

    socket.on('friend-request-responded', async (data: any) => {
      console.log('📥 Friend request responded:', data);
      if (data.accepted) {
        alert(`${data.responderUsername} accepted your friend request! 🎉`);
        // Refresh friends list when a friend request is accepted
        try {
          const response = await fetch('/api/friends');
          if (response.ok) {
            const friendsData = await response.json();
            setFriends(friendsData.friends);
          }
        } catch (error) {
          console.error('Failed to refresh friends list:', error);
        }
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

  const sendMessage = async () => {
    if (!currentMessage.trim() || !socket || !activeChat || !dbUser) {
      console.log('❌ Cannot send message - missing data:', { 
        hasMessage: !!currentMessage.trim(),
        hasSocket: !!socket,
        hasActiveChat: !!activeChat,
        hasDbUser: !!dbUser
      });
      return;
    }

    const messageId = `msg_${Date.now()}`;
    const tempMessage = {
      id: messageId,
      content: currentMessage,
      receiverId: activeChat,
      senderId: dbUser.id,
      sender: {
        id: dbUser.id,
        username: dbUser.username || 'Unknown',
        avatar: dbUser.avatar
      },
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Sending message:', tempMessage);
    
    try {
      // Optimistically add the message to the UI
      setMessages((prev: Message[]) => [...prev, tempMessage]);
      
      // Also save to the database via API
      const apiResponse = await fetch(`/api/messages/${activeChat}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentMessage }),
      });
      
      if (!apiResponse.ok) {
        const error = await apiResponse.json().catch(() => ({}));
        console.error('Failed to save message to database:', error);
        return;
      }
      
      const savedMessage: Message = await apiResponse.json();
      
      // Update the message with the server-generated ID and timestamps
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...savedMessage, sender: tempMessage.sender } : msg
        )
      );
      
      // Send via WebSocket for real-time delivery to other clients
      socket.emit('send-direct-message', 
        { ...savedMessage, sender: tempMessage.sender },
        (response: any) => {
          console.log('Message delivery status:', response);
          if (response.status === 'error') {
            console.error('Failed to send message via WebSocket:', response.message);
          }
        }
      );
      
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show an error to the user
    }
  };

  // Set active chat and load messages
  const setActiveChatAndLoadMessages = async (friendId: string | null) => {
    setActiveChat(friendId);
    if (friendId) {
      try {
        setIsLoadingMessages(true);
        const response = await fetch(`/api/messages/${friendId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          console.error('Failed to load messages');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    }
  };

  return {
    socket,
    isConnected,
    friends,
    setFriends,
    messages,
    sendMessage,
    currentMessage,
    setCurrentMessage,
    activeChat,
    setActiveChat: setActiveChatAndLoadMessages
  };
}
