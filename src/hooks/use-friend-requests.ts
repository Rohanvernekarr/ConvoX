'use client';

import { useState, useEffect } from 'react';

interface FriendRequest {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export function useFriendRequests(dbUser: any, socket: any) {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  useEffect(() => {
    if (dbUser) {
      fetchFriendRequests();
    }
  }, [dbUser]);

  const searchFriends = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data.users || []);
        if (data.users.length === 0) {
          alert(`No users found matching "${searchTerm}"`);
        }
      } else {
        alert(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search network error:', error);
      alert('Network error during search');
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Emit socket event for real-time notification
        if (socket) {
          socket.emit('send-friend-request', {
            senderId: dbUser.id,
            receiverId: userId,
            senderUsername: dbUser.username,
          });
        }

        alert('Friend request sent!');
        setSearchResults([]);
        setSearchTerm('');
        setShowAddFriendDialog(false);
      } else {
        alert(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Network error. Please try again.');
    }
  };

  const respondToFriendRequest = async (requestId: string, accepted: boolean) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: accepted ? 'accept' : 'decline' }),
      });

      if (response.ok) {
        // Emit socket event for real-time notification
        if (socket) {
          const request = friendRequests.find(r => r.id === requestId);
          if (request) {
            socket.emit('respond-friend-request', {
              requestId: requestId,
              senderId: request.senderId,
              receiverId: dbUser.id,
              accepted: accepted,
              responderUsername: dbUser.username,
            });
          }
        }

        fetchFriendRequests();
        alert(`Friend request ${accepted ? 'accepted' : 'declined'}!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to respond to friend request');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      alert('Network error. Please try again.');
    }
  };

  return {
    friendRequests,
    sendFriendRequest,
    respondToFriendRequest,
    searchFriends,
    searchResults,
    searchTerm,
    setSearchTerm,
    showAddFriendDialog,
    setShowAddFriendDialog,
    fetchFriendRequests
  };
}
