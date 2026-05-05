export type Coordinates = { lat: number; lng: number; accuracy?: number; source?: 'gps' | 'manual' };
export const isHttpsContext = () => window.isSecureContext;
