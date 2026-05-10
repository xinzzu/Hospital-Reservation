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
          <div className="space-y-4">
            {filteredReservations.map((res, index) => {
              const badge = getStatusBadge(res.status);
              return (
                <Link
                  key={res.id}
                  href={`/ticket/${res.queue_code}`}
                  className="block card card-hover p-5 animate-slide-up opacity-0 overflow-hidden"
                  style={{ animationDelay: `${0.3 + index * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#1a1d23] group-hover:text-[#0d9488] transition-colors">{res.doctor_name}</h3>
                        <span className={`badge ${badge.bg}`}>{badge.label}</span>
                      </div>
                      <p className="text-sm text-[#0d9488] font-medium mb-2">{res.doctor_specialization}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#9ca3af]">
                        <span className="inline-flex items-center gap-1.5"><Icons.Calendar />{formatDate(res.reservation_date)}</span>
                        <span className="inline-flex items-center gap-1.5"><Icons.Clock />{res.schedule_start_time} - {res.schedule_end_time}</span>
                        <span className="inline-flex items-center gap-1.5"><Icons.Location />Ruang {res.doctor_room}</span>
                      </div>
                      {res.notes && <p className="text-sm text-[#9ca3af] italic mt-3 pt-3 border-t border-[#f3f4f6]">Catatan: {res.notes}</p>}
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-4">
                      <div className="text-center sm:text-right">
                        <p className="text-xs text-[#9ca3af] mb-1">Nomor Antrean</p>
                        <p className="text-2xl font-bold font-mono text-[#0d9488]">#{String(res.queue_number).padStart(3, "0")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden md:block font-mono text-xs text-[#9ca3af] bg-[#f3f4f6] px-2 py-1 rounded">{res.queue_code}</span>
                        <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-[#ccfbf1] group-hover:text-[#0d9488] transition-all">
                          <Icons.ArrowRight />
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