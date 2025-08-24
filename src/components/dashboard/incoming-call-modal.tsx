'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallModalProps {
  incomingCall: any;
  acceptCall: () => void;
  declineCall: () => void;
}

export function IncomingCallModal({ incomingCall, acceptCall, declineCall }: IncomingCallModalProps) {
  if (!incomingCall) return null;

  return (
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
            <Button className="bg-red-600 hover:bg-red-700" onClick={declineCall}>
              <PhoneOff className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={acceptCall}>
              <Phone className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
