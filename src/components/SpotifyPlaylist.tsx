import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface PlaylistConfig {
  slow: string;
  medium: string;
  fast: string;
}

interface SpotifyPlaylistProps {
  playlists: PlaylistConfig;
  onPlaylistChange: (zone: keyof PlaylistConfig, value: string) => void;
}

const SpotifyPlaylist: React.FC<SpotifyPlaylistProps> = ({ playlists, onPlaylistChange }) => {
  const { toast } = useToast();
  const [playlistNames, setPlaylistNames] = React.useState<Record<string, string>>({
    slow: '',
    medium: '',
    fast: '',
  });

  const extractPlaylistId = (url: string) => {
    try {
      // Handle both full URLs and just IDs
      if (url.includes('spotify.com')) {
        const matches = url.match(/playlist\/([\w\d]+)/);
        return matches ? matches[1].split('?')[0] : null;
      }
      return url;
    } catch (error) {
      return null;
    }
  };

  const fetchPlaylistName = async (url: string, zone: keyof PlaylistConfig) => {
    if (!url) {
      setPlaylistNames(prev => ({ ...prev, [zone]: '' }));
      return;
    }

    try {
      const playlistId = extractPlaylistId(url);
      if (!playlistId) {
        throw new Error('Invalid playlist URL');
      }

      const token = localStorage.getItem('spotify_access_token');
      if (!token) {
        toast({
          title: "Not Connected",
          description: "Please connect to Spotify first",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetching playlist with ID:', playlistId);
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please reconnect to Spotify",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist (${response.status})`);
      }

      const data = await response.json();
      setPlaylistNames(prev => ({ ...prev, [zone]: data.name }));
      toast({
        title: "Playlist Selected",
        description: `${data.name} set as ${zone} tempo playlist`,
      });
    } catch (error) {
      console.error('Error fetching playlist:', error);
      setPlaylistNames(prev => ({ ...prev, [zone]: '' }));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch playlist information",
        variant: "destructive",
      });
    }
  };

  const handlePlaylistChange = async (zone: keyof PlaylistConfig, value: string) => {
    onPlaylistChange(zone, value);
    await fetchPlaylistName(value, zone);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Spotify Playlists</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Slow (0-100 BPM)</label>
          <Input
            value={playlists.slow}
            onChange={(e) => handlePlaylistChange('slow', e.target.value)}
            placeholder="Playlist URL for slow songs"
            className="mt-1"
          />
          {playlistNames.slow && (
            <p className="text-sm text-green-500 mt-1">Selected: {playlistNames.slow}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-400">Medium (100-120 BPM)</label>
          <Input
            value={playlists.medium}
            onChange={(e) => handlePlaylistChange('medium', e.target.value)}
            placeholder="Playlist URL for medium songs"
            className="mt-1"
          />
          {playlistNames.medium && (
            <p className="text-sm text-green-500 mt-1">Selected: {playlistNames.medium}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-400">Fast (120-160 BPM)</label>
          <Input
            value={playlists.fast}
            onChange={(e) => handlePlaylistChange('fast', e.target.value)}
            placeholder="Playlist URL for fast songs"
            className="mt-1"
          />
          {playlistNames.fast && (
            <p className="text-sm text-green-500 mt-1">Selected: {playlistNames.fast}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyPlaylist;