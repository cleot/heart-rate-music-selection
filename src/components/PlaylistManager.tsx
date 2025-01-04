import React from 'react';
import { Card } from '@/components/ui/card';
import SpotifyPlaylist from './SpotifyPlaylist';
import { toast } from '@/components/ui/use-toast';
import type { HeartRateZone } from '@/utils/heartRateZones';
import { getPlaylistTracks, queueTrack } from '@/utils/spotifyUtils';

interface PlaylistConfig {
  slow: string;
  medium: string;
  fast: string;
}

interface PlaylistManagerProps {
  playlists: PlaylistConfig;
  onPlaylistChange: (zone: keyof PlaylistConfig, value: string) => void;
  currentZone: HeartRateZone;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onPlaylistChange,
  currentZone,
}) => {
  const handleQueueNextSong = async () => {
    if (!currentZone) return;
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      toast({
        title: "Error",
        description: "Please connect to Spotify first",
        variant: "destructive",
      });
      return;
    }

    try {
      const playlistUrl = playlists[currentZone];
      if (!playlistUrl) {
        toast({
          title: "Warning",
          description: `No playlist set for ${currentZone} zone`,
          variant: "destructive",
        });
        return;
      }

      const tracks = await getPlaylistTracks(playlistUrl, token);
      if (tracks.length === 0) {
        toast({
          title: "Warning",
          description: "No tracks found in playlist",
          variant: "destructive",
        });
        return;
      }

      // Randomly select a track
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      await queueTrack(randomTrack.uri, token);

      toast({
        title: "Success",
        description: `Queued: ${randomTrack.name} by ${randomTrack.artist}`,
      });

      return randomTrack;
    } catch (error) {
      console.error('Error queueing next song:', error);
      toast({
        title: "Error",
        description: "Failed to queue next song",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <SpotifyPlaylist
        playlists={playlists}
        onPlaylistChange={onPlaylistChange}
      />
    </Card>
  );
};

export default PlaylistManager;