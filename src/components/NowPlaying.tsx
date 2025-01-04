import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NowPlayingProps {
  currentSong: {
    name: string;
    artist: string;
    albumArt?: string;
  } | null;
  nextSong: {
    name: string;
    artist: string;
    albumArt?: string;
  } | null;
  onPlayPause?: () => void;
  onNext?: () => void;
  isPlaying?: boolean;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ 
  currentSong, 
  nextSong, 
  onPlayPause,
  onNext,
  isPlaying = false
}) => {
  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {currentSong?.albumArt ? (
              <img
                src={currentSong.albumArt}
                alt="Album art"
                className="w-16 h-16 rounded-md"
              />
            ) : (
              <div className="w-16 h-16 bg-black/20 rounded-md flex items-center justify-center">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold">Now Playing</div>
              <div className="text-lg">{currentSong?.name ?? 'Not playing'}</div>
              <div className="text-sm text-gray-400">{currentSong?.artist}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
                disabled={!currentSong || currentSong.name === 'Connect to Spotify'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={!currentSong || currentSong.name === 'Connect to Spotify'}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextSong && (
        <Card className="w-full bg-black/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {nextSong.albumArt ? (
                <img
                  src={nextSong.albumArt}
                  alt="Album art"
                  className="w-12 h-12 rounded-md opacity-70"
                />
              ) : (
                <div className="w-12 h-12 bg-black/20 rounded-md flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-semibold text-sm text-gray-400">Up Next</div>
                <div>{nextSong.name}</div>
                <div className="text-sm text-gray-400">{nextSong.artist}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NowPlaying;