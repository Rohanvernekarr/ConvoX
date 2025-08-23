'use client';

import { Button } from '@/components/ui/button';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Video, Users, MessageCircle, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stay Connected While You
            <span className="text-blue-600"> Game & Work</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The lightweight video calling app that runs in the background. 
            Chat with friends, make calls, and create spaces without interrupting your workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="px-8 py-3">
                  Start Free Today
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">HD Video Calls</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">Group Spaces</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">Real-time Chat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">Gaming Focused</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
