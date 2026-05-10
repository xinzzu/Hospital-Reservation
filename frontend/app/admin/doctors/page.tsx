'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { adminAPI } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import Link from 'next/link';

// ============================================
// Type Definitions
// ============================================
interface Doctor {
  id: number;
  user_id: number;
  name: string;
  specialization: string;
  room: string;
  bio: string;
  photo_url: string;
  created_at: string;
}

// ============================================
// SVG Icons
// ============================================
const Icons = {
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
  Building: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/>
    </svg>
  ),
  Award: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
    </svg>
  ),
  ArrowRight: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Inbox: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-6l-2 3H10l-2-3H2"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
    </svg>
  ),
};

// ============================================
// Loading Skeleton Component
// ============================================
function DoctorCardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#f3f4f6] flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-[#f3f4f6] rounded mb-2" />
          <div className="h-4 w-24 bg-[#f3f4f6] rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-[#f3f4f6] rounded mb-2" />
      <div className="h-4 w-3/4 bg-[#f3f4f6] rounded" />
    </div>
  );
}

// ============================================
// Error State Component
// ============================================
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
        <span className="text-[#dc2626]"><Icons.AlertCircle /></span>
      </div>
      <h3 className="text-lg font-semibold text-[#1a1d23] mb-2">
        Gagal memuat data dokter
      </h3>
      <p className="text-[#6b7280] mb-4">
        {message || 'Terjadi kesalahan saat mengambil data dokter.'}
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

// ============================================
// Empty State Component
// ============================================
function EmptyState() {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
        <span className="text-[#6b7280]"><Icons.Inbox /></span>
      </div>
      <h3 className="text-lg font-semibold text-[#1a1d23] mb-2">
        Belum ada data dokter
      </h3>
      <p className="text-[#6b7280]">
        Belum ada dokter yang terdaftar dalam sistem.
      </p>
    </div>
  );
}

// ============================================
// Doctor Card Component
// ============================================
function DoctorCard({ doctor }: { doctor: Doctor }) {
  // Get initial letter from doctor name
  const initial = doctor.name.charAt(0).toUpperCase();

  // Generate gradient colors based on name for consistent colors
  const gradients = [
    'from-[#0d9488] to-[#14b8a6]',
    'from-[#2563eb] to-[#3b82f6]',
    'from-[#7c3aed] to-[#8b5cf6]',
    'from-[#db2777] to-[#ec4899]',
    'from-[#ea580c] to-[#f97316]',
    'from-[#059669] to-[#10b981]',
  ];
  const gradientIndex = doctor.name.charCodeAt(0) % gradients.length;

  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-xl font-bold">
            {initial}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#1a1d23] truncate">
            {doctor.name}
          </h3>
          <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 bg-[#f0fdfa] rounded-full">
            <Icons.Stethoscope className="w-3.5 h-3.5 text-[#0d9488]" />
            <span className="text-xs font-medium text-[#0d9488]">
              {doctor.specialization}
            </span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="flex items-center gap-2 mb-4 text-sm text-[#6b7280]">
        <span className="w-4 h-4"><Icons.Building /></span>
        <span>Ruang {doctor.room}</span>
      </div>

      {/* Detail Link */}
      <Link
        href={`/admin/doctors/${doctor.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0d9488] hover:text-[#0f766e] transition-colors group"
      >
        Lihat Detail
        <Icons.ArrowRight />
      </Link>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function AdminDoctorsPage() {
  const { user } = useAuthStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate statistics
  const totalDoctors = doctors.length;
  const uniqueSpecializations = new Set(doctors.map(d => d.specialization)).size;

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getDoctors();
      setDoctors(response.data.doctors);
    } catch (err: any) {
      console.error('Failed to fetch doctors:', err);
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data dokter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Kelola Dokter
        </h1>
        <p className="text-[#6b7280] mt-1">
          Daftar dan manajemen dokter
        </p>
      </div>

      {/* Statistics Section */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatsCard
            title="Total Dokter"
            value={totalDoctors}
            icon={<Icons.Stethoscope />}
            color="teal"
          />
          <StatsCard
            title="Spesialisasi"
            value={uniqueSpecializations}
            icon={<Icons.Award />}
            color="blue"
          />
        </div>
      )}

      {/* Doctors Grid */}
      {error && !doctors.length ? (
        <ErrorState message={error} onRetry={fetchDoctors} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
