import React, { useState, useEffect } from 'react';
import HeartRateDisplay from '@/components/HeartRateDisplay';
import BluetoothConnect from '@/components/BluetoothConnect';
import SpotifyPlaylist from '@/components/SpotifyPlaylist';
import NowPlaying from '@/components/NowPlaying';
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/utils/spotify';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [zone, setZone] = useState<'slow' | 'medium' | 'fast' | null>(null);
  const [playlists, setPlaylists] = useState({
    slow: '',
    medium: '',
    fast: '',
  });
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  const [currentSong, setCurrentSong] = useState({
    name: 'Connect to Spotify',
    artist: 'Add your credentials to get started',
  });

  const [nextSong, setNextSong] = useState(null);

  const handleHeartRateChange = (newHeartRate: number) => {
    setHeartRate(newHeartRate);
    
    if (newHeartRate < 100) {
      setZone('slow');
    } else if (newHeartRate < 120) {
      setZone('medium');
    } else {
      setZone('fast');
    }
  };

  const handlePlaylistChange = (zone: 'slow' | 'medium' | 'fast', value: string) => {
    setPlaylists(prev => ({
      ...prev,
      [zone]: value
    }));
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
            <BluetoothConnect onHeartRateChange={handleHeartRateChange} />
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
            <NowPlaying currentSong={currentSong} nextSong={nextSong} />
          </div>
          
          <div>
            <SpotifyPlaylist
              playlists={playlists}
              onPlaylistChange={handlePlaylistChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;