import type { ConfidenceResult } from '../utils/confidence';

type Props = {
  confidence: ConfidenceResult;
};

export default function AccuracyPanel({ confidence }: Props) {
  return <section className={`rounded-2xl border p-4 shadow-sm ${confidence.tone}`}>
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.25em] opacity-70'>tingkat kepercayaan</p>
        <h2 className='text-2xl font-extrabold'>{confidence.label}</h2>
      </div>
      <div className='rounded-full bg-white/80 px-4 py-2 text-lg font-extrabold shadow-sm'>{confidence.score}/100</div>
    </div>
    <p className='mt-2 text-sm'>{confidence.summary}</p>
    <div className='mt-4 grid gap-3 sm:grid-cols-2'>
      <div className='rounded-xl bg-white/70 p-3'>
        <p className='font-bold'>Lokasi</p>
        <p className='text-sm'>{confidence.locationMessage}</p>
      </div>
      <div className='rounded-xl bg-white/70 p-3'>
        <p className='font-bold'>Kompas</p>
        <p className='text-sm'>{confidence.compassMessage}</p>
      </div>
    </div>
    <ul className='mt-4 grid gap-2 sm:grid-cols-2'>
      {confidence.checklist.map((item) => <li key={item.label} className='flex gap-2 rounded-xl bg-white/70 p-3 text-sm'>
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold ${item.done ? 'bg-emerald-600 text-white' : 'bg-amber-300 text-amber-950'}`}>{item.done ? '✓' : '!'}</span>
        <span><strong>{item.label}</strong><br /><span className='opacity-80'>{item.hint}</span></span>
      </li>)}
    </ul>
  </section>;
}
