import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';

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
}

const NowPlaying: React.FC<NowPlayingProps> = ({ currentSong, nextSong }) => {
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
            <div>
              <div className="font-semibold">Now Playing</div>
              <div className="text-lg">{currentSong?.name ?? 'Not playing'}</div>
              <div className="text-sm text-gray-400">{currentSong?.artist}</div>
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