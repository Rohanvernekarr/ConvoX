'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface FriendRequestUser {
  id: string;
  username: string;
  avatar?: string;
}

interface FriendRequest {
  id: string;
  sender: FriendRequestUser;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
}

interface DatabaseUser {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isOnline: boolean;
  onboarded: boolean;
  receivedRequests: FriendRequest[];
  friends: FriendRequestUser[];
  lastSeen?: string;
}

export function useCurrentUser() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    const fetchOrCreateUser = async () => {
      try {
        // First try to get the user profile
        const response = await fetch('/api/user/profile');
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setDbUser(data.user);
            return;
          }
        }
        
        // If we get here, either the profile doesn't exist or there was an error
        // Create a new profile
        const userData = {
          email: user.emailAddresses[0]?.emailAddress || '',
          username: user.username || user.firstName?.toLowerCase() || `user_${Math.random().toString(36).substr(2, 8)}`,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatar: user.imageUrl || '',
        };
        
        const createResponse = await fetch('/api/user/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (createResponse.ok) {
          const data = await createResponse.json();
          setDbUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching database user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [user, isLoaded]);

  // Only consider needsOnboarding if user is loaded, not loading, and dbUser exists but onboarded is false
  const needsOnboarding = isLoaded && user && !loading && dbUser && !dbUser.onboarded;

  return {
    clerkUser: user,
    dbUser,
    isLoaded,
    loading,
    isSignedIn: !!user,
    needsOnboarding,
  };
}
