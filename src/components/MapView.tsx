import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import { KAABA_COORD } from '../utils/qibla';

L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow });
const Fly=({to}:{to:[number,number]})=>{const map=useMap(); map.flyTo(to,6); return null;};
export default function MapView({ user }: { user: [number, number] }) {
  return <div className='rounded-2xl bg-white p-3 shadow'><div className='mb-2 flex gap-2 text-xs'><span className='rounded bg-emerald-100 px-2 py-1'>Lokasi manual/gps</span><span className='rounded bg-amber-100 px-2 py-1'>Garis kiblat</span></div>
    <MapContainer center={user} zoom={5} scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker position={user}><Popup>Lokasi Anda</Popup></Marker>
      <Marker position={[KAABA_COORD.lat, KAABA_COORD.lng]}><Popup>Ka'bah</Popup></Marker>
      <Polyline positions={[user,[KAABA_COORD.lat, KAABA_COORD.lng]]} pathOptions={{ color: '#0f766e' }} />
      <Fly to={user}/>
    </MapContainer></div>;
}
