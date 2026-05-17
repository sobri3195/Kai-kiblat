import { useEffect, useRef, useState } from 'react';
import type { CoordinateSource, Coordinates, LocationHistoryItem } from '../utils/geo';
import { isHttpsContext, isValidCoordinates } from '../utils/geo';

type GeoStatus =
  | 'Siap mencari lokasi'
  | 'Memeriksa izin GPS'
  | 'Mencari lokasi'
  | 'Lokasi aktif'
  | 'Akurasi rendah'
  | 'Lokasi ditolak'
  | 'GPS perlu HTTPS'
  | 'GPS tidak tersedia'
  | 'Lokasi tidak valid';

const KEY = 'kai-kiblat:last-location';
const HISTORY_KEY = 'kai-kiblat:location-history';
const MAX_HISTORY = 6;
const HIGH_ACCURACY_OPTIONS: PositionOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
const WATCH_OPTIONS: PositionOptions = { enableHighAccuracy: true, maximumAge: 1000, timeout: 30000 };
const FALLBACK_OPTIONS: PositionOptions = { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 };

function readSavedLocation(): Coordinates | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coordinates;
    return isValidCoordinates(parsed.lat, parsed.lng) ? parsed : null;
  } catch {
    window.localStorage.removeItem(KEY);
    return null;
  }
}


function readLocationHistory(): LocationHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocationHistoryItem[];
    return parsed.filter((item) => isValidCoordinates(item.lat, item.lng)).slice(0, MAX_HISTORY);
  } catch {
    window.localStorage.removeItem(HISTORY_KEY);
    return [];
  }
}

function getHistoryLabel(coords: Coordinates) {
  if (coords.source === 'gps') return 'Lokasi GPS';
  if (coords.source === 'search') return 'Hasil pencarian';
  return 'Lokasi manual';
}

function toHistoryItem(coords: Coordinates): LocationHistoryItem {
  const savedAt = Date.now();
  return {
    ...coords,
    id: `${coords.source ?? 'manual'}-${coords.lat.toFixed(5)}-${coords.lng.toFixed(5)}-${savedAt}`,
    label: getHistoryLabel(coords),
    savedAt
  };
}

function getGeolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Izin lokasi ditolak. Buka pengaturan browser, izinkan lokasi untuk situs ini, lalu tekan Refresh Lokasi.';
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'GPS belum menemukan posisi. Aktifkan GPS/perizinan lokasi di perangkat, matikan mode hemat baterai, lalu coba di area terbuka.';
  }

  if (error.code === error.TIMEOUT) {
    return 'GPS terlalu lama mendapatkan lokasi. Coba lagi di dekat jendela/area terbuka, atau gunakan input/cari lokasi.';
  }

  return error.message || 'Lokasi gagal didapatkan. Coba lagi atau masukkan koordinat secara manual.';
}

export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(readSavedLocation);
  const [history, setHistory] = useState<LocationHistoryItem[]>(readLocationHistory);
  const [status, setStatus] = useState<GeoStatus>(coords ? 'Lokasi aktif' : 'Siap mencari lokasi');
  const [error, setError] = useState<string>('');
  const watchRef = useRef<number | null>(null);

  const saveCoords = (next: Coordinates) => {
    setCoords(next);
    setHistory((current) => {
      const withoutDuplicate = current.filter((item) => Math.abs(item.lat - next.lat) > 0.0001 || Math.abs(item.lng - next.lng) > 0.0001 || item.source !== next.source);
      const updated = [toHistoryItem(next), ...withoutDuplicate].slice(0, MAX_HISTORY);
      try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // Browser private mode or storage quota can block localStorage; live state still works.
      }
      return updated;
    });
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Browser private mode or storage quota can block localStorage; live state still works.
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      window.localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Browser private mode or storage quota can block localStorage; live state still works.
    }
  };

  const stopWatching = () => {
    if (watchRef.current != null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  };

  const applyPosition = (pos: GeolocationPosition) => {
    const next = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      source: 'gps' as const
    };

    saveCoords(next);
    setError('');
    setStatus(pos.coords.accuracy > 100 ? 'Akurasi rendah' : 'Lokasi aktif');
  };

  const startWatching = () => {
    stopWatching();
    watchRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      (geoError) => {
        setStatus(geoError.code === geoError.PERMISSION_DENIED ? 'Lokasi ditolak' : 'Mencari lokasi');
        setError(getGeolocationErrorMessage(geoError));
      },
      WATCH_OPTIONS
    );
  };

  const locate = async () => {
    if (!isHttpsContext()) {
      setStatus('GPS perlu HTTPS');
      setError('GPS browser hanya berjalan di HTTPS atau localhost. Buka aplikasi melalui HTTPS/Vercel agar lokasi bisa aktif.');
      return;
    }

    if (!navigator.geolocation) {
      setStatus('GPS tidak tersedia');
      setError('Browser/perangkat ini tidak mendukung fitur lokasi. Masukkan koordinat secara manual.');
      return;
    }

    setStatus('Memeriksa izin GPS');
    setError('');

    if (navigator.permissions?.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setStatus('Lokasi ditolak');
          setError('Izin lokasi untuk situs ini sedang diblokir. Ubah izin lokasi di pengaturan browser, lalu tekan Refresh Lokasi.');
          return;
        }
      } catch {
        // Some browsers do not expose geolocation permission details; continue with the native prompt.
      }
    }

    setStatus('Mencari lokasi');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyPosition(position);
        startWatching();
      },
      (geoError) => {
        if (geoError.code === geoError.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              applyPosition(fallbackPosition);
              startWatching();
            },
            (fallbackError) => {
              setStatus(fallbackError.code === fallbackError.PERMISSION_DENIED ? 'Lokasi ditolak' : 'GPS tidak tersedia');
              setError(getGeolocationErrorMessage(fallbackError));
            },
            FALLBACK_OPTIONS
          );
          return;
        }

        setStatus(geoError.code === geoError.PERMISSION_DENIED ? 'Lokasi ditolak' : 'GPS tidak tersedia');
        setError(getGeolocationErrorMessage(geoError));
      },
      HIGH_ACCURACY_OPTIONS
    );
  };

  useEffect(() => () => stopWatching(), []);

  const setManualCoords = (lat: number, lng: number, source: CoordinateSource = 'manual') => {
    if (!isValidCoordinates(lat, lng)) {
      setStatus('Lokasi tidak valid');
      setError('Koordinat tidak valid. Latitude harus -90 sampai 90 dan longitude -180 sampai 180.');
      return false;
    }

    stopWatching();
    const manual = { lat, lng, source };
    saveCoords(manual);
    setError('');
    setStatus('Lokasi aktif');
    return true;
  };

  return { coords, status, error, history, locate, setManualCoords, clearHistory };
}
