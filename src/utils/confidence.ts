import type { CoordinateSource } from './geo';

type ConfidenceInput = {
  hasLocation: boolean;
  heading: number | null;
  accuracy?: number;
  source?: CoordinateSource;
  locationStatus: string;
  compassStatus: string;
};

export type ConfidenceLevel = 'ready' | 'check' | 'fallback';

export type ConfidenceResult = {
  score: number;
  level: ConfidenceLevel;
  label: string;
  tone: string;
  summary: string;
  locationMessage: string;
  compassMessage: string;
  checklist: Array<{ label: string; done: boolean; hint: string }>;
};

function getLocationScore(input: ConfidenceInput) {
  if (!input.hasLocation) return 0;
  if (input.locationStatus === 'Lokasi tidak valid' || input.locationStatus === 'GPS perlu HTTPS') return 20;
  if (input.source === 'manual' || input.source === 'search') return 65;
  if (typeof input.accuracy !== 'number') return 55;
  if (input.accuracy <= 50) return 70;
  if (input.accuracy <= 100) return 60;
  if (input.accuracy <= 250) return 45;
  return 30;
}

function getCompassScore(input: ConfidenceInput) {
  if (input.heading == null) return 0;
  if (input.compassStatus === 'Kompas aktif') return 30;
  if (input.compassStatus === 'Sensor tidak stabil') return 14;
  return 8;
}

function getLocationMessage(input: ConfidenceInput) {
  if (!input.hasLocation) return 'Lokasi belum ditentukan.';
  if (input.source === 'manual') return 'Lokasi dari input manual; pastikan koordinat sudah benar.';
  if (input.source === 'search') return 'Lokasi dari hasil pencarian; cukup untuk estimasi kota/alamat.';
  if (typeof input.accuracy === 'number') {
    if (input.accuracy <= 50) return `GPS akurat sekitar ${Math.round(input.accuracy)} m.`;
    if (input.accuracy <= 100) return `GPS cukup baik sekitar ${Math.round(input.accuracy)} m.`;
    return `Akurasi GPS masih rendah sekitar ${Math.round(input.accuracy)} m.`;
  }
  return 'Lokasi aktif, tetapi akurasi tidak tersedia.';
}

function getCompassMessage(input: ConfidenceInput) {
  if (input.heading == null) return 'Kompas belum aktif; gunakan angka derajat kiblat dari utara.';
  if (input.compassStatus === 'Kompas aktif') return 'Kompas aktif dan siap dipakai.';
  if (input.compassStatus === 'Sensor tidak stabil') return 'Sensor kompas belum stabil; lakukan kalibrasi angka delapan.';
  return 'Kompas terbaca, tetapi status sensor perlu dicek ulang.';
}

export function calculateConfidence(input: ConfidenceInput): ConfidenceResult {
  const score = Math.min(100, getLocationScore(input) + getCompassScore(input));
  const hasUsableLocation = input.hasLocation && input.locationStatus !== 'Lokasi tidak valid';
  const hasStableCompass = input.heading != null && input.compassStatus === 'Kompas aktif';
  const hasAnyCompass = input.heading != null;

  const level: ConfidenceLevel = !hasUsableLocation || !hasAnyCompass || score < 55
    ? 'fallback'
    : hasStableCompass && score >= 85
      ? 'ready'
      : 'check';

  const label = level === 'ready' ? 'Siap dipakai' : level === 'check' ? 'Perlu cek ulang' : 'Gunakan derajat dari utara';
  const tone = level === 'ready'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : level === 'check'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-slate-200 bg-slate-50 text-slate-800';
  const summary = level === 'ready'
    ? 'Lokasi dan kompas cukup baik. Tetap cocokkan dengan penanda kiblat setempat bila tersedia.'
    : level === 'check'
      ? 'Hasil sudah bisa menjadi panduan, tetapi sebaiknya kalibrasi atau cek akurasi lokasi.'
      : 'Arah kiblat tetap dihitung, tetapi putar badan menggunakan angka derajat dari utara/peta karena data sensor belum lengkap.';

  return {
    score,
    level,
    label,
    tone,
    summary,
    locationMessage: getLocationMessage(input),
    compassMessage: getCompassMessage(input),
    checklist: [
      { label: 'Lokasi tersedia', done: hasUsableLocation, hint: 'Aktifkan GPS, cari alamat, atau isi koordinat manual.' },
      { label: 'Akurasi lokasi cukup', done: input.source !== 'gps' || (typeof input.accuracy === 'number' && input.accuracy <= 100), hint: 'Jika GPS rendah, pindah ke area terbuka atau pakai pencarian/manual.' },
      { label: 'Kompas terbaca', done: hasAnyCompass, hint: 'Tekan Aktifkan Kompas dan izinkan akses sensor.' },
      { label: 'Sensor stabil', done: hasStableCompass, hint: 'Gerakkan HP membentuk angka delapan lalu pegang mendatar.' }
    ]
  };
}
