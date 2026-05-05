import { useState } from 'react';
import { isValidLatitude, isValidLongitude } from '../utils/geo';

export default function ManualLocationInput({ onSet }: { onSet: (lat: number, lng: number) => boolean }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [message, setMessage] = useState('');

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const isValid = isValidLatitude(parsedLat) && isValidLongitude(parsedLng);

  return <form className='grid gap-2' onSubmit={(e) => {
    e.preventDefault();
    if (!isValid) {
      setMessage('Masukkan latitude -90 s.d. 90 dan longitude -180 s.d. 180.');
      return;
    }

    const saved = onSet(parsedLat, parsedLng);
    setMessage(saved ? 'Lokasi manual tersimpan.' : 'Koordinat tidak valid.');
  }}>
    <div className='grid gap-2 sm:grid-cols-2'>
      <label className='grid gap-1 text-sm font-medium'>Latitude
        <input className='rounded border p-2 font-normal' inputMode='decimal' placeholder='Contoh: -6.200000' value={lat} onChange={(e) => setLat(e.target.value)} />
      </label>
      <label className='grid gap-1 text-sm font-medium'>Longitude
        <input className='rounded border p-2 font-normal' inputMode='decimal' placeholder='Contoh: 106.816666' value={lng} onChange={(e) => setLng(e.target.value)} />
      </label>
    </div>
    <button disabled={!isValid} className='rounded bg-primary px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400'>Simpan Lokasi Manual</button>
    {message && <p className='text-sm text-slate-700'>{message}</p>}
  </form>;
}
