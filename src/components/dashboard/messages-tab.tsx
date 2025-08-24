'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';

interface MessagesTabProps {
  activeChatUser: any;
  messages: any[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  sendMessage: () => void;
  isInCall: boolean;
  dbUser: any;
}

export function MessagesTab({
  activeChatUser,
  messages,
  currentMessage,
  setCurrentMessage,
  sendMessage,
  isInCall,
  dbUser
}: MessagesTabProps) {
  if (!activeChatUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No conversation selected</h3>
          <p className="text-zinc-400">Choose a friend from your friends list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
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
    </div>
  );
}
