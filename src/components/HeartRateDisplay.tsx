import React from 'react';
import { Heart, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeartRateDisplayProps {
  heartRate: number | null;
  zone: 'slow' | 'medium' | 'fast' | null;
  isAutoPlayEnabled: boolean;
  onAutoPlayToggle: () => void;
}

const HeartRateDisplay: React.FC<HeartRateDisplayProps> = ({ 
  heartRate, 
  zone,
  isAutoPlayEnabled,
  onAutoPlayToggle
}) => {
  const getZoneColor = () => {
    switch (zone) {
      case 'slow':
        return 'text-zones-slow';
      case 'medium':
        return 'text-zones-medium';
      case 'fast':
        return 'text-zones-fast';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-black/20 backdrop-blur-sm">
      <Heart className={`w-16 h-16 ${getZoneColor()} animate-pulse`} />
      <div className={`text-6xl font-bold mt-4 ${getZoneColor()}`}>
        {heartRate ?? '--'}
      </div>
      <div className="text-xl text-gray-400 mt-2">BPM</div>
      {zone && (
        <div className={`mt-2 text-lg capitalize ${getZoneColor()}`}>
          {zone} Zone
        </div>
      )}
      <div className="mt-6">
        <Button
          onClick={onAutoPlayToggle}
          variant={isAutoPlayEnabled ? "destructive" : "default"}
          className="gap-2"
        >
          {isAutoPlayEnabled ? (
            <>
              <Square className="h-4 w-4" />
              Stop Auto DJ
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Auto DJ
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HeartRateDisplay;