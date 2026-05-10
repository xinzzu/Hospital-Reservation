'use client';

interface StatusBadgeProps {
  status: 'menunggu' | 'dipanggil' | 'selesai' | 'batal';
}

const statusConfig = {
  menunggu: {
    label: 'Menunggu',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  dipanggil: {
    label: 'Dipanggil',
    dotColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  selesai: {
    label: 'Selesai',
    dotColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  batal: {
    label: 'Batal',
    dotColor: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.menunggu;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}