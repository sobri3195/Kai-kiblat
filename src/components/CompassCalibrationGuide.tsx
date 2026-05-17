type Props = {
  compassStatus: string;
  hasHeading: boolean;
};

export default function CompassCalibrationGuide({ compassStatus, hasHeading }: Props) {
  const shouldHighlight = compassStatus !== 'Kompas aktif' || !hasHeading;

  return <section className={`rounded-2xl p-4 shadow ${shouldHighlight ? 'bg-amber-50 text-amber-950' : 'bg-white text-slate-700'}`}>
    <div className='flex flex-wrap items-center justify-between gap-2'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.25em] opacity-70'>panduan kalibrasi</p>
        <h2 className='text-xl font-extrabold text-primary'>Stabilkan kompas sebelum memakai arah</h2>
      </div>
      <span className='rounded-full bg-white px-3 py-1 text-sm font-bold shadow-sm'>{compassStatus}</span>
    </div>
    <ol className='mt-3 grid gap-2 text-sm sm:grid-cols-3'>
      <li className='rounded-xl bg-white/80 p-3'><strong>1. Pegang mendatar</strong><br />Letakkan HP sejajar lantai, bagian atas layar mengarah ke depan badan.</li>
      <li className='rounded-xl bg-white/80 p-3'><strong>2. Gerak angka delapan</strong><br />Ayunkan HP perlahan membentuk angka delapan selama 5-10 detik.</li>
      <li className='rounded-xl bg-white/80 p-3'><strong>3. Jauhi logam</strong><br />Hindari magnet, casing metal, kendaraan, speaker, atau perangkat elektronik besar.</li>
    </ol>
  </section>;
}
