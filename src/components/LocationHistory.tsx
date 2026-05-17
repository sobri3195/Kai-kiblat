import type { LocationHistoryItem } from '../utils/geo';

type Props = {
  items: LocationHistoryItem[];
  onPick: (lat: number, lng: number, source: LocationHistoryItem['source']) => boolean;
  onClear: () => void;
};

function formatDate(value: number) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(value);
}

export default function LocationHistory({ items, onPick, onClear }: Props) {
  if (!items.length) return null;

  return <section className='rounded-2xl bg-white p-4 shadow'>
    <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
      <div>
        <h2 className='text-lg font-extrabold text-primary'>Riwayat lokasi</h2>
        <p className='text-sm text-slate-600'>Pilih ulang lokasi terakhir tanpa mencari dari awal.</p>
      </div>
      <button onClick={onClear} className='rounded bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200'>Hapus riwayat</button>
    </div>
    <div className='grid gap-2'>
      {items.map((item) => <button key={item.id} onClick={() => onPick(item.lat, item.lng, item.source ?? 'manual')} className='rounded-xl border border-slate-100 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <strong className='capitalize text-slate-800'>{item.label}</strong>
          <span className='text-xs text-slate-500'>{formatDate(item.savedAt)}</span>
        </div>
        <p className='text-sm text-slate-600'>{item.lat.toFixed(6)}, {item.lng.toFixed(6)}{typeof item.accuracy === 'number' ? ` • ±${Math.round(item.accuracy)} m` : ''}</p>
      </button>)}
    </div>
  </section>;
}
