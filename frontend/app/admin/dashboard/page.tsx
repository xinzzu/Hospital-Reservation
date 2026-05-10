'use client';

import { useAuthStore } from '@/store/authStore';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Admin Dashboard
        </h1>
        <p className="text-[#6b7280] mt-1">
          Selamat datang, <span className="text-[#0d9488] font-semibold">{user?.name}</span>
        </p>
      </div>

      <div className="card p-6">
        <p className="text-[#6b7280]">
          Halaman admin akan segera hadir. Gunakan menu di sidebar untuk navigasi.
        </p>
      </div>
    </div>
  );
}
