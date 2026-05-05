import { useState } from 'react';

export default function ManualLocationInput({ onSet }: { onSet: (lat: number, lng: number) => void }) {
  const [lat, setLat] = useState(''); const [lng, setLng] = useState('');
  return <form className='grid gap-2' onSubmit={(e)=>{e.preventDefault(); onSet(Number(lat), Number(lng));}}>
    <input className='rounded border p-2' placeholder='Latitude' value={lat} onChange={(e)=>setLat(e.target.value)} />
    <input className='rounded border p-2' placeholder='Longitude' value={lng} onChange={(e)=>setLng(e.target.value)} />
    <button className='rounded bg-primary px-3 py-2 text-white'>Simpan Lokasi Manual</button>
  </form>;
}
