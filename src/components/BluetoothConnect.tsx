import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth } from 'lucide-react';

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
  const [isConnected, setIsConnected] = useState(false);

  const connectToDevice = async () => {
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
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  return (
    <Button
      onClick={connectToDevice}
      className={`gap-2 ${isConnected ? 'bg-spotify-green hover:bg-spotify-green/90' : ''}`}
    >
      <Bluetooth className="w-4 h-4" />
      {isConnected ? 'Connected' : 'Connect Heart Rate Monitor'}
    </Button>
  );
};

export default BluetoothConnect;