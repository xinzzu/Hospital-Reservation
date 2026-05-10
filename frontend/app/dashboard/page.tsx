'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hospitalAPI, reservationsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
};

interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  emergency_phone: string;
}

interface Reservation {
  id: number;
  queue_code: string;
  doctor_name: string;
  doctor_specialization: string;
  reservation_date: string;
  schedule_start_time: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [hospitalRes, reservationsRes] = await Promise.all([
          hospitalAPI.getInfo(),
          reservationsAPI.getMyReservations(),
        ]);

        setHospitalInfo(hospitalRes.data);

        const reservations = reservationsRes.data.reservations || [];
        const today = new Date().toISOString().split('T')[0];
        const upcoming = reservations.filter(
          (r: Reservation) => r.reservation_date >= today && r.status !== 'batal'
        );
        setUpcomingReservations(upcoming.slice(0, 3));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [_hasHydrated, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      menunggu: { bg: 'badge-amber', text: 'text-[#d97706]', label: 'Menunggu' },
      dipanggil: { bg: 'badge-blue', text: 'text-[#2563eb]', label: 'Dipanggil' },
      selesai: { bg: 'badge-emerald', text: 'text-[#059669]', label: 'Selesai' },
      batal: { bg: 'badge-red', text: 'text-[#dc2626]', label: 'Batal' },
    };
    return badges[status] || { bg: 'badge-gray', text: 'text-[#6b7280]', label: status };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading || !_hasHydrated) {
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

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-lg text-[#1a1d23] tracking-tight">MediCare</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-[#e5e7eb]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                  <Icons.User />
                </div>
                <span className="font-medium text-[#374151]">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-xl transition-all"
              >
                <Icons.Logout />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
            Halo, <span className="text-[#0d9488]">{user?.name}</span>
          </h1>
          <p className="text-[#6b7280] mt-1">Selamat datang di MediCare</p>
        </div>

        {/* Hospital Info */}
        <div className="card p-6 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                <Icons.Hospital />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1a1d23]">{hospitalInfo?.name}</h2>
                <p className="text-sm text-[#6b7280]">{hospitalInfo?.address}</p>
                <p className="text-sm text-[#6b7280]">Telp: {hospitalInfo?.phone} | IGD: {hospitalInfo?.emergency_phone}</p>
              </div>
            </div>
            <Link href="/doctors" className="btn-primary inline-flex items-center gap-2">
              <Icons.Search />
              <span>Cari Dokter</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link href="/doctors" className="card card-hover p-5 flex items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] flex items-center justify-center text-[#0d9488]">
              <Icons.Search />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1d23]">Cari Dokter</h3>
              <p className="text-sm text-[#6b7280]">Temukan dokter spesialisasi</p>
            </div>
          </Link>

          <Link href="/reservations/me" className="card card-hover p-5 flex items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] flex items-center justify-center text-[#2563eb]">
              <Icons.Calendar />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1d23]">Riwayat Reservasi</h3>
              <p className="text-sm text-[#6b7280]">Lihat semua reservasi</p>
            </div>
          </Link>

          <Link href={`tel:${hospitalInfo?.phone}`} className="card card-hover p-5 flex items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center text-[#d97706]">
              <Icons.Phone />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1d23]">Hubungi Kami</h3>
              <p className="text-sm text-[#6b7280]">{hospitalInfo?.phone}</p>
            </div>
          </Link>
        </div>

        {/* Upcoming Reservations */}
        <div className="card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                <Icons.Ticket />
              </div>
              <h2 className="text-lg font-bold text-[#1a1d23]">Reservasi Mendatang</h2>
            </div>
            <Link href="/reservations/me" className="text-[#0d9488] font-medium hover:text-[#0f766e] transition-colors inline-flex items-center gap-1">
              Lihat Semua
              <Icons.ArrowRight />
            </Link>
          </div>

          {upcomingReservations.length > 0 ? (
            <div className="space-y-3">
              {upcomingReservations.map((res) => {
                const badge = getStatusBadge(res.status);
                return (
                  <Link
                    key={res.id}
                    href={`/ticket/${res.queue_code}`}
                    className="block p-4 bg-[#fafbfc] rounded-xl border border-[#f3f4f6] hover:border-[#e5e7eb] hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-[#1a1d23] group-hover:text-[#0d9488] transition-colors">{res.doctor_name}</h3>
                          <span className={`badge ${badge.bg}`}>{badge.label}</span>
                        </div>
                        <p className="text-sm text-[#6b7280] mb-2">{res.doctor_specialization}</p>
                        <div className="flex items-center gap-4 text-sm text-[#9ca3af]">
                          <span className="inline-flex items-center gap-1"><Icons.Calendar />{formatDate(res.reservation_date)}</span>
                          <span className="inline-flex items-center gap-1"><Icons.Clock />{res.schedule_start_time}</span>
                        </div>
                      </div>
                      <span className="hidden md:block font-mono text-sm text-[#0d9488] font-semibold bg-[#ccfbf1] px-3 py-1.5 rounded-lg">
                        {res.queue_code}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#fafbfc] rounded-xl border border-[#f3f4f6]">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] flex items-center justify-center mx-auto mb-3">
                <Icons.Activity />
              </div>
              <p className="text-[#6b7280] mb-4">Belum ada reservasi mendatang</p>
              <Link href="/doctors" className="btn-primary inline-flex items-center gap-2">
                <Icons.Search />
                <span>Buat Reservasi Baru</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}