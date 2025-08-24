'use client';

import { Button } from '@/components/ui/button';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Video, Users, MessageCircle, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">


      {/* Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 to-black/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.05),transparent_70%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 mb-6">
            <span className="text-sm font-medium text-zinc-300">Now with end-to-end encryption</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
            Stay Connected While You
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"> Game & Work</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The <span className="text-white font-medium">lightweight</span> video calling app that runs in the background. 
            Chat with friends, make calls, and create spaces without interrupting your workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200">
                  Start Free Today
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Button variant="outline" size="lg" className="px-8 py-6 bg-transparent border-2 border-zinc-700 text-white hover:text-zinc-200 hover:bg-zinc-900 hover:border-zinc-600 rounded-xl font-medium transition-all duration-200">
              Watch Demo
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 shadow-2xl shadow-black/30">
            <div className="text-center group">
              <div className="w-14 h-14  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">HD Video Calls</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Group Spaces</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Real-time Chat</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Gaming Focused</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
