'use client';

import { Button } from '@/components/ui/button';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Communication?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of gamers and remote workers who trust VoiceConnect for their daily communication needs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Get Started Free
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
          <Button size="lg" variant="outline" className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
