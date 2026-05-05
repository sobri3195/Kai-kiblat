import clsx from 'clsx';

export default function StatusBadge({ label }: { label: string }) {
  const isGood = label.includes('aktif');
  const isProblem = label.includes('ditolak') || label.includes('tidak') || label.includes('invalid');

  return <span className={clsx(
    'rounded-full px-3 py-1 text-xs font-semibold',
    isGood && 'bg-emerald-100 text-emerald-700',
    isProblem && 'bg-rose-100 text-rose-700',
    !isGood && !isProblem && 'bg-amber-100 text-amber-700'
  )}>{label}</span>;
}
