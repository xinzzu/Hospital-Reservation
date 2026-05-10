"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { reservationsAPI } from "@/lib/api";

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M23 4v6h-6M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
};

interface Reservation {
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

export default function TicketPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservation = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await reservationsAPI.getByCode(params.code as string);
      setReservation(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [params.code]);

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { bg: string; text: string; border: string; icon: JSX.Element; label: string }> = {
      menunggu: { bg: 'bg-[#fef3c7]', text: 'text-[#d97706]', border: 'border-[#fde68a]', icon: <Icons.Clock />, label: 'Menunggu' },
      dipanggil: { bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]', border: 'border-[#bfdbfe]', icon: <Icons.Bell />, label: 'Dipanggil' },
      selesai: { bg: 'bg-[#d1fae5]', text: 'text-[#059669]', border: 'border-[#a7f3d0]', icon: <Icons.Check />, label: 'Selesai' },
      batal: { bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]', border: 'border-[#fecaca]', icon: <Icons.AlertCircle />, label: 'Batal' },
    };
    return statuses[status] || { bg: 'bg-[#f3f4f6]', text: 'text-[#6b7280]', border: 'border-[#e5e7eb]', icon: <Icons.AlertCircle />, label: status };
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

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

  if (!reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4">
        <div className="w-16 h-16 rounded-xl bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
          <Icons.AlertCircle />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1d23] mb-2">Tiket Tidak Ditemukan</h2>
        <p className="text-[#6b7280] mb-6">Kode reservasi tidak valid</p>
        <Link href="/" className="btn-primary">Kembali ke Beranda</Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(reservation.status);

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
              <Icons.Hospital />
            </div>
            <span className="font-bold text-lg text-[#1a1d23]">MediCare</span>
          </Link>
        </div>

        {/* Ticket Card */}
        <div className="card overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          {/* Header */}
          <div className="gradient-hero text-white text-center py-8 px-6">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
              <Icons.Ticket />
            </div>
            <h2 className="text-xl font-bold">TIKET ANTRIAN</h2>
          </div>

          {/* QR Code */}
          <div className="bg-[#fafbfc] py-10 flex justify-center animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-[#f3f4f6]">
              <QRCodeSVG value={reservation.queue_code} size={180} level="H" includeMargin={true} />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="px-6 py-6 text-center border-b border-[#f3f4f6] animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <h3 className="text-xl font-bold text-[#1a1d23] mb-1">{reservation.doctor_name}</h3>
            <p className="text-[#0d9488] font-semibold">{reservation.doctor_specialization}</p>
          </div>

          {/* Details */}
          <div className="px-6 py-6 animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#2563eb]">
                  <Icons.Calendar />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] font-medium">Tanggal Kunjungan</p>
                  <p className="font-semibold text-[#1a1d23]">{formatDate(reservation.reservation_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                  <Icons.Clock />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] font-medium">Jadwal</p>
                  <p className="font-semibold text-[#1a1d23]">{reservation.schedule_start_time} - {reservation.schedule_end_time} WIB</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#fce7f3] flex items-center justify-center text-[#db2777]">
                  <Icons.Location />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af] font-medium">Lokasi</p>
                  <p className="font-semibold text-[#1a1d23]">Ruang {reservation.doctor_room}</p>
                </div>
              </div>
            </div>

            {/* Queue Number */}
            <div className="bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] rounded-2xl p-6 text-center mb-6 border border-[#a7f3d0]">
              <p className="text-sm text-[#0d9488] font-semibold mb-2">NOMOR ANTRIAN</p>
              <p className="text-6xl font-bold text-[#0d9488] font-mono">{String(reservation.queue_number).padStart(3, "0")}</p>
            </div>

            {/* Status */}
            <div className={`${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} rounded-2xl p-5 text-center border-2 flex items-center justify-center gap-3`}>
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">{statusInfo.icon}</div>
              <span className="text-lg font-bold">{statusInfo.label}</span>
            </div>

            {reservation.notes && (
              <div className="mt-4 p-4 bg-[#fef3c7] rounded-xl border border-[#fde68a]">
                <p className="text-xs text-[#d97706] font-medium mb-1">Catatan:</p>
                <p className="text-[#92400e]">{reservation.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-[#fafbfc] text-center border-t border-[#f3f4f6]">
            <p className="text-[#9ca3af] text-sm mb-2">Segera hadir 30 menit sebelum jadwal</p>
            <p className="text-xs text-[#9ca3af] font-mono bg-white px-3 py-1.5 rounded-lg inline-block">{reservation.queue_code}</p>
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-4 p-4 bg-[#dbeafe] rounded-xl border border-[#bfdbfe] text-center animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <p className="text-[#2563eb] text-sm font-medium">Segera hadir 30 menit sebelum jadwal praktik</p>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-3 animate-slide-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <button onClick={() => fetchReservation(false)} disabled={refreshing} className="w-full btn-secondary flex items-center justify-center gap-2">
            <Icons.Refresh />
            <span>{refreshing ? "Memuat..." : "Refresh Status"}</span>
          </button>
          <Link href="/dashboard" className="block w-full text-center py-3 border border-[#e5e7eb] rounded-xl font-medium text-[#6b7280] hover:bg-[#f9fafb] transition-colors">
            <span className="inline-flex items-center gap-2"><Icons.ArrowLeft />Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}