'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Settings, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { dbUser, clerkUser } = useCurrentUser();

  if (!dbUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  console.log('Rendering dashboard with user:', { dbUser, clerkUser });

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={dbUser.avatar} />
              <AvatarFallback>
                {dbUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">@{dbUser.username}</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Friends
              <Badge variant="outline" className="ml-auto">
                {dbUser.friends?.length || 0}
              </Badge>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-gray-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              Direct Messages
            </Button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Servers
              </h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">No servers yet</p>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {dbUser.firstName || dbUser.username}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to connect with your friends?
          </p>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Find Friends
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Server
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </div>

            {/* Friend Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Friend Requests</h3>
              {dbUser.receivedRequests && dbUser.receivedRequests.length > 0 ? (
                <div className="space-y-3">
                  {dbUser.receivedRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={request.sender.avatar} />
                          <AvatarFallback>
                            {request.sender.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">@{request.sender.username}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="ghost">Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No pending requests</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
