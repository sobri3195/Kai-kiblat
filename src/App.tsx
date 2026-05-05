import { useMemo, useState } from 'react';
import Compass from './components/Compass';
import LocationCard from './components/LocationCard';
import ManualLocationInput from './components/ManualLocationInput';
import LocationSearch from './components/LocationSearch';
import MapView from './components/MapView';
import { useGeolocation } from './hooks/useGeolocation';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { getDirectionInstruction } from './utils/direction';
import { isHttpsContext } from './utils/geo';
import { calculateDistanceToKaaba, calculateQiblaBearing } from './utils/qibla';

export default function App() {
  const { coords, status, error, locate, setManualCoords } = useGeolocation();
  const { heading, status: compassStatus, enableCompass } = useDeviceOrientation();
  const [manualOpen, setManualOpen] = useState(false);
  const qibla = coords ? calculateQiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords ? calculateDistanceToKaaba(coords.lat, coords.lng) : null;
  const relative = useMemo(() => (qibla != null && heading != null ? (qibla - heading + 360) % 360 : qibla ?? 0), [qibla, heading]);
  const instruction = getDirectionInstruction(relative);

  return <main className='mx-auto max-w-3xl space-y-4 p-4'>
    <header className='text-center'><h1 className='text-3xl font-extrabold text-primary'>kai-kiblat</h1><p className='text-gold'>Arah kiblat akurat dari mana saja</p></header>
    {!isHttpsContext() && <div className='rounded bg-amber-100 p-3 text-sm'>Fitur lokasi dan kompas membutuhkan HTTPS. Deploy ke Vercel agar fitur berjalan optimal.</div>}
    {error && <div className='rounded bg-rose-100 p-3 text-sm'>{error}</div>}
    {status==='Akurasi rendah' && <div className='rounded bg-amber-100 p-3 text-sm'>Akurasi GPS masih rendah. Coba berada di area terbuka.</div>}
    <Compass qiblaBearing={qibla} heading={heading} relative={relative} instruction={instruction} />
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      <button onClick={locate} className='rounded bg-primary px-3 py-2 text-white'>Gunakan Lokasi Saya</button>
      <button onClick={locate} className='rounded bg-emerald-600 px-3 py-2 text-white'>Refresh Lokasi</button>
      <button onClick={enableCompass} className='rounded bg-gold px-3 py-2 text-white'>Aktifkan Kompas</button>
      <button onClick={()=>setManualOpen((s)=>!s)} className='rounded bg-slate-700 px-3 py-2 text-white'>Input Lokasi Manual</button>
    </div>
    {manualOpen && <div className='space-y-3 rounded-2xl bg-emerald-100 p-3'><ManualLocationInput onSet={setManualCoords}/><LocationSearch onPick={setManualCoords}/></div>}
    <LocationCard qibla={qibla} heading={heading} directionText={instruction} distance={distance} lat={coords?.lat} lng={coords?.lng} accuracy={coords?.accuracy} locationStatus={status} compassStatus={compassStatus}/>
    {coords && <MapView user={[coords.lat, coords.lng]} />}
    <div className='rounded bg-slate-100 p-3 text-sm'>Lokasi terbaru dan peta membutuhkan koneksi internet/GPS.</div>
  </main>;
}
