'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FriendsTab } from '@/components/dashboard/friends-tab';
import { MessagesTab } from '@/components/dashboard/messages-tab';
import { IncomingCallModal } from '@/components/dashboard/incoming-call-modal';
import { CallControls } from '@/components/dashboard/call-controls';
import { useDashboardSocket } from '@/hooks/use-dashboard-socket';
import { useFriendRequests } from '@/hooks/use-friend-requests';

interface Friend {
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

interface IncomingCall {
  callerId: string;
  callType: 'audio' | 'video';
  // Add any other properties that might be present on the incoming call object
}

export default function DashboardPage() {
  const { dbUser, loading } = useCurrentUser();
  
  // States
  const [activeTab, setActiveTab] = useState('friends');
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<Friend | null>(null);

  // Custom hooks
  const { 
    socket, 
    isConnected,
    friends,
    setFriends,
    messages,
    sendMessage,
    currentMessage,
    setCurrentMessage,
    activeChat,
    setActiveChat
  } = useDashboardSocket(dbUser);

  const {
    friendRequests,
    sendFriendRequest,
    respondToFriendRequest,
    searchFriends,
    searchResults,
    searchTerm,
    setSearchTerm,
    showAddFriendDialog,
    setShowAddFriendDialog
  } = useFriendRequests(dbUser, socket);

  // Update active chat user when activeChat or friends change
  useEffect(() => {
    if (activeChat && friends.length > 0) {
      const friend = friends.find(f => f.id === activeChat);
      if (friend) {
        setActiveChatUser({
          id: friend.id,
          username: friend.username,
          isOnline: friend.isOnline,
          lastSeen: friend.lastSeen,
          avatar: friend.avatar || undefined,
          firstName: friend.firstName || undefined,
          lastName: friend.lastName || undefined
        });
      } else {
        setActiveChatUser(null);
      }
    } else {
      setActiveChatUser(null);
    }
  }, [activeChat, friends]);

  // Call functions
  const startVoiceCall = (friendId: string) => {
    if (!socket) return;
    socket.emit('call-request', {
      receiverId: friendId,
      callType: 'voice',
      offer: null
    });
  };

  const startVideoCall = (friendId: string) => {
    if (!socket) return;
    socket.emit('call-request', {
      receiverId: friendId,
      callType: 'video',
      offer: null
    });
  };

  const acceptCall = () => {
    if (!socket || !incomingCall) return;
    socket.emit('call-response', {
      callerId: incomingCall.callerId,
      accepted: true,
      answer: null
    });
    setIsInCall(true);
    setIncomingCall(null);
  };

  const declineCall = () => {
    if (!socket || !incomingCall) return;
    socket.emit('call-response', {
      callerId: incomingCall.callerId,
      accepted: false,
      answer: null
    });
    setIncomingCall(null);
  };

  const endCall = () => {
    if (!socket || !activeChat) return;
    socket.emit('end-call', {
      targetUserId: activeChat
    });
    setIsInCall(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-zinc-400">Please complete your onboarding first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <DashboardSidebar
        dbUser={dbUser}
        isConnected={isConnected}
        friends={friends}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col h-screen">
        <DashboardHeader
          activeTab={activeTab}
          activeChatUser={activeChatUser}
          startVoiceCall={startVoiceCall}
          startVideoCall={startVideoCall}
          isInCall={isInCall}
        />

        <div className="flex-1 bg-zinc-950 overflow-hidden flex flex-col">
          {activeTab === 'friends' && (
            <FriendsTab
              friends={friends}
              friendRequests={friendRequests}
              sendFriendRequest={sendFriendRequest}
              respondToFriendRequest={respondToFriendRequest}
              searchFriends={searchFriends}
              searchResults={searchResults}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showAddFriendDialog={showAddFriendDialog}
              setShowAddFriendDialog={setShowAddFriendDialog}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                if (tab === 'messages' && !activeChat && friends.length > 0) {
                  setActiveChat(friends[0].id);
                }
              }}
              setActiveChat={(friendId) => {
                setActiveChat(friendId);
                setActiveTab('messages');
              }}
              setActiveChatUser={setActiveChatUser}
              startVoiceCall={startVoiceCall}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab 
              activeChatUser={activeChatUser}
              messages={messages.filter(msg => 
                (msg.senderId === activeChat && msg.senderId) ||
                (msg.senderId === dbUser?.id && activeChat)
              ).map(msg => ({
                ...msg,
                receiverId: msg.senderId === dbUser?.id ? activeChat : dbUser?.id
              }))}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              sendMessage={sendMessage}
              isInCall={isInCall}
              dbUser={dbUser}
            />
          )}
        </div>
      </div>

      <IncomingCallModal
        incomingCall={incomingCall}
        acceptCall={acceptCall}
        declineCall={declineCall}
      />

      <CallControls
        isInCall={isInCall}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        endCall={endCall}
      />
    </div>
  );
}
