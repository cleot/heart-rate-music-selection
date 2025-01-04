import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Add Web Bluetooth API types
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    gatt?: {
      connect(): Promise<BluetoothRemoteGATTServer>;
    };
  }

  interface BluetoothRemoteGATTServer {
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(
      type: string,
      listener: EventListener
    ): void;
  }

  interface RequestDeviceOptions {
    filters: Array<{ services?: string[] }>;
  }
}

interface BluetoothConnectProps {
  onHeartRateChange: (heartRate: number) => void;
}

const BluetoothConnect: React.FC<BluetoothConnectProps> = ({ onHeartRateChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if Web Bluetooth API is supported
    if (!navigator.bluetooth) {
      setIsSupported(false);
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Bluetooth connections. Please use Chrome on desktop or Android.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const connectToDevice = async () => {
    if (!isSupported) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Bluetooth connections. Please use Chrome on desktop or Android.",
        variant: "destructive",
      });
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('heart_rate');
      const characteristic = await service?.getCharacteristic('heart_rate_measurement');

      await characteristic?.startNotifications();
      characteristic?.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const heartRate = value.getUint8(1);
        onHeartRateChange(heartRate);
      });

      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Successfully connected to heart rate monitor.",
      });
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to heart rate monitor.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={connectToDevice}
      className={`gap-2 ${isConnected ? 'bg-spotify-green hover:bg-spotify-green/90' : ''}`}
      disabled={!isSupported}
    >
      <Bluetooth className="w-4 h-4" />
      {isConnected ? 'Connected' : 'Connect Heart Rate Monitor'}
    </Button>
  );
};

export default BluetoothConnect;
