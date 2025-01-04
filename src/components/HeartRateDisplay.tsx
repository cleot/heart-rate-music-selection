import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Play, Square } from 'lucide-react';

interface HeartRateDisplayProps {
  heartRate: number | null;
  zone: 'slow' | 'medium' | 'fast' | null;
  isAutoPlayEnabled: boolean;
  onAutoPlayToggle: () => void;
  onQueueSong?: () => void;
}

const HeartRateDisplay: React.FC<HeartRateDisplayProps> = ({
  heartRate,
  zone,
  isAutoPlayEnabled,
  onAutoPlayToggle,
  onQueueSong
}) => {
  const getZoneColor = (zone: string | null) => {
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

  const getZoneLabel = (zone: string | null) => {
    switch (zone) {
      case 'slow':
        return 'Slow (0-100 BPM)';
      case 'medium':
        return 'Medium (100-120 BPM)';
      case 'fast':
        return 'Fast (120-160 BPM)';
      default:
        return 'No Zone';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold">
                {heartRate ?? '--'}
              </span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${getZoneColor(zone)} text-white`}>
            {getZoneLabel(zone)}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onAutoPlayToggle}
              variant="default"
              className="flex items-center gap-2"
            >
              {isAutoPlayEnabled ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlayEnabled ? 'Stop' : 'Start'}
            </Button>
            <Button
              onClick={onQueueSong}
              variant="secondary"
              className="flex items-center gap-2"
              disabled={!zone}
            >
              Queue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeartRateDisplay;