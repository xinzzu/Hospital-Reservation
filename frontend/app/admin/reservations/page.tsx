'use client';

import { useAuthStore } from '@/store/authStore';

export default function AdminReservationsPage() {
  const { user } = useAuthStore();

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Kelola Reservasi
        </h1>
        <p className="text-[#6b7280] mt-1">
          Daftar semua reservasi pasien
        </p>
      </div>

      <div className="card p-6">
        <p className="text-[#6b7280]">
          Halaman manajemen reservasi akan segera hadir.
        </p>
      </div>
    </div>
  );
}
