import { useEffect, useState } from 'react';

type Result = { display_name: string; lat: string; lon: string };
export default function LocationSearch({ onPick }: { onPick: (lat:number,lng:number)=>void }) {
  const [q,setQ]=useState(''); const [items,setItems]=useState<Result[]>([]);
  useEffect(()=>{ if(q.length<3){setItems([]);return;} const t=setTimeout(async()=>{ const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`); setItems(await r.json()); },500); return ()=>clearTimeout(t);},[q]);
  return <div><input className='w-full rounded border p-2' placeholder='Cari kota/alamat' value={q} onChange={(e)=>setQ(e.target.value)}/><div className='mt-2 space-y-1'>{items.map((it)=><button key={it.display_name} className='block w-full rounded bg-white p-2 text-left text-sm shadow' onClick={()=>onPick(Number(it.lat),Number(it.lon))}>{it.display_name} ({Number(it.lat).toFixed(3)}, {Number(it.lon).toFixed(3)})</button>)}</div></div>;
}
