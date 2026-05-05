import StatusBadge from './StatusBadge';

type Props = { qibla: number | null; heading: number | null; directionText: string; distance: number | null; lat?: number; lng?: number; accuracy?: number; locationStatus: string; compassStatus: string };
export default function LocationCard(p: Props) {
  return <div className='grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow'>
    <div>Arah Kiblat<div className='font-bold'>{p.qibla?.toFixed(1) ?? '-'}° dari Utara</div></div>
    <div>Heading<div className='font-bold'>{p.heading?.toFixed(1) ?? '-'}°</div></div>
    <div>Arah Relatif<div className='font-bold'>{p.directionText}</div></div>
    <div>Jarak Ka'bah<div className='font-bold'>{p.distance?.toFixed(3) ?? '-'} km</div></div>
    <div>Latitude<div>{p.lat?.toFixed(6) ?? '-'}</div></div><div>Longitude<div>{p.lng?.toFixed(6) ?? '-'}</div></div>
    <div>Akurasi<div>{p.accuracy ? `${Math.round(p.accuracy)} m` : '-'}</div></div>
    <div className='space-y-1'><StatusBadge label={p.locationStatus}/><StatusBadge label={p.compassStatus}/></div>
  </div>;
}
