import React, { useState, useEffect } from 'react';
import HeartRateDisplay from '@/components/HeartRateDisplay';
import BluetoothConnect from '@/components/BluetoothConnect';
import NowPlaying from '@/components/NowPlaying';
import PlaylistManager from '@/components/PlaylistManager';
import { Button } from '@/components/ui/button';
import { getSpotifyAuthUrl } from '@/utils/spotify';
import { useToast } from '@/hooks/use-toast';
import { getHeartRateZone, type HeartRateZone } from '@/utils/heartRateZones';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';

const Index = () => {
  const { toast } = useToast();
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [zone, setZone] = useState<HeartRateZone>(null);
  const [playlists, setPlaylists] = useState({
    slow: '',
    medium: '',
    fast: '',
  });

  const {
    currentSong,
    nextSong,
    isPlaying,
    isSpotifyConnected,
    handlePlayPause,
    handleNext,
    queueNextSongForZone
  } = useSpotifyPlayback();

  useEffect(() => {
    // Update zone when heart rate changes
    const newZone = getHeartRateZone(heartRate);
    if (newZone !== zone) {
      setZone(newZone);
      // Queue a new song when zone changes
      if (newZone && isSpotifyConnected) {
        queueNextSongForZone(newZone, playlists);
      }
    }
  }, [heartRate, zone, isSpotifyConnected, playlists, queueNextSongForZone]);

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