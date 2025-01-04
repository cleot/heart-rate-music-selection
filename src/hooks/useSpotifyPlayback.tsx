import { useSpotifyConnection } from './useSpotifyConnection';
import { usePlaybackControls } from './usePlaybackControls';
import { useQueueManagement } from './useQueueManagement';

export const useSpotifyPlayback = () => {
  const { isSpotifyConnected, currentSong, isPlaying, fetchCurrentPlayback } = useSpotifyConnection();
  const { handlePlayPause, handleNext } = usePlaybackControls(fetchCurrentPlayback);
  const { nextSong, setNextSong, queueNextSongForZone } = useQueueManagement();

  return {
    currentSong,
    nextSong,
    isPlaying,
    isSpotifyConnected,
    handlePlayPause: () => handlePlayPause(isPlaying),
    handleNext,
    queueNextSongForZone,
    setNextSong
  };
};