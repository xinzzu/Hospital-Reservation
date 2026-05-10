'use client';

import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';

interface ReservationItem {
  id: number;
  queue_code: string;
  patient_name?: string;
  doctor_name: string;
  reservation_date: string;
  status: string;
  notes?: string;
}

interface ReservationTableProps {
  reservations: ReservationItem[];
  onStatusChange?: (code: string, newStatus: string) => void;
  loading?: boolean;
}

const statusOptions = [
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'dipanggil', label: 'Dipanggil' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'batal', label: 'Batal' },
];

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDateIndonesian(dateString: string): string {
  const date = new Date(dateString);
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#f3f4f6] animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
    </tr>
  );
}

export default function ReservationTable({
  reservations,
  onStatusChange,
  loading = false,
}: ReservationTableProps) {
  const hasStatusChange = typeof onStatusChange === 'function';

  return (
    <div className="bg-white rounded-xl border border-[#f3f4f6] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#f3f4f6]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Kode
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Pasien
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Dokter
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="text-[#9ca3af]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-12 h-12 mx-auto mb-3 text-[#d1d5db]"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="font-medium">Tidak ada data reservasi</p>
                    <p className="text-sm mt-1">Reservasi akan muncul di sini</p>
                  </div>
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="hover:bg-[#f9fafb] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#1a1d23] font-mono text-sm">
                      {reservation.queue_code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#374151]">
                    {reservation.patient_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-[#374151]">
                    {reservation.doctor_name}
                  </td>
                  <td className="px-4 py-3 text-[#374151]">
                    {formatDateIndonesian(reservation.reservation_date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={reservation.status as 'menunggu' | 'dipanggil' | 'selesai' | 'batal'} />
                      {hasStatusChange && (
                        <select
                          value={reservation.status}
                          onChange={(e) =>
                            onStatusChange(reservation.queue_code, e.target.value)
                          }
                          className="text-xs px-2 py-1 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent cursor-pointer bg-white"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/reservations/${reservation.id}`}
                      className="text-[#14b8a6] hover:text-[#0d9488] font-medium text-sm transition-colors"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
