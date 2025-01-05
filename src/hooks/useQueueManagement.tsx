import { useState } from 'react';
import { toast } from 'sonner';
import type { HeartRateZone } from '@/utils/heartRateZones';
import { getPlaylistTracks, queueTrack } from '@/utils/spotifyUtils';

export const useQueueManagement = () => {
  const [nextSong, setNextSong] = useState<any>(null);

  const queueNextSongForZone = async (currentZone: HeartRateZone, playlists: any) => {
    if (!currentZone || !playlists[currentZone]) {
      toast.error('No playlist configured for current zone');
      return;
    }
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      toast.error('Please connect to Spotify first');
      return;
    }

    try {
      const playlistUrl = playlists[currentZone];
      const tracks = await getPlaylistTracks(playlistUrl, token);
      
      if (!tracks || tracks.length === 0) {
        toast.error('No tracks found in playlist');
        return;
      }

      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      await queueTrack(randomTrack.uri, token);
      
      setNextSong({
        ...randomTrack,
        zone: currentZone
      });

      toast.success(`Queued: ${randomTrack.name} by ${randomTrack.artist}`);
    } catch (error) {
      console.error('Error queueing next song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to queue next song';
      toast.error(errorMessage);
      
      if (errorMessage.includes('token expired')) {
        localStorage.removeItem('spotify_access_token');
      }
    }
  };

  return {
    nextSong,
    setNextSong,
    queueNextSongForZone
  };
};