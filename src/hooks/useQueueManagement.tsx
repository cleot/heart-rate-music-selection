import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import type { HeartRateZone } from '@/utils/heartRateZones';
import { getPlaylistTracks, queueTrack } from '@/utils/spotifyUtils';

export const useQueueManagement = () => {
  const [nextSong, setNextSong] = useState<any>(null);

  const queueNextSongForZone = async (currentZone: HeartRateZone, playlists: any) => {
    if (!currentZone || !playlists[currentZone]) return;
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    try {
      const deviceResponse = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (deviceResponse.status === 204) {
        toast({
          title: "No Active Device",
          description: "Please start playing music in Spotify first",
          variant: "destructive",
        });
        return;
      }

      const playlistUrl = playlists[currentZone];
      const tracks = await getPlaylistTracks(playlistUrl, token);
      
      if (tracks.length === 0) {
        toast({
          title: "Warning",
          description: "No tracks found in playlist",
          variant: "destructive",
        });
        return;
      }

      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      await queueTrack(randomTrack.uri, token);
      setNextSong({
        ...randomTrack,
        zone: currentZone
      });

      toast({
        title: "Success",
        description: `Queued: ${randomTrack.name} by ${randomTrack.artist}`,
      });
    } catch (error) {
      console.error('Error queueing next song:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to queue next song",
        variant: "destructive",
      });
    }
  };

  return {
    nextSong,
    setNextSong,
    queueNextSongForZone
  };
};