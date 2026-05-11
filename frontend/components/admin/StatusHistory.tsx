'use client';

interface StatusHistoryItem {
  id: number;
  old_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
  notes?: string;
}

interface StatusHistoryProps {
  history: StatusHistoryItem[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  menunggu: { label: 'Menunggu', color: 'bg-[#fef3c7] text-[#92400e]' },
  dipanggil: { label: 'Dipanggil', color: 'bg-[#dbeafe] text-[#1e40af]' },
  selesai: { label: 'Selesai', color: 'bg-[#d1fae5] text-[#065f46]' },
  batal: { label: 'Batal', color: 'bg-[#fee2e2] text-[#991b1b]' },
};

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
}

export default function StatusHistory({ history }: StatusHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="font-bold text-[#1a1d23] mb-4">Riwayat Status</h3>
        <p className="text-[#6b7280] text-center py-4">Belum ada riwayat perubahan status</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-bold text-[#1a1d23] mb-4">Riwayat Status</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e5e7eb]" />
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={item.id} className="relative flex gap-4">
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-[#0d9488] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
              }`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusLabels[item.old_status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[item.old_status]?.label || item.old_status}
                  </span>
                  <span className="text-[#6b7280]">→</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusLabels[item.new_status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[item.new_status]?.label || item.new_status}
                  </span>
                </div>
                <p className="text-sm text-[#6b7280] mt-1">
                  Oleh: {item.changed_by} • {formatDateTime(item.changed_at)}
                </p>
                {item.notes && (
                  <p className="text-sm text-[#374151] mt-1 italic">"{item.notes}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
