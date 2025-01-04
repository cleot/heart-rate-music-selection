import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import type { HeartRateZone } from '@/utils/heartRateZones';
import { getPlaylistTracks, queueTrack } from '@/utils/spotifyUtils';

export const useSpotifyPlayback = () => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [nextSong, setNextSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  const fetchCurrentPlayback = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        setCurrentSong({
          name: 'No track playing',
          artist: 'Play a track on Spotify',
        });
        setIsPlaying(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.item) {
          setCurrentSong({
            name: data.item.name,
            artist: data.item.artists.map((artist: any) => artist.name).join(', '),
            albumArt: data.item.album.images[0]?.url,
          });
          setIsPlaying(data.is_playing);
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem('spotify_access_token');
          setIsSpotifyConnected(false);
          setCurrentSong({
            name: 'Connect to Spotify',
            artist: 'Add your credentials to get started',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching current playback:', error);
    }
  };

  const handlePlayPause = async () => {
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
        setIsPlaying(!isPlaying);
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

  const queueNextSongForZone = async (currentZone: HeartRateZone, playlists: any) => {
    if (!currentZone || !playlists[currentZone]) return;
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    try {
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
      setNextSong(randomTrack);

      toast({
        title: "Success",
        description: `Queued: ${randomTrack.name} by ${randomTrack.artist}`,
      });
    } catch (error) {
      console.error('Error queueing next song:', error);
      toast({
        title: "Error",
        description: "Failed to queue next song",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkSpotifyConnection = async () => {
      const token = localStorage.getItem('spotify_access_token');
      setIsSpotifyConnected(!!token);
      if (token) {
        await fetchCurrentPlayback(token);
      } else {
        setCurrentSong({
          name: 'Connect to Spotify',
          artist: 'Add your credentials to get started',
        });
      }
    };

    checkSpotifyConnection();
    const interval = setInterval(checkSpotifyConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentSong,
    nextSong,
    isPlaying,
    isSpotifyConnected,
    handlePlayPause,
    handleNext,
    queueNextSongForZone,
    setNextSong
  };
};