import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    zone?: 'slow' | 'medium' | 'fast';
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
  const getZoneColor = (zone?: string) => {
    switch (zone) {
      case 'slow':
        return 'bg-zones-slow';
      case 'medium':
        return 'bg-zones-medium';
      case 'fast':
        return 'bg-zones-fast';
      default:
        return 'bg-gray-500';
    }
  };

  const getZoneLabel = (zone?: string) => {
    switch (zone) {
      case 'slow':
        return 'Slow (0-100 BPM)';
      case 'medium':
        return 'Medium (100-120 BPM)';
      case 'fast':
        return 'Fast (120-160 BPM)';
      default:
        return 'Unknown Zone';
    }
  };

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
        <Card className="w-full bg-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {nextSong.albumArt ? (
                <img
                  src={nextSong.albumArt}
                  alt="Album art"
                  className="w-12 h-12 rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-black/20 rounded-md flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-semibold text-sm text-muted-foreground">Up Next</div>
                <div className="text-foreground">{nextSong.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{nextSong.artist}</span>
                  {nextSong.zone && (
                    <Badge className={`${getZoneColor(nextSong.zone)} text-white`}>
                      {getZoneLabel(nextSong.zone)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NowPlaying;