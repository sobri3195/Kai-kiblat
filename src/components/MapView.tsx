import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import { KAABA_COORD } from '../utils/qibla';

L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow });

function FlyToUser({ to }: { to: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(to, Math.max(map.getZoom(), 5), { duration: 0.8 });
  }, [map, to]);

  return null;
}

export default function MapView({ user }: { user: [number, number] }) {
  const kaaba: [number, number] = [KAABA_COORD.lat, KAABA_COORD.lng];

  return <div className='rounded-2xl bg-white p-3 shadow'>
    <div className='mb-2 flex flex-wrap gap-2 text-xs'>
      <span className='rounded bg-emerald-100 px-2 py-1'>Lokasi manual/GPS</span>
      <span className='rounded bg-amber-100 px-2 py-1'>Garis kiblat</span>
      <span className='rounded bg-slate-100 px-2 py-1'>Ka'bah</span>
    </div>
    <MapContainer center={user} zoom={5} scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker position={user}><Popup>Lokasi Anda</Popup></Marker>
      <Marker position={kaaba}><Popup>Ka'bah</Popup></Marker>
      <Polyline positions={[user, kaaba]} pathOptions={{ color: '#0f766e', weight: 3 }} />
      <FlyToUser to={user} />
    </MapContainer>
  </div>;
}
