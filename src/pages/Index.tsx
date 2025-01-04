import React, { useState, useEffect } from 'react';
import HeartRateDisplay from '@/components/HeartRateDisplay';
import BluetoothConnect from '@/components/BluetoothConnect';
import NowPlaying from '@/components/NowPlaying';
import PlaylistManager from '@/components/PlaylistManager';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getSpotifyAuthUrl } from '@/utils/spotify';
import { useToast } from '@/hooks/use-toast';
import { getHeartRateZone, type HeartRateZone } from '@/utils/heartRateZones';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';

const Index = () => {
  const { toast } = useToast();
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [zone, setZone] = useState<HeartRateZone>(null);
  const [playlists, setPlaylists] = useState({
    slow: 'https://open.spotify.com/playlist/1h0CEZCm6IbFTbxThn6Xcs',
    medium: 'https://open.spotify.com/playlist/62bReXvmroQzQfEUuTNe3Y',
    fast: 'https://open.spotify.com/playlist/5arPxjufbwwMkIu8YGbF5U',
  });
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);

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
    const newZone = getHeartRateZone(heartRate);
    if (newZone !== zone) {
      setZone(newZone);
      if (newZone && isSpotifyConnected && isAutoPlayEnabled) {
        queueNextSongForZone(newZone, playlists);
      }
    }
  }, [heartRate, zone, isSpotifyConnected, playlists, queueNextSongForZone, isAutoPlayEnabled]);

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

  const handleAutoPlayToggle = () => {
    if (!isSpotifyConnected) {
      toast({
        title: "Error",
        description: "Please connect to Spotify first",
        variant: "destructive",
      });
      return;
    }

    if (!playlists.slow || !playlists.medium || !playlists.fast) {
      toast({
        title: "Error",
        description: "Please set up all playlists first",
        variant: "destructive",
      });
      return;
    }

    setIsAutoPlayEnabled(!isAutoPlayEnabled);
    toast({
      title: !isAutoPlayEnabled ? "Auto DJ Started" : "Auto DJ Stopped",
      description: !isAutoPlayEnabled 
        ? "Songs will automatically queue based on your heart rate" 
        : "Automatic song selection has been disabled",
    });

    if (!isAutoPlayEnabled && zone) {
      queueNextSongForZone(zone, playlists);
    }
  };

  const handleTestHeartRateChange = (value: number[]) => {
    setHeartRate(value[0]);
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
          
          <div className="mt-6 max-w-sm mx-auto">
            <Label htmlFor="test-heart-rate" className="text-sm text-gray-400 mb-2 block">
              Test Heart Rate (BPM)
            </Label>
            <Slider
              id="test-heart-rate"
              max={200}
              min={50}
              step={1}
              value={heartRate ? [heartRate] : [80]}
              onValueChange={handleTestHeartRateChange}
              className="my-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <HeartRateDisplay 
              heartRate={heartRate} 
              zone={zone} 
              isAutoPlayEnabled={isAutoPlayEnabled}
              onAutoPlayToggle={handleAutoPlayToggle}
            />
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
