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

    if (!isSignedIn) {
      router.push('/');
      return;
    }

    if (requireOnboarding && needsOnboarding) {
      router.push('/onboarding');
      return;
    }

    if (!requireOnboarding && !needsOnboarding) {
      router.push('/dashboard');
      return;
    }
  }, [isLoaded, isSignedIn, needsOnboarding, loading, router, requireOnboarding]);

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isSignedIn || (requireOnboarding && needsOnboarding) || (!requireOnboarding && !needsOnboarding)) {
    return null;
  }

  return <>{children}</>;
}
