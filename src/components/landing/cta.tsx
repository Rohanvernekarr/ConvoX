'use client';

import { Button } from '@/components/ui/button';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-zinc-950 to-zinc-950 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 mb-6">
          <span className="text-sm font-medium text-zinc-300">Join the community</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-indigo-300">Communication?</span>
        </h2>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of gamers and remote workers who trust ConvoX for their daily communication needs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="px-8 py-6 bg-gradient-to-r from-zinc-600 to-zinc-900 hover:from-zinc-700 hover:to-zinc-950 text-white font-medium rounded-xl border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                Get Started Free
              </Button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="px-8 py-6 bg-gradient-to-r from-zinc-600 to-zinc-900 hover:from-zinc-700 hover:to-zinc-950 text-white font-medium rounded-xl border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 bg-transparent border-2 border-zinc-700 text-white hover:text-zinc-200 hover:bg-zinc-800/50 hover:border-zinc-600 rounded-xl font-medium transition-all duration-200"
          >
            Contact Sales
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-zinc-500">No credit card required • Cancel anytime</p>
      </div>
    </section>
  );
}
