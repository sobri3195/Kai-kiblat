import { useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../utils/geo';

type GeoStatus = 'Mencari lokasi' | 'Lokasi aktif' | 'Akurasi rendah' | 'Lokasi ditolak' | 'GPS tidak tersedia';
const KEY = 'kai-kiblat:last-location';

export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(() => {
    const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null;
  });
  const [status, setStatus] = useState<GeoStatus>('Mencari lokasi');
  const [error, setError] = useState<string>('');
  const watchRef = useRef<number | null>(null);

  const applyPosition = (pos: GeolocationPosition) => {
    const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, source: 'gps' as const };
    setCoords(next); localStorage.setItem(KEY, JSON.stringify(next));
    setStatus(pos.coords.accuracy > 100 ? 'Akurasi rendah' : 'Lokasi aktif');
  };

  const locate = () => {
    if (!navigator.geolocation) { setStatus('GPS tidak tersedia'); setError('Browser ini tidak mendukung fitur lokasi. Masukkan koordinat secara manual.'); return; }
    setStatus('Mencari lokasi');
    navigator.geolocation.getCurrentPosition(applyPosition, (e) => { setStatus('Lokasi ditolak'); setError('Izin lokasi ditolak. Silakan aktifkan lokasi atau masukkan koordinat secara manual.'); console.error(e); }, { enableHighAccuracy: true, timeout: 10000 });
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = navigator.geolocation.watchPosition(applyPosition, () => void 0, { enableHighAccuracy: true, maximumAge: 2000 });
  };

  useEffect(() => { locate(); return () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); }; }, []);
  const setManualCoords = (lat: number, lng: number) => {
    const manual = { lat, lng, source: 'manual' as const };
    setCoords(manual); localStorage.setItem(KEY, JSON.stringify(manual)); setStatus('Lokasi aktif');
  };
  return { coords, status, error, locate, setManualCoords };
}
