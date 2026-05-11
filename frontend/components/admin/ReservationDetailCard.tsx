'use client';

import StatusBadge from './StatusBadge';

interface ReservationDetailCardProps {
  queueCode: string;
  reservationDate: string;
  status: string;
  notes?: string;
  createdAt: string;
  queueNumber: number;
}

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDateIndonesian(dateString: string): string {
  const date = new Date(dateString);
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
}

export default function ReservationDetailCard({
  queueCode,
  reservationDate,
  status,
  notes,
  createdAt,
  queueNumber,
}: ReservationDetailCardProps) {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-[#1a1d23] mb-4">Informasi Reservasi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-[#6b7280]">Kode Antrian</p>
          <p className="font-mono font-bold text-lg text-[#1a1d23]">{queueCode}</p>
        </div>
        <div>
          <p className="text-sm text-[#6b7280]">Nomor Antrian</p>
          <p className="font-bold text-lg text-[#0d9488]">#{queueNumber}</p>
        </div>
        <div>
          <p className="text-sm text-[#6b7280]">Tanggal Reservasi</p>
          <p className="text-[#374151]">{formatDateIndonesian(reservationDate)}</p>
        </div>
        <div>
          <p className="text-sm text-[#6b7280]">Status</p>
          <StatusBadge status={status as 'menunggu' | 'dipanggil' | 'selesai' | 'batal'} />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-[#6b7280]">Catatan</p>
          <p className="text-[#374151]">{notes || 'Tidak ada catatan'}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-[#6b7280]">Dibuat</p>
          <p className="text-[#374151]">{formatDateIndonesian(createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
