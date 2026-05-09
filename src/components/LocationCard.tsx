import { formatCoordinate } from '../utils/geo';
import StatusBadge from './StatusBadge';

type Props = {
  qibla: number | null;
  heading: number | null;
  relative: number | null;
  directionText: string;
  distance: number | null;
  lat?: number;
  lng?: number;
  accuracy?: number;
  source?: string;
  locationStatus: string;
  compassStatus: string;
};

function formatDistance(distance: number | null) {
  if (distance == null) return '-';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(distance) + ' km';
}

export default function LocationCard(p: Props) {
  return <div className='grid gap-3 rounded-2xl bg-white p-4 shadow sm:grid-cols-2'>
    <div>Arah Kiblat<div className='font-bold'>{p.qibla?.toFixed(1) ?? '-'}° dari Utara</div></div>
    <div>Heading<div className='font-bold'>{p.heading?.toFixed(1) ?? '-'}°</div></div>
    <div>Arah Relatif<div className='font-bold'>{p.relative?.toFixed(1) ?? '-'}°</div></div>
    <div>Instruksi<div className='font-bold'>{p.directionText}</div></div>
    <div>Jarak Ka'bah<div className='font-bold'>{formatDistance(p.distance)}</div></div>
    <div>Sumber Lokasi<div className='font-bold capitalize'>{p.source ?? '-'}</div></div>
    <div>Latitude<div>{formatCoordinate(p.lat)}</div></div>
    <div>Longitude<div>{formatCoordinate(p.lng)}</div></div>
    <div>Akurasi<div>{typeof p.accuracy === 'number' ? `${Math.round(p.accuracy)} m` : '-'}</div></div>
    <div className='flex flex-wrap gap-2'><StatusBadge label={p.locationStatus} /><StatusBadge label={p.compassStatus} /></div>
  </div>;
}
