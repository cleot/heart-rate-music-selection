import React from 'react';
import { Heart } from 'lucide-react';

interface HeartRateDisplayProps {
  heartRate: number | null;
  zone: 'slow' | 'medium' | 'fast' | null;
}

const HeartRateDisplay: React.FC<HeartRateDisplayProps> = ({ heartRate, zone }) => {
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
    </div>
  );
};

export default HeartRateDisplay;