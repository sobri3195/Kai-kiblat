import { useEffect, useState } from 'react';
import { normalizeDegree } from '../utils/qibla';

type CompassStatus = 'Kompas aktif' | 'Menunggu izin kompas' | 'Kompas tidak tersedia' | 'Sensor tidak stabil';

export function useDeviceOrientation() {
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<CompassStatus>('Menunggu izin kompas');

  const handle = (event: DeviceOrientationEvent) => {
    const webkit = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
    const value = typeof webkit === 'number' ? webkit : (typeof event.alpha === 'number' ? normalizeDegree(360 - event.alpha) : null);
    if (value == null) return;
    setHeading(value);
    setStatus(event.absolute === false ? 'Sensor tidak stabil' : 'Kompas aktif');
  };

  const enableCompass = async () => {
    if (!window.DeviceOrientationEvent) { setStatus('Kompas tidak tersedia'); return; }
    const req = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> }).requestPermission;
    if (req) {
      const p = await req();
      if (p !== 'granted') { setStatus('Menunggu izin kompas'); return; }
    }
    window.addEventListener('deviceorientation', handle, true);
  };

  useEffect(() => () => window.removeEventListener('deviceorientation', handle, true), []);
  return { heading, status, enableCompass };
}
