export type HeartRateZone = 'slow' | 'medium' | 'fast' | null;

export const getHeartRateZone = (heartRate: number | null): HeartRateZone => {
  if (!heartRate) return null;
  if (heartRate < 100) return 'slow';
  if (heartRate < 120) return 'medium';
  return 'fast';
};