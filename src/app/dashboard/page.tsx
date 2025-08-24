'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useState } from 'react';
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
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
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
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<Friend | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  // Custom hooks
  const { 
    socket, 
    isConnected,
    friends,
    setFriends,
    messages,
    sendMessage,
    currentMessage,
    setCurrentMessage
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

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          activeTab={activeTab}
          activeChatUser={activeChatUser}
          startVoiceCall={startVoiceCall}
          startVideoCall={startVideoCall}
          isInCall={isInCall}
        />

        <div className="flex-1 bg-zinc-950 overflow-hidden">
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
              setActiveTab={setActiveTab}
              setActiveChat={setActiveChat}
              setActiveChatUser={setActiveChatUser}
              startVoiceCall={startVoiceCall}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab
              activeChatUser={activeChatUser}
              messages={messages}
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
