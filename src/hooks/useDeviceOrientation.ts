import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeDegree } from '../utils/qibla';

type CompassStatus = 'Kompas aktif' | 'Menunggu izin kompas' | 'Kompas tidak tersedia' | 'Sensor tidak stabil' | 'Izin kompas ditolak';

type PermissionState = 'granted' | 'denied';
type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

function getHeading(event: DeviceOrientationEvent) {
  const webkit = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (typeof webkit === 'number') return normalizeDegree(webkit);
  return typeof event.alpha === 'number' ? normalizeDegree(360 - event.alpha) : null;
}

export function useDeviceOrientation() {
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<CompassStatus>('Menunggu izin kompas');
  const listeningRef = useRef(false);

  const handle = useCallback((event: DeviceOrientationEvent) => {
    const value = getHeading(event);
    if (value == null) return;
    setHeading(value);
    setStatus(event.absolute === false ? 'Sensor tidak stabil' : 'Kompas aktif');
  }, []);

  const enableCompass = useCallback(async () => {
    if (!window.DeviceOrientationEvent) {
      setStatus('Kompas tidak tersedia');
      return;
    }

    try {
      const requestPermission = (DeviceOrientationEvent as DeviceOrientationWithPermission).requestPermission;
      if (requestPermission) {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          setStatus('Izin kompas ditolak');
          return;
        }
      }

      if (!listeningRef.current) {
        window.addEventListener('deviceorientation', handle, true);
        listeningRef.current = true;
      }
      setStatus('Sensor tidak stabil');
    } catch {
      setStatus('Kompas tidak tersedia');
    }
  }, [handle]);

  useEffect(() => () => {
    if (listeningRef.current) window.removeEventListener('deviceorientation', handle, true);
  }, [handle]);

  return { heading, status, enableCompass };
}
