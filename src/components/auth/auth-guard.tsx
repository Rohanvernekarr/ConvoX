'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function AuthGuard({ children, requireOnboarding = true }: AuthGuardProps) {
  const { isLoaded, isSignedIn, needsOnboarding, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || loading) return;

    console.log('AuthGuard state:', {
      isLoaded,
      isSignedIn,
      needsOnboarding,
      loading,
      requireOnboarding
    });

    if (!isSignedIn) {
      console.log('User not signed in, redirecting to home');
      router.push('/');
      return;
    }

    if (requireOnboarding && needsOnboarding) {
      console.log('User needs onboarding, redirecting');
      router.push('/onboarding');
      return;
    }

    if (!requireOnboarding && needsOnboarding) {
      console.log('User accessing dashboard but needs onboarding');
      router.push('/onboarding');
      return;
    }
  }, [isLoaded, isSignedIn, needsOnboarding, loading, router, requireOnboarding]);

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isSignedIn || (requireOnboarding && needsOnboarding) || (!requireOnboarding && needsOnboarding)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
