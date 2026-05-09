export type CoordinateSource = 'gps' | 'manual' | 'search';

export type Coordinates = {
  lat: number;
  lng: number;
  accuracy?: number;
  source?: CoordinateSource;
};

export function isHttpsContext() {
  if (typeof window === 'undefined') return false;
  return window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

export function isValidLatitude(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function isValidCoordinates(lat: number, lng: number) {
  return isValidLatitude(lat) && isValidLongitude(lng);
}

export function formatCoordinate(value?: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(6) : '-';
}
