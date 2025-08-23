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
        let response = await fetch('/api/user/profile');
        
        // If profile doesn't exist, create one
        if (response.status === 404) {
          const userData = {
            email: user.emailAddresses[0]?.emailAddress || '',
            username: user.username || user.firstName?.toLowerCase() || `user_${Math.random().toString(36).substr(2, 8)}`,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            avatar: user.imageUrl || '',
          };
          
          response = await fetch('/api/user/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
        }
        
        if (response.ok) {
          const data = await response.json();
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

  // Only consider needsOnboarding after we've finished loading the user data
  const needsOnboarding = isLoaded && user && !loading && !dbUser;

  return {
    clerkUser: user,
    dbUser,
    isLoaded,
    loading,
    isSignedIn: !!user,
    needsOnboarding,
  };
}
