import { useMemo, useState } from 'react';
import AccuracyPanel from './components/AccuracyPanel';
import Compass from './components/Compass';
import CompassCalibrationGuide from './components/CompassCalibrationGuide';
import LocationCard from './components/LocationCard';
import ManualLocationInput from './components/ManualLocationInput';
import LocationSearch from './components/LocationSearch';
import LocationHistory from './components/LocationHistory';
import MapView from './components/MapView';
import ShareQibla from './components/ShareQibla';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { useGeolocation } from './hooks/useGeolocation';
import { calculateConfidence } from './utils/confidence';
import { getDirectionInstruction } from './utils/direction';
import { isHttpsContext } from './utils/geo';
import { calculateDistanceToKaaba, calculateQiblaBearing } from './utils/qibla';

export default function App() {
  const { coords, status, error, history, locate, setManualCoords, clearHistory } = useGeolocation();
  const { heading, status: compassStatus, enableCompass } = useDeviceOrientation();
  const [manualOpen, setManualOpen] = useState(false);
  const qibla = coords ? calculateQiblaBearing(coords.lat, coords.lng) : null;
  const distance = coords ? calculateDistanceToKaaba(coords.lat, coords.lng) : null;
  const relative = useMemo(() => {
    if (qibla == null || heading == null) return null;
    return (qibla - heading + 360) % 360;
  }, [qibla, heading]);
  const instruction = getDirectionInstruction(relative, qibla != null, heading != null);
  const confidence = useMemo(() => calculateConfidence({
    hasLocation: coords != null,
    heading,
    accuracy: coords?.accuracy,
    source: coords?.source,
    locationStatus: status,
    compassStatus
  }), [compassStatus, coords, heading, status]);

  return <main className='mx-auto max-w-3xl space-y-4 p-4'>
    <header className='rounded-3xl bg-white p-6 text-center shadow'>
      <p className='text-sm font-semibold uppercase tracking-[0.3em] text-gold'>penunjuk kiblat</p>
      <h1 className='text-4xl font-extrabold text-primary'>kai-kiblat</h1>
      <p className='mt-2 text-slate-600'>Arah kiblat akurat dari GPS, input manual, pencarian lokasi, kompas, dan peta.</p>
    </header>

    {!isHttpsContext() && <div className='rounded bg-amber-100 p-3 text-sm text-amber-900'>Fitur lokasi dan kompas membutuhkan HTTPS. Deploy ke Vercel agar fitur berjalan optimal.</div>}
    {error && <div className='rounded bg-rose-100 p-3 text-sm text-rose-900'>{error}</div>}
    {status === 'Akurasi rendah' && <div className='rounded bg-amber-100 p-3 text-sm text-amber-900'>Akurasi GPS masih rendah. Coba berada di area terbuka.</div>}

    <AccuracyPanel confidence={confidence} />
    <Compass qiblaBearing={qibla} heading={heading} relative={relative} instruction={instruction} />

    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      <button onClick={locate} className='rounded bg-primary px-3 py-2 font-semibold text-white transition hover:bg-emerald-800'>Gunakan Lokasi Saya</button>
      <button onClick={locate} className='rounded bg-emerald-600 px-3 py-2 font-semibold text-white transition hover:bg-emerald-700'>Refresh Lokasi</button>
      <button onClick={enableCompass} className='rounded bg-gold px-3 py-2 font-semibold text-white transition hover:brightness-95'>Aktifkan Kompas</button>
      <button onClick={() => setManualOpen((s) => !s)} className='rounded bg-slate-700 px-3 py-2 font-semibold text-white transition hover:bg-slate-800'>{manualOpen ? 'Tutup Input' : 'Input/Cari Lokasi'}</button>
    </div>

    {manualOpen && <section className='space-y-4 rounded-2xl bg-emerald-100 p-4 shadow-inner'>
      <div>
        <h2 className='font-bold text-primary'>Pilih lokasi tanpa GPS</h2>
        <p className='text-sm text-slate-600'>Masukkan koordinat langsung atau cari nama kota/alamat.</p>
      </div>
      <ManualLocationInput onSet={setManualCoords} />
      <LocationSearch onPick={setManualCoords} />
    </section>}

    <CompassCalibrationGuide compassStatus={compassStatus} hasHeading={heading != null} />
    <LocationCard qibla={qibla} heading={heading} relative={relative} directionText={instruction} distance={distance} lat={coords?.lat} lng={coords?.lng} accuracy={coords?.accuracy} source={coords?.source} locationStatus={status} compassStatus={compassStatus} />
    <ShareQibla qibla={qibla} heading={heading} relative={relative} instruction={instruction} distance={distance} lat={coords?.lat} lng={coords?.lng} />
    <LocationHistory items={history} onPick={setManualCoords} onClear={clearHistory} />
    {coords && <MapView user={[coords.lat, coords.lng]} />}
    <div className='rounded bg-slate-100 p-3 text-sm text-slate-600'>Lokasi terbaru, pencarian alamat, dan peta membutuhkan koneksi internet/GPS. Untuk hasil ibadah, cocokkan juga dengan penanda kiblat masjid setempat jika tersedia.</div>
  </main>;
}
