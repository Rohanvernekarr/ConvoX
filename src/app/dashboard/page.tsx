'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useSocket } from '@/hooks/use-socket';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Plus, 
  Hash, 
  Volume2,
  Phone,
  Video,
  Search,
  UserPlus,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  PhoneOff,
  Send,
  Smile,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderUsername: string;
  timestamp: string;
}

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export default function DashboardPage() {
  const { dbUser, clerkUser, loading } = useCurrentUser();
  const { socket, isConnected } = useSocket();
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<Friend | null>(null);
  
  // Friend management states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState([]);
  
  // Call states
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState('friends');
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);

  // Socket.IO Event Handlers
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

    // Listen for incoming calls
    socket.on('incoming-call', (data) => {
      setIncomingCall(data);
    });

    // Listen for call answered
    socket.on('call-answered', (data) => {
      if (data.accepted) {
        setIsInCall(true);
      } else {
        alert('Call declined');
      }
    });

    // Listen for call ended
    socket.on('call-ended', () => {
      setIsInCall(false);
      setIncomingCall(null);
    });

    return () => {
      socket.off('receive-direct-message');
      socket.off('user-status-change');
      socket.off('incoming-call');
      socket.off('call-answered');
      socket.off('call-ended');
    };
  }, [socket, dbUser]);

  // Send message function
  const sendMessage = () => {
    if (!currentMessage.trim() || !activeChat || !socket) return;

    const messageData = {
      receiverId: activeChat,
      content: currentMessage,
      type: 'text'
    };

    socket.emit('send-direct-message', messageData);

    // Add to local messages
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

  // Search friends function
// In your dashboard component
const searchFriends = async () => {
  if (!searchTerm.trim() || searchTerm.length < 2) {
    alert('Please enter at least 2 characters to search');
    return;
  }

  console.log('🔍 Searching for:', searchTerm);

  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    
    console.log('🔍 Search response:', data);

    if (response.ok) {
      setSearchResults(data.users || []);
      if (data.users.length === 0) {
        alert(`No users found matching "${searchTerm}"`);
      }
    } else {
      console.error('Search error:', data);
      alert(data.error || 'Search failed');
    }
  } catch (error) {
    console.error('Search network error:', error);
    alert('Network error during search');
  }
};


  // Send friend request function
  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        alert('Friend request sent!');
        setSearchResults([]);
        setSearchTerm('');
        setShowAddFriendDialog(false);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Voice call function
  const startVoiceCall = (friendId: string) => {
    if (!socket) return;
    
    socket.emit('call-request', {
      receiverId: friendId,
      callType: 'voice',
      offer: null // WebRTC offer would go here
    });
  };

  // Video call function
  const startVideoCall = (friendId: string) => {
    if (!socket) return;
    
    socket.emit('call-request', {
      receiverId: friendId,
      callType: 'video',
      offer: null // WebRTC offer would go here
    });
  };

  // Accept call function
  const acceptCall = () => {
    if (!socket || !incomingCall) return;
    
    socket.emit('call-response', {
      callerId: incomingCall.callerId,
      accepted: true,
      answer: null // WebRTC answer would go here
    });
    
    setIsInCall(true);
    setIncomingCall(null);
  };

  // Decline call function
  const declineCall = () => {
    if (!socket || !incomingCall) return;
    
    socket.emit('call-response', {
      callerId: incomingCall.callerId,
      accepted: false,
      answer: null
    });
    
    setIncomingCall(null);
  };

  // End call function
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
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={dbUser.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {dbUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">@{dbUser.username}</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-zinc-400">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <Button 
              variant={activeTab === 'friends' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('friends')}
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
              <Badge variant="outline" className="ml-auto">
                {friends.length}
              </Badge>
            </Button>
            
            <Button 
              variant={activeTab === 'messages' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Direct Messages
            </Button>
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Servers Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                Servers
              </h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-zinc-400 hover:text-white">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded cursor-pointer text-zinc-400 hover:text-white transition-colors">
                <Hash className="w-4 h-4" />
                <span>general</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded cursor-pointer text-zinc-400 hover:text-white transition-colors">
                <Volume2 className="w-4 h-4" />
                <span>voice-chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-zinc-800">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'friends' && 'Friends'}
                {activeTab === 'messages' && (activeChatUser ? `Chat with @${activeChatUser.username}` : 'Direct Messages')}
              </h1>
              <p className="text-zinc-400 mt-1">
                {activeTab === 'friends' && 'Manage your friends and connections'}
                {activeTab === 'messages' && (activeChatUser ? `${activeChatUser.isOnline ? 'Online' : 'Offline'}` : 'Select a friend to start chatting')}
              </p>
            </div>
            
            {/* Call Controls */}
            {activeChatUser && (
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => startVoiceCall(activeChatUser.id)}
                  disabled={isInCall}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => startVideoCall(activeChatUser.id)}
                  disabled={isInCall}
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-950 overflow-hidden">
          {activeTab === 'friends' && (
            <div className="p-6">
              {/* Add Friend Button */}
              <div className="mb-6">
                <Dialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add Friend</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search by username..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                        />
                        <Button onClick={searchFriends}>
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {searchResults.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-white">@{user.username}</span>
                          </div>
                          <Button size="sm" onClick={() => sendFriendRequest(user.id)}>
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Friends List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-zinc-700 text-white">
                          {friend.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">@{friend.username}</p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className="text-xs text-zinc-400">
                            {friend.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setActiveTab('messages');
                          setActiveChat(friend.id);
                          setActiveChatUser(friend);
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startVoiceCall(friend.id)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex-1 flex flex-col">
              {activeChatUser ? (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.senderId === dbUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === dbUser.id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-zinc-800 text-white'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-zinc-800 border-zinc-700"
                        disabled={isInCall}
                      />
                      <Button onClick={sendMessage} disabled={!currentMessage.trim() || isInCall}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No conversation selected</h3>
                    <p className="text-zinc-400">Choose a friend from your friends list to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarFallback className="bg-zinc-700 text-white text-2xl">
                  {incomingCall.callerUsername[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-white mb-2">
                Incoming {incomingCall.callType} call
              </h3>
              <p className="text-zinc-400 mb-6">@{incomingCall.callerUsername}</p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={declineCall}
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={acceptCall}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In Call Controls */}
      {isInCall && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-zinc-900 rounded-full p-4 border border-zinc-800 flex items-center gap-4">
            <Button
              size="sm"
              variant={isMuted ? "destructive" : "secondary"}
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full"
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant={isVideoOn ? "secondary" : "outline"}
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="rounded-full"
            >
              {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={endCall}
              className="rounded-full"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
