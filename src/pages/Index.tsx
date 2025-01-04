import React, { useState, useEffect } from 'react';
import HeartRateDisplay from '@/components/HeartRateDisplay';
import BluetoothConnect from '@/components/BluetoothConnect';
import NowPlaying from '@/components/NowPlaying';
import PlaylistManager from '@/components/PlaylistManager';
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/utils/spotify';
import { useToast } from '@/hooks/use-toast';
import { getHeartRateZone, type HeartRateZone } from '@/utils/heartRateZones';

const Index = () => {
  const { toast } = useToast();
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [zone, setZone] = useState<HeartRateZone>(null);
  const [playlists, setPlaylists] = useState({
    slow: '',
    medium: '',
    fast: '',
  });
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [nextSong, setNextSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  useEffect(() => {
    // Update zone when heart rate changes
    const newZone = getHeartRateZone(heartRate);
    if (newZone !== zone) {
      setZone(newZone);
      // Queue a new song when zone changes
      if (newZone && isSpotifyConnected) {
        queueNextSongForZone(newZone);
      }
    }
  }, [heartRate]);

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

  const queueNextSongForZone = async (currentZone: HeartRateZone) => {
    if (!currentZone || !playlists[currentZone]) return;
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    try {
      const nextTrack = await handleQueueNextSong(currentZone, token);
      if (nextTrack) {
        setNextSong(nextTrack);
      }
    } catch (error) {
      console.error('Error queueing next song:', error);
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
        // Queue next song based on current heart rate zone
        if (zone) {
          queueNextSongForZone(zone);
        }
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

  const handleSpotifyLogin = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Heart Rate Music Selector</h1>
          <div className="flex justify-center gap-4">
            <BluetoothConnect onHeartRateChange={setHeartRate} />
            {!isSpotifyConnected && (
              <Button 
                onClick={handleSpotifyLogin}
                className="bg-green-500 hover:bg-green-600"
              >
                Connect Spotify
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <HeartRateDisplay heartRate={heartRate} zone={zone} />
            <NowPlaying 
              currentSong={currentSong} 
              nextSong={nextSong}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              isPlaying={isPlaying}
            />
          </div>
          
          <div>
            <PlaylistManager
              playlists={playlists}
              onPlaylistChange={(zone, value) => setPlaylists(prev => ({ ...prev, [zone]: value }))}
              currentZone={zone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;