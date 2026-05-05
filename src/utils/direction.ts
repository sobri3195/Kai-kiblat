export function getDirectionInstruction(relativeQiblaDirection: number | null, hasLocation = true, hasHeading = true): string {
  if (!hasLocation) return 'Tentukan lokasi terlebih dahulu';
  if (!hasHeading || relativeQiblaDirection == null) return 'Aktifkan kompas atau gunakan derajat kiblat dari utara';
  if (relativeQiblaDirection <= 3 || relativeQiblaDirection >= 357) return 'Anda sedang menghadap kiblat';
  if (relativeQiblaDirection > 180) return `Putar ke kiri ${(360 - relativeQiblaDirection).toFixed(1)}°`;
  return `Putar ke kanan ${relativeQiblaDirection.toFixed(1)}°`;
}
