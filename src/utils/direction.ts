export function getDirectionInstruction(relativeQiblaDirection: number): string {
  if (relativeQiblaDirection <= 3 || relativeQiblaDirection >= 357) return 'Anda sedang menghadap kiblat';
  if (relativeQiblaDirection > 180) return `Putar ke kiri ${(360 - relativeQiblaDirection).toFixed(1)}°`;
  return `Putar ke kanan ${relativeQiblaDirection.toFixed(1)}°`;
}
