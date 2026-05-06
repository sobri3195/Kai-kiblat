import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeDegree } from '../utils/qibla';

type CompassStatus = 'Kompas aktif' | 'Menunggu izin kompas' | 'Kompas tidak tersedia' | 'Sensor tidak stabil' | 'Izin kompas ditolak';

type PermissionState = 'granted' | 'denied';
type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

type DeviceOrientationWithCompassHeading = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

const DEVICE_ORIENTATION_EVENTS = ['deviceorientation', 'deviceorientationabsolute'] as const;

function getScreenOrientationAngle() {
  if (typeof window === 'undefined') return 0;
  const screenAngle = window.screen.orientation?.angle;
  if (typeof screenAngle === 'number') return screenAngle;
  const legacyOrientation = (window as Window & { orientation?: number }).orientation;
  return typeof legacyOrientation === 'number' ? legacyOrientation : 0;
}

function getHeading(event: DeviceOrientationEvent) {
  const webkit = (event as DeviceOrientationWithCompassHeading).webkitCompassHeading;
  if (typeof webkit === 'number') return normalizeDegree(webkit);
  if (typeof event.alpha !== 'number') return null;

  // Android/Chromium exposes alpha as clockwise rotation from north while the
  // phone is flat. Convert it to a compass heading and compensate for the
  // current screen orientation so the app follows the visible top of the phone,
  // not only the physical portrait top edge.
  return normalizeDegree(360 - event.alpha + getScreenOrientationAngle());
}

export function useDeviceOrientation() {
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<CompassStatus>('Menunggu izin kompas');
  const listeningRef = useRef(false);
  const lastHeadingRef = useRef<number | null>(null);

  const handle = useCallback((event: DeviceOrientationEvent) => {
    const value = getHeading(event);
    if (value == null) return;

    const previous = lastHeadingRef.current;
    const smoothed = previous == null
      ? value
      : normalizeDegree(previous + (((value - previous + 540) % 360) - 180) * 0.35);

    lastHeadingRef.current = smoothed;
    setHeading(smoothed);
    setStatus(event.absolute === false && !(event as DeviceOrientationWithCompassHeading).webkitCompassHeading ? 'Sensor tidak stabil' : 'Kompas aktif');
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
        DEVICE_ORIENTATION_EVENTS.forEach((eventName) => {
          window.addEventListener(eventName, handle, true);
        });
        listeningRef.current = true;
      }
      setStatus('Sensor tidak stabil');
    } catch {
      setStatus('Kompas tidak tersedia');
    }
  }, [handle]);

  useEffect(() => () => {
    if (!listeningRef.current) return;
    DEVICE_ORIENTATION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, handle, true);
    });
  }, [handle]);

  return { heading, status, enableCompass };
}
