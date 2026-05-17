import { useMemo, useState } from 'react';

type Props = {
  qibla: number | null;
  heading: number | null;
  relative: number | null;
  distance: number | null;
  lat?: number;
  lng?: number;
  instruction: string;
};

function formatNumber(value: number | null | undefined, digits = 1) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) : '-';
}

export default function ShareQibla({ qibla, heading, relative, distance, lat, lng, instruction }: Props) {
  const [message, setMessage] = useState('');
  const text = useMemo(() => [
    'Hasil kai-kiblat:',
    `Arah kiblat: ${formatNumber(qibla)}° dari utara`,
    `Heading perangkat: ${formatNumber(heading)}°`,
    `Arah relatif: ${formatNumber(relative)}°`,
    `Instruksi: ${instruction}`,
    `Jarak ke Ka'bah: ${formatNumber(distance)} km`,
    `Koordinat: ${formatNumber(lat, 6)}, ${formatNumber(lng, 6)}`
  ].join('\n'), [distance, heading, instruction, lat, lng, qibla, relative]);

  const share = async () => {
    if (qibla == null || lat == null || lng == null) {
      setMessage('Tentukan lokasi terlebih dahulu sebelum membagikan hasil.');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Hasil kai-kiblat', text });
        setMessage('Hasil kiblat berhasil dibagikan.');
        return;
      }

      await navigator.clipboard.writeText(text);
      setMessage('Hasil kiblat disalin ke clipboard.');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setMessage('Berbagi dibatalkan.');
        return;
      }
      setMessage('Gagal membagikan. Salin manual dari kartu hasil.');
    }
  };

  return <div className='rounded-2xl bg-white p-4 shadow'>
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div>
        <h2 className='text-lg font-extrabold text-primary'>Bagikan hasil arah kiblat</h2>
        <p className='text-sm text-slate-600'>Salin atau kirim bearing, instruksi, jarak, dan koordinat.</p>
      </div>
      <button onClick={share} className='rounded bg-primary px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400' disabled={qibla == null || lat == null || lng == null}>Bagikan/Salin</button>
    </div>
    {message && <p className='mt-2 text-sm text-slate-700'>{message}</p>}
  </div>;
}
