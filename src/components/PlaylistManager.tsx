import React from 'react';
import { Card } from '@/components/ui/card';
import SpotifyPlaylist from './SpotifyPlaylist';
import type { HeartRateZone } from '@/utils/heartRateZones';

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