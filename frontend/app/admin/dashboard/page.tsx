'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { adminAPI } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';

// SVG Icons
const Icons = {
  Calendar: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Users: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Clock: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  CheckCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  Bell: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Stethoscope: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  UserCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  RefreshCw: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2v6h-6"/>
      <path d="M3 12a9 9 0 0115-6.7L21 8"/>
      <path d="M3 22v-6h6"/>
      <path d="M21 12a9 9 0 01-15 6.7L3 16"/>
    </svg>
  ),
  AlertCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Activity: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Plus: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  List: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
};

// Type definitions
interface AdminStats {
  total_reservations: number;
  today_reservations: number;
  waiting_count: number;
  called_count: number;
  completed_count: number;
  cancelled_count: number;
  total_doctors: number;
  total_patients: number;
  active_reservations: number;
}

// Loading skeleton component
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] animate-pulse" />
            <div className="flex-1">
              <div className="h-8 w-20 bg-[#f3f4f6] rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-[#f3f4f6] rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
        <span className="text-[#dc2626]"><Icons.AlertCircle /></span>
      </div>
      <h3 className="text-lg font-semibold text-[#1a1d23] mb-2">
        Gagal memuat data
      </h3>
      <p className="text-[#6b7280] mb-4">
        {message || 'Terjadi kesalahan saat mengambil data statistik.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors font-medium"
      >
        <Icons.RefreshCw />
        Coba Lagi
      </button>
    </div>
  );
}

// Quick actions data
const quickActions = [
  { id: 'reservasi', label: 'Kelola Reservasi', icon: Icons.List, href: '/admin/reservations' },
  { id: 'dokter', label: 'Kelola Dokter', icon: Icons.Stethoscope, href: '/admin/doctors' },
];

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Dashboard
        </h1>
        <p className="text-[#6b7280] mt-1">
          Selamat datang, <span className="text-[#0d9488] font-semibold">{user?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      {error && !stats ? (
        <ErrorState message={error} onRetry={fetchStats} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {loading ? (
            <StatsSkeleton />
          ) : stats ? (
            <>
              <StatsCard
                title="Total Reservasi"
                value={stats.total_reservations}
                icon={<Icons.Calendar />}
                color="teal"
              />
              <StatsCard
                title="Reservasi Hari Ini"
                value={stats.today_reservations}
                icon={<Icons.Activity />}
                color="blue"
              />
              <StatsCard
                title="Menunggu"
                value={stats.waiting_count}
                icon={<Icons.Clock />}
                color="amber"
              />
              <StatsCard
                title="Selesai"
                value={stats.completed_count}
                icon={<Icons.CheckCircle />}
                color="emerald"
              />
              <StatsCard
                title="Dipanggil"
                value={stats.called_count}
                icon={<Icons.Bell />}
                color="blue"
              />
              <StatsCard
                title="Total Dokter"
                value={stats.total_doctors}
                icon={<Icons.Stethoscope />}
                color="teal"
              />
              <StatsCard
                title="Total Pasien"
                value={stats.total_patients}
                icon={<Icons.Users />}
                color="amber"
              />
            </>
          ) : null}
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[#1a1d23] mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <a
                key={action.id}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#e5e7eb] hover:border-[#0d9488] hover:bg-[#f0fdfa] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] group-hover:bg-[#ccfbf1] flex items-center justify-center text-[#6b7280] group-hover:text-[#0d9488] transition-colors">
                  <IconComponent />
                </div>
                <span className="font-medium text-[#374151] group-hover:text-[#0d9488] transition-colors">
                  {action.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}