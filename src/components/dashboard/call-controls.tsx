'use client';

import { Button } from '@/components/ui/button';
import { Mic, MicOff, VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

interface CallControlsProps {
  isInCall: boolean;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (videoOn: boolean) => void;
  endCall: () => void;
}

export function CallControls({
  isInCall,
  isMuted,
  setIsMuted,
  isVideoOn,
  setIsVideoOn,
  endCall
}: CallControlsProps) {
  if (!isInCall) return null;

  return (
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
        
        <Button size="sm" variant="destructive" onClick={endCall} className="rounded-full">
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
