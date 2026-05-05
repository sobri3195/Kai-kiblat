import clsx from 'clsx';

export default function StatusBadge({ label }: { label: string }) {
  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', label.includes('aktif') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{label}</span>;
}
