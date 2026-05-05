import { useEffect, useRef, useState } from 'react';
import type { CoordinateSource, Coordinates } from '../utils/geo';
import { isValidCoordinates } from '../utils/geo';

type GeoStatus = 'Siap mencari lokasi' | 'Mencari lokasi' | 'Lokasi aktif' | 'Akurasi rendah' | 'Lokasi ditolak' | 'GPS tidak tersedia' | 'Lokasi tidak valid';
const KEY = 'kai-kiblat:last-location';

function readSavedLocation(): Coordinates | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coordinates;
    return isValidCoordinates(parsed.lat, parsed.lng) ? parsed : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(readSavedLocation);
  const [status, setStatus] = useState<GeoStatus>(coords ? 'Lokasi aktif' : 'Siap mencari lokasi');
  const [error, setError] = useState<string>('');
  const watchRef = useRef<number | null>(null);

  const saveCoords = (next: Coordinates) => {
    setCoords(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Browser private mode or storage quota can block localStorage; live state still works.
    }
  };

  const applyPosition = (pos: GeolocationPosition) => {
    const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, source: 'gps' as const };
    saveCoords(next);
    setError('');
    setStatus(pos.coords.accuracy > 100 ? 'Akurasi rendah' : 'Lokasi aktif');
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('GPS tidak tersedia');
      setError('Browser ini tidak mendukung fitur lokasi. Masukkan koordinat secara manual.');
      return;
    }

    setStatus('Mencari lokasi');
    setError('');
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      () => {
        setStatus('Lokasi ditolak');
        setError('Izin lokasi ditolak atau lokasi gagal didapatkan. Aktifkan izin lokasi, coba lagi, atau masukkan koordinat secara manual.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );

    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = navigator.geolocation.watchPosition(applyPosition, () => void 0, { enableHighAccuracy: true, maximumAge: 2000 });
  };

  useEffect(() => () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); }, []);

  const setManualCoords = (lat: number, lng: number, source: CoordinateSource = 'manual') => {
    if (!isValidCoordinates(lat, lng)) {
      setStatus('Lokasi tidak valid');
      setError('Koordinat tidak valid. Latitude harus -90 sampai 90 dan longitude -180 sampai 180.');
      return false;
    }

    const manual = { lat, lng, source };
    saveCoords(manual);
    setError('');
    setStatus('Lokasi aktif');
    return true;
  };

  return { coords, status, error, locate, setManualCoords };
}
