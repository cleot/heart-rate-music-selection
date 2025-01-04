import { toast } from '@/components/ui/use-toast';

export const usePlaybackControls = (fetchCurrentPlayback: (token: string) => Promise<void>) => {
  const handlePlayPause = async (isPlaying: boolean) => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    try {
      const endpoint = isPlaying ? 'pause' : 'play';
      const response = await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCurrentPlayback(token);
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
      toast({
        title: "Error",
        description: "Failed to control playback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNext = async () => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTimeout(() => fetchCurrentPlayback(token), 500);
      }
    } catch (error) {
      console.error('Error skipping track:', error);
      toast({
        title: "Error",
        description: "Failed to skip track. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handlePlayPause,
    handleNext
  };
};