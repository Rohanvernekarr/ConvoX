'use client';

import { Button } from '@/components/ui/button';
import { Phone, Video } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: string;
  activeChatUser: any;
  startVoiceCall: (friendId: string) => void;
  startVideoCall: (friendId: string) => void;
  isInCall: boolean;
}

export function DashboardHeader({
  activeTab,
  activeChatUser,
  startVoiceCall,
  startVideoCall,
  isInCall
}: DashboardHeaderProps) {
  return (
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
  );
}
