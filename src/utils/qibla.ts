export const KAABA_COORD = { lat: 21.422487, lng: 39.826206 };
const toRad = (d: number) => (d * Math.PI) / 180;
export const normalizeDegree = (degree: number) => ((degree % 360) + 360) % 360;

export function calculateQiblaBearing(userLat: number, userLng: number) {
  const phi1 = toRad(userLat);
  const phi2 = toRad(KAABA_COORD.lat);
  const dLambda = toRad(KAABA_COORD.lng - userLng);
  const theta = Math.atan2(
    Math.sin(dLambda) * Math.cos(phi2),
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda)
  );
  return normalizeDegree((theta * 180) / Math.PI);
}

export function calculateDistanceToKaaba(userLat: number, userLng: number) {
  const R = 6371;
  const dLat = toRad(KAABA_COORD.lat - userLat);
  const dLng = toRad(KAABA_COORD.lng - userLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(userLat)) * Math.cos(toRad(KAABA_COORD.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
