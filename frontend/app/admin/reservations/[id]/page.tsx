'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { reservationsAPI } from '@/lib/api';
import ReservationDetailCard from '@/components/admin/ReservationDetailCard';
import PatientInfoCard from '@/components/admin/PatientInfoCard';
import DoctorInfoCard from '@/components/admin/DoctorInfoCard';
import StatusHistory from '@/components/admin/StatusHistory';
import StatusBadge from '@/components/admin/StatusBadge';

const Icons = {
  ArrowLeft: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Loading: ({ className = 'w-6 h-6 animate-spin' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  AlertCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  CheckCircle: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  XCircle: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
};

interface ReservationDetail {
  id: number;
  queue_code: string;
  queue_number: number;
  status: string;
  reservation_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    id: number;
    name: string;
    specialization: string;
    room: string;
    photo_url: string;
  };
  schedule: {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  };
  status_history: Array<{
    id: number;
    old_status: string;
    new_status: string;
    changed_by: string;
    changed_at: string;
    notes: string;
  }>;
}

const statusOptions = [
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'dipanggil', label: 'Dipanggil' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'batal', label: 'Batal' },
];

export default function AdminReservationDetailPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReservation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationsAPI.getReservationDetail(Number(params.id));
      setReservation(response.data);
    } catch (err: any) {
      console.error('Failed to fetch reservation:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat detail reservasi');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const handleStatusChange = async (newStatus: string) => {
    if (!reservation || reservation.status === newStatus) return;

    const notes = prompt('Masukkan catatan perubahan status (opsional):');
    setUpdating(true);
    try {
      await reservationsAPI.updateStatus(reservation.queue_code, newStatus);
      showToast(`Status reservasi berhasil diubah ke "${statusOptions.find(s => s.value === newStatus)?.label}"`, 'success');
      await fetchReservation();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal mengubah status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-4 text-white">
            <Icons.Loading />
          </div>
          <p className="text-[#6b7280] font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors mb-4">
          <Icons.ArrowLeft />
          <span>Kembali ke Daftar Reservasi</span>
        </Link>
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4 text-[#dc2626]">
            <Icons.AlertCircle />
          </div>
          <p className="text-[#dc2626] mb-4">{error || 'Reservasi tidak ditemukan'}</p>
          <Link href="/admin/reservations" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg">
            Kembali ke Daftar Reservasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors mb-4">
          <Icons.ArrowLeft />
          <span>Kembali ke Daftar Reservasi</span>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
              Detail Reservasi
            </h1>
            <p className="text-[#6b7280] mt-1">
              Kode: <span className="font-mono font-semibold">{reservation.queue_code}</span>
            </p>
          </div>
          <StatusBadge status={reservation.status as 'menunggu' | 'dipanggil' | 'selesai' | 'batal'} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#6b7280]">Ubah Status:</span>
          {statusOptions
            .filter(option => option.value !== reservation.status)
            .map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={updating}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
              >
                {option.label}
              </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Reservation & Patient Info */}
        <div className="lg:col-span-2 space-y-6">
          <ReservationDetailCard
            queueCode={reservation.queue_code}
            reservationDate={reservation.reservation_date}
            status={reservation.status}
            notes={reservation.notes}
            createdAt={reservation.created_at}
            queueNumber={reservation.queue_number}
          />
          <PatientInfoCard patient={reservation.patient} />
        </div>

        {/* Right Column - Doctor Info & History */}
        <div className="space-y-6">
          <DoctorInfoCard doctor={reservation.doctor} />
          <StatusHistory history={reservation.status_history} />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 lg:right-24 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-[#059669] text-white' : 'bg-[#dc2626] text-white'
        }`}>
          {toast.type === 'success' ? <Icons.CheckCircle /> : <Icons.XCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
