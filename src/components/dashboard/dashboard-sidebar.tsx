'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Plus, 
  Hash, 
  Volume2
} from 'lucide-react';

interface DashboardSidebarProps {
  dbUser: {
    id: string;
    username: string;
    avatar?: string;
  };
  isConnected: boolean;
  friends: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
  dbUser,
  isConnected,
  friends,
  activeTab,
  setActiveTab
}: DashboardSidebarProps) {
  return (
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
  );
}
