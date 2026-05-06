type CompassProps = {
  qiblaBearing: number | null;
  heading: number | null;
  relative: number | null;
  instruction: string;
};

export default function Compass({ qiblaBearing, heading, relative, instruction }: CompassProps) {
  const pointerRotation = relative ?? qiblaBearing ?? 0;

  return <div className='rounded-2xl bg-white p-4 shadow'>
    <div className='mx-auto relative h-72 w-72 max-w-full rounded-full border-8 border-emerald-200 bg-emerald-50 shadow-inner'>
      <div className='absolute left-1/2 top-2 -translate-x-1/2 font-bold text-primary'>↑ Depan</div>
      <div className='absolute left-1/2 top-4 -translate-x-1/2 text-xs font-semibold'>U</div>
      <div className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold'>T</div>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold'>S</div>
      <div className='absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold'>B</div>
      <div className='absolute inset-10 rounded-full border border-emerald-200' />
      <div className='absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800 ring-4 ring-white' />
      <div className='absolute left-1/2 top-1/2 h-28 w-1 origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-gold transition-transform duration-500' style={{ transform: `translate(-50%, -100%) rotate(${pointerRotation}deg)` }}>
        <div className='absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-gold' />
      </div>
    </div>
    <p className='mt-3 text-center font-semibold text-primary'>{instruction}</p>
    <p className='text-center text-sm'>Kiblat {qiblaBearing?.toFixed(1) ?? '-'}° • Heading {heading?.toFixed(1) ?? '-'}° • Relatif {relative?.toFixed(1) ?? '-'}°</p>
    <ul className='mt-3 list-disc pl-5 text-sm text-slate-600'>
      <li>Pegang HP mendatar dan arahkan bagian atas layar ke depan badan.</li>
      <li>Jika layar diputar portrait/landscape, indikator tetap mengikuti orientasi layar.</li>
      <li>Putar badan hingga indikator kiblat berada di depan.</li>
      <li>Jika arah terasa tidak stabil, kalibrasi kompas dengan gerakan angka delapan.</li>
    </ul>
  </div>;
}
