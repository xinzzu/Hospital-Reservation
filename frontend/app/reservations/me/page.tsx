"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { reservationsAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
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
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
      <path d="M13 5v2M13 17v2M13 11v2"/>
    </svg>
  ),
};

interface Reservation {
  id: number;
  queue_code: string;
  doctor_name: string;
  doctor_specialization: string;
  doctor_room: string;
  reservation_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  queue_number: number;
  status: string;
  notes: string;
}

export default function MyReservationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await reservationsAPI.getMyReservations();
        setReservations(response.data.reservations || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; label: string }> = {
      menunggu: { bg: 'badge-amber', label: 'Menunggu' },
      dipanggil: { bg: 'badge-blue', label: 'Dipanggil' },
      selesai: { bg: 'badge-emerald', label: 'Selesai' },
      batal: { bg: 'badge-red', label: 'Batal' },
    };
    return badges[status] || { bg: 'badge-gray', label: status };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const filteredReservations = reservations.filter((res) => {
    if (filter === "active") return res.status === "menunggu" || res.status === "dipanggil";
    if (filter === "completed") return res.status === "selesai" || res.status === "batal";
    return true;
  });

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

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-lg text-[#1a1d23] tracking-tight">MediCare</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors">
              <Icons.ArrowLeft />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23] mb-2">Riwayat Reservasi</h1>
          <p className="text-[#6b7280]">Kelola semua reservasi Anda</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          {[
            { key: "all", label: "Semua", count: reservations.length },
            { key: "active", label: "Aktif", count: reservations.filter(r => r.status === "menunggu" || r.status === "dipanggil").length },
            { key: "completed", label: "Selesai", count: reservations.filter(r => r.status === "selesai" || r.status === "batal").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === tab.key ? "bg-[#0d9488] text-white shadow-lg shadow-[#0d9488]/20" : "bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-[#f9fafb]"
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === tab.key ? "bg-white/20" : "bg-[#f3f4f6]"}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Reservations List */}
        {filteredReservations.length > 0 ? (
          <div className="grid gap-4">
            {filteredReservations.map((res, index) => {
              const badge = getStatusBadge(res.status);
              const isActive = res.status === "menunggu" || res.status === "dipanggil";
              return (
                <Link
                  key={res.id}
                  href={`/ticket/${res.queue_code}`}
                  className={`group relative block overflow-hidden rounded-2xl border transition-all duration-300 animate-slide-up opacity-0 ${
                    isActive
                      ? "bg-gradient-to-br from-white to-[#f0fdfa] border-[#99f6e4] hover:border-[#14b8a6] hover:shadow-lg hover:shadow-[#0d9488]/10"
                      : "bg-white border-[#f3f4f6] hover:border-[#e5e7eb] hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14b8a6] to-[#0d9488]" />
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                      {/* Left: Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Doctor Avatar */}
                          <div className={`hidden sm:flex shrink-0 w-14 h-14 rounded-2xl items-center justify-center transition-colors ${
                            isActive
                              ? "bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white"
                              : "bg-[#f3f4f6] text-[#9ca3af] group-hover:bg-[#ccfbf1] group-hover:text-[#0d9488]"
                          }`}>
                            <Icons.Stethoscope />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Name & Badge */}
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className={`font-bold text-lg group-hover:transition-colors ${
                                isActive ? "text-[#0d9488]" : "text-[#1a1d23] group-hover:text-[#0d9488]"
                              }`}>
                                {res.doctor_name}
                              </h3>
                              <span className={`badge ${badge.bg}`}>{badge.label}</span>
                              {isActive && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#14b8a6]/10 text-[#0d9488] text-xs font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                                  Aktif
                                </span>
                              )}
                            </div>

                            {/* Specialization */}
                            <p className="text-sm text-[#6b7280] font-medium mb-3">{res.doctor_specialization}</p>

                            {/* Details Grid */}
                            <div className="grid sm:grid-cols-3 gap-2 sm:gap-4">
                              <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                                <Icons.Calendar />
                                <span className="truncate">{formatDate(res.reservation_date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                                <Icons.Clock />
                                <span>{res.schedule_start_time} - {res.schedule_end_time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                                <Icons.Location />
                                <span>Ruang {res.doctor_room}</span>
                              </div>
                            </div>

                            {/* Notes */}
                            {res.notes && (
                              <p className="mt-3 pt-3 border-t border-[#f3f4f6] text-sm text-[#9ca3af] italic">
                                Catatan: {res.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Queue Number & Actions */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-3 lg:pl-6 lg:border-l lg:border-[#f3f4f6]">
                        {/* Queue Number */}
                        <div className="text-center lg:text-right">
                          <p className="text-xs text-[#9ca3af] mb-1 uppercase tracking-wide">Nomor Antrean</p>
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl font-bold font-mono text-2xl transition-colors ${
                            isActive
                              ? "bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#0d9488]/20"
                              : "bg-[#f3f4f6] text-[#374151]"
                          }`}>
                            #{String(res.queue_number).padStart(3, "0")}
                          </div>
                        </div>

                        {/* Queue Code & Arrow */}
                        <div className="flex items-center gap-3">
                          <span className="hidden md:inline-flex items-center font-mono text-xs text-[#6b7280] bg-[#f3f4f6] px-3 py-1.5 rounded-lg">
                            {res.queue_code}
                          </span>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[#0d9488] text-white"
                              : "bg-[#f3f4f6] text-[#9ca3af] group-hover:bg-[#ccfbf1] group-hover:text-[#0d9488]"
                          }`}>
                            <Icons.ArrowRight />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="w-16 h-16 rounded-xl bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
              {filter === "all" ? <Icons.Activity /> : <Icons.Search />}
            </div>
            <h3 className="text-lg font-bold text-[#1a1d23] mb-2">
              {filter === "all" ? "Belum Ada Reservasi" : filter === "active" ? "Tidak Ada Reservasi Aktif" : "Tidak Ada Reservasi Selesai"}
            </h3>
            <p className="text-[#6b7280] mb-6">
              {filter === "all" ? "Buat reservasi pertama Anda" : "Reservasi Anda akan muncul di sini"}
            </p>
            <Link href="/doctors" className="btn-primary inline-flex items-center gap-2">
              <Icons.Search />
              <span>Cari Dokter</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}