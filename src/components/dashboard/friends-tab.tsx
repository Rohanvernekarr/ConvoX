'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Search, MessageCircle, Phone } from 'lucide-react';

interface FriendsTabProps {
  friends: any[];
  friendRequests: any[];
  sendFriendRequest: (userId: string) => void;
  respondToFriendRequest: (requestId: string, accepted: boolean) => void;
  searchFriends: () => void;
  searchResults: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAddFriendDialog: boolean;
  setShowAddFriendDialog: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  setActiveChat: (chat: string) => void;
  setActiveChatUser: (user: any) => void;
  startVoiceCall: (friendId: string) => void;
}

export function FriendsTab({
  friends,
  friendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  searchFriends,
  searchResults,
  searchTerm,
  setSearchTerm,
  showAddFriendDialog,
  setShowAddFriendDialog,
  setActiveTab,
  setActiveChat,
  setActiveChatUser,
  startVoiceCall
}: FriendsTabProps) {
  return (
    <div className="p-6">
      {/* Add Friend Button */}
      <div className="mb-6">
        <Dialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-600 hover:bg-zinc-700">
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

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pending Friend Requests ({friendRequests.length})
          </h3>
          <div className="space-y-3">
            {friendRequests.map((request: any) => (
              <div key={request.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={request.sender.avatar} />
                      <AvatarFallback className="bg-zinc-700 text-white">
                        {request.sender.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">@{request.sender.username}</p>
                      <p className="text-xs text-zinc-400">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => respondToFriendRequest(request.id, true)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-zinc-600 hover:bg-zinc-800"
                      onClick={() => respondToFriendRequest(request.id, false)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-6 bg-zinc-800" />
        </div>
      )}

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
  );
}
