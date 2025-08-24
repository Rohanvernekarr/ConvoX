'use client';

import { Button } from '@/components/ui/button';
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  SignedIn, 
  SignedOut 
} from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center ">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-zinc-500 to-zinc-900 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-serif  text-xl">C</span>
              </div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-indigo-300">ConvoX-Org</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2  backdrop-blur-sm px-3 py-2 ">
            <Link href="#features" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-full transition-all duration-200">
              Features
            </Link>
            <Link href="#pricing" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-full transition-all duration-200">
              Pricing
            </Link>
            <Link href="#about" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-full transition-all duration-200">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-zinc-600 to-zinc-900 hover:from-zinc-700 hover:to-zinc-950 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600 hover:text-white transition-colors">
                  Dashboard
                </Button>
              </Link>
              <div className="ml-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-9 h-9',
                      userButtonPopoverCard: 'bg-zinc-800 border border-zinc-700/50',
                      userPreviewMainIdentifier: 'text-white',
                      userPreviewSecondaryIdentifier: 'text-zinc-400',
                      userButtonPopoverActionButtonText: 'text-zinc-300 hover:bg-zinc-700/50',
                      userButtonPopoverActionButtonIcon: 'text-zinc-400',
                      userButtonPopoverFooter: 'hidden'
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
