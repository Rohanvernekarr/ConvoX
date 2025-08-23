export interface User {
    id: string;
    clerkId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen: Date;
  }
  
  export interface Message {
    id: string;
    content: string;
    fileUrl?: string;
    userId: string;
    channelId: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  }
  
  export interface DirectMessage {
    id: string;
    content: string;
    fileUrl?: string;
    senderId: string;
    receiverId: string;
    read: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: User;
  }
  
  export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    createdAt: Date;
    updatedAt: Date;
    sender: User;
    receiver: User;
  }
  