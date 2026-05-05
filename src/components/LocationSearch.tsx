import { useEffect, useState } from 'react';

type Result = { display_name: string; lat: string; lon: string; place_id: number };

export default function LocationSearch({ onPick }: { onPick: (lat: number, lng: number, source: 'search') => boolean }) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = q.trim();
    if (query.length < 3) {
      setItems([]);
      setError('');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Pencarian lokasi gagal.');
        const data = await response.json() as Result[];
        setItems(data);
        setError(data.length ? '' : 'Lokasi tidak ditemukan. Coba kata kunci lain.');
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Pencarian lokasi gagal.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [q]);

  return <div className='space-y-2'>
    <label className='grid gap-1 text-sm font-medium'>Cari kota/alamat
      <input className='rounded border p-2 font-normal' placeholder='Contoh: Jakarta, Indonesia' value={q} onChange={(e) => setQ(e.target.value)} />
    </label>
    {loading && <p className='text-sm text-slate-600'>Mencari lokasi...</p>}
    {error && <p className='text-sm text-rose-700'>{error}</p>}
    <div className='space-y-1'>{items.map((it) => <button key={it.place_id} className='block w-full rounded bg-white p-2 text-left text-sm shadow transition hover:bg-emerald-50' onClick={() => onPick(Number(it.lat), Number(it.lon), 'search')}>
      {it.display_name} ({Number(it.lat).toFixed(3)}, {Number(it.lon).toFixed(3)})
    </button>)}</div>
  </div>;
}
