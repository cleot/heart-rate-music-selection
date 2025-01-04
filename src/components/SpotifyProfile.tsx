import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpotifyUser {
  display_name: string;
  images: { url: string }[];
}

const SpotifyProfile = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else if (response.status === 401) {
          // Token expired
          localStorage.removeItem('spotify_access_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "Successfully disconnected from Spotify",
    });
    // Reload the page to reset the app state
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 bg-spotify-black/10 p-3 rounded-lg">
      <Avatar>
        <AvatarImage src={user.images[0]?.url} />
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{user.display_name}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="ml-2"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default SpotifyProfile;