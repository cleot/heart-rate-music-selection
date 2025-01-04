import { useState, useEffect } from 'react';

export const useSpotifyConnection = () => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    isSpotifyConnected,
    currentSong,
    isPlaying,
    fetchCurrentPlayback
  };
};