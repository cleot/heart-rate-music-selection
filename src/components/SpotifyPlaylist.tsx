import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
            onChange={(e) => onPlaylistChange('slow', e.target.value)}
            placeholder="Playlist URL for slow songs"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Medium (100-120 BPM)</label>
          <Input
            value={playlists.medium}
            onChange={(e) => onPlaylistChange('medium', e.target.value)}
            placeholder="Playlist URL for medium songs"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Fast (120-160 BPM)</label>
          <Input
            value={playlists.fast}
            onChange={(e) => onPlaylistChange('fast', e.target.value)}
            placeholder="Playlist URL for fast songs"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyPlaylist;