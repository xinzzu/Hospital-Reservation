'use client';

import Link from 'next/link';

// SVG Icons - Clean Medical Style
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
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
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
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
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-lg text-[#1a1d23] tracking-tight">MediCare</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-[#6b7280] hover:text-[#0d9488] font-medium transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccfbf1] text-[#0d9488] rounded-full text-sm font-semibold mb-6">
                <Icons.CheckCircle />
                <span>Reservasi Online 24 Jam</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#1a1d23] leading-tight mb-6">
                Antrean Digital
                <br />
                <span className="text-[#0d9488]">Tanpa Repot</span>
              </h1>

              <p className="text-lg text-[#6b7280] mb-8 leading-relaxed max-w-lg">
                Daftar dan reservasi jadwal dokter secara online dengan mudah.
                Hemat waktu, kesehatan lebih terjamin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn-primary">
                  <span>Mulai Reservasi</span>
                  <Icons.ArrowRight />
                </Link>
                <Link href="/login" className="btn-secondary">
                  <span>Sudah Punya Akun</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#e5e7eb]">
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <div className="w-8 h-8 rounded-lg bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                    <Icons.CheckCircle />
                  </div>
                  <span className="text-sm font-medium">Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <div className="w-8 h-8 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#2563eb]">
                    <Icons.Shield />
                  </div>
                  <span className="text-sm font-medium">Data Aman</span>
                </div>
              </div>
            </div>

            {/* Right Content - Clean Card */}
            <div className="hidden lg:flex justify-center animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <div className="card p-8 shadow-xl max-w-sm w-full">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] flex items-center justify-center mx-auto mb-6">
                    <Icons.Ticket />
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d1fae5] text-[#059669] rounded-full text-sm font-semibold mb-3">
                    <Icons.CheckCircle />
                    <span>TIKET AKTIF</span>
                  </div>
                  <p className="text-[#6b7280] text-sm">Scan QR code untuk verifikasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-bold text-[#1a1d23] mb-4">
              Fitur Kami
            </h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Solusi lengkap untuk kebutuhan kesehatan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="card card-hover p-6 animate-slide-up opacity-0 stagger-1" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] flex items-center justify-center text-[#0d9488] mb-5">
                <Icons.Search />
              </div>
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2">Cari Dokter</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Temukan dokter berdasarkan spesialisasi yang Anda butuhkan
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover p-6 animate-slide-up opacity-0 stagger-2" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] flex items-center justify-center text-[#2563eb] mb-5">
                <Icons.Calendar />
              </div>
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2">Reservasi Online</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Pilih jadwal dan buat reservasi tanpa antre panjang
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover p-6 animate-slide-up opacity-0 stagger-3" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center text-[#d97706] mb-5">
                <Icons.Ticket />
              </div>
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2">Tiket Digital</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Tiket digital dengan QR code untuk antrean Anda
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover p-6 animate-slide-up opacity-0 stagger-4" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8] flex items-center justify-center text-[#db2777] mb-5">
                <Icons.Activity />
              </div>
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2">Cek Status</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Pantau status reservasi Anda kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Location */}
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-[#ccfbf1] flex items-center justify-center text-[#0d9488] mb-4">
                <Icons.Location />
              </div>
              <h3 className="text-base font-bold text-[#1a1d23] mb-2">Lokasi</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Jl. Rumah Sakit No. 1<br />
                Jakarta Selatan 12345
              </p>
            </div>

            {/* Contact */}
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#2563eb] mb-4">
                <Icons.Phone />
              </div>
              <h3 className="text-base font-bold text-[#1a1d23] mb-2">Kontak</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Telp: (021) 1234-5678<br />
                IGD: (021) 1234-9999
              </p>
            </div>

            {/* Hours */}
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-[#fef3c7] flex items-center justify-center text-[#d97706] mb-4">
                <Icons.Clock />
              </div>
              <h3 className="text-base font-bold text-[#1a1d23] mb-2">Jam Operasional</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Senin - Jumat: 07:00 - 21:00<br />
                Sabtu: 07:00 - 14:00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap untuk Reservasi?
          </h2>
          <p className="text-[#ccfbf1] text-lg mb-10">
            Daftar sekarang dan dapatkan kemudahan dalam reservasi dokter. Gratis!
          </p>

          <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-[#0d9488] px-10 py-4 rounded-xl font-bold hover:bg-[#f9fafb] transition-all shadow-xl">
            <span className="text-lg">Daftar Sekarang - Gratis!</span>
            <Icons.ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1d23] text-[#9ca3af] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#374151] flex items-center justify-center text-white">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-white">MediCare</span>
            </div>

            <p className="text-sm">
              © 2026 MediCare - RSUD Sehat Selalu. Hak Cipta Dilindungi.
            </p>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#374151] flex items-center justify-center hover:bg-[#4b5563] transition-colors cursor-pointer">
                <Icons.Shield />
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#374151] flex items-center justify-center hover:bg-[#4b5563] transition-colors cursor-pointer">
                <Icons.Heart />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}