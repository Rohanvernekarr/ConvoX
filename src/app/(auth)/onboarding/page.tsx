'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Camera, CheckCircle, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(user?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username availability
  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/user/check-username?username=${encodeURIComponent(value)}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(value);
    
    if (value.length >= 3) {
      checkUsername(value);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameAvailable || username.length < 3) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          avatar,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Choose a unique username and set up your avatar</p>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-3">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">Profile Picture</p>
          </div>

          {/* Username Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter unique username"
                className="pr-10"
                minLength={3}
                maxLength={20}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {checkingUsername && (
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            {/* Username Status */}
            <div className="flex items-center gap-2 min-h-[20px]">
              {username.length > 0 && username.length < 3 && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Username must be at least 3 characters
                </Badge>
              )}
              {usernameAvailable === true && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Username available!
                </Badge>
              )}
              {usernameAvailable === false && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  Username already taken
                </Badge>
              )}
            </div>
          </div>

          {/* Avatar URL Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Avatar URL (Optional)
            </label>
            <Input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter avatar URL or use default"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use your profile picture from Google/Twitter
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !usernameAvailable || username.length < 3}
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Setting up your profile...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          By completing setup, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
