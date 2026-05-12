'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// SVG Icons
const Icons = {
  Hospital: ({ className = 'w-7 h-7' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  Calendar: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Ticket: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
    </svg>
  ),
  Clock: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Location: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Phone: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  ArrowRight: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  ArrowUpRight: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  ),
  Check: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  Shield: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Heart: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Activity: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Star: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Users: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Sparkle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  ),
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Floating Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#0d9488]/5 to-transparent blur-3xl transition-transform duration-1000"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`, top: '-200px', right: '-300px' }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#14b8a6]/5 to-transparent blur-3xl transition-transform duration-1000"
          style={{ transform: `translate(${-scrollY * 0.05}px, ${scrollY * 0.03}px)`, bottom: '-200px', left: '-200px' }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/25 group-hover:shadow-[#0d9488]/40 group-hover:scale-105 transition-all duration-300">
                  <Icons.Hospital />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#0d9488]/20 to-transparent blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#1a1d23]">MediCare</span>
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              <a href="#fitur" className="text-sm font-medium text-[#374151] hover:text-[#0d9488] transition-colors relative group">
                Fitur
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0d9488] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#tentang" className="text-sm font-medium text-[#374151] hover:text-[#0d9488] transition-colors relative group">
                Tentang
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0d9488] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#kontak" className="text-sm font-medium text-[#374151] hover:text-[#0d9488] transition-colors relative group">
                Kontak
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0d9488] group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-[#374151] hover:text-[#0d9488] transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="group relative px-6 py-3 bg-[#0d9488] text-white text-sm font-semibold rounded-full hover:bg-[#0f766e] transition-all duration-300 hover:shadow-lg hover:shadow-[#0d9488]/25 hover:-translate-y-0.5 active:translate-y-0">
                <span className="relative z-10 flex items-center gap-2">
                  Daftar
                  <span className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300">
                    <Icons.ArrowRight />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-32 left-8 w-20 h-20 border border-[#0d9488]/10 rounded-3xl rotate-12 hidden lg:block" />
        <div className="absolute top-48 right-12 w-16 h-16 bg-gradient-to-br from-[#14b8a6]/10 to-transparent rounded-full hidden lg:block" />
        <div className="absolute bottom-24 left-1/4 w-8 h-8 bg-[#0d9488]/10 rounded-full hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="lg:col-span-7 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0d9488]/5 border border-[#0d9488]/10 rounded-full mb-8 animate-fade-in">
                <div className="w-2 h-2 bg-[#0d9488] rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-[#0d9488]">Reservasi Online 24/7</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1d23] leading-[1.1] mb-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                Healthcare
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#0d9488]">Made Simple</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10c50-8 100-8 196 0" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" className="opacity-30" />
                  </svg>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-[#6b7280] leading-relaxed mb-10 max-w-xl animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                Tidak perlu lagi mengantre berjam-jam. Daftar, pilih dokter, dan reservasi jadwal
                dengan satu klik. Kesehatan Anda, solusi modern.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-14 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                <Link href="/register" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0d9488] text-white font-semibold rounded-full hover:bg-[#0f766e] transition-all duration-300 hover:shadow-xl hover:shadow-[#0d9488]/20 hover:-translate-y-1 active:translate-y-0">
                  <span className="relative z-10">Mulai Sekarang</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <Icons.ArrowRight />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link href="/doctors" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#374151] font-semibold rounded-full border border-[#e5e7eb] hover:border-[#0d9488]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <Icons.Search />
                  <span>Cari Dokter</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-[#e5e7eb]/50 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                    <Icons.Check />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1d23]">Terverifikasi</p>
                    <p className="text-xs text-[#9ca3af]">100+ Dokter Spesialis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] flex items-center justify-center text-[#2563eb]">
                    <Icons.Shield />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1d23]">Data Aman</p>
                    <p className="text-xs text-[#9ca3af]">Enkripsi End-to-End</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
                    <Icons.Clock />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1d23]">24/7</p>
                    <p className="text-xs text-[#9ca3af]">Akses Kapan Saja</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual - Floating Cards */}
            <div className="lg:col-span-5 relative h-[500px] hidden lg:block">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                <div className="relative">
                  <div className="w-72 h-80 bg-white rounded-3xl shadow-2xl shadow-[#0d9488]/10 border border-[#f3f4f6] p-6">
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white">
                        <Icons.Ticket />
                      </div>
                      <div className="px-4 py-1.5 bg-[#d1fae5] text-[#059669] text-xs font-bold rounded-full">
                        AKTIF
                      </div>
                    </div>

                    {/* Ticket Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-[#fafbfc] rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] flex items-center justify-center text-[#0d9488] font-bold text-lg">
                          DR
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1d23]">Dr. Sarah Wijaya</p>
                          <p className="text-sm text-[#6b7280]">Spesialis Jantung</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#fafbfc] rounded-xl">
                          <p className="text-xs text-[#9ca3af] mb-1">Tanggal</p>
                          <p className="font-semibold text-[#1a1d23]">15 Mei 2026</p>
                        </div>
                        <div className="p-4 bg-[#fafbfc] rounded-xl">
                          <p className="text-xs text-[#9ca3af] mb-1">Waktu</p>
                          <p className="font-semibold text-[#1a1d23]">09:00</p>
                        </div>
                      </div>

                     
                    </div>
                  </div>

                  {/* Decorative glow */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#0d9488]/10 to-transparent rounded-[2rem] blur-xl -z-10" />
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute top-8 -right-4 animate-float-delayed">
                <div className="relative">
                  <div className="w-48 bg-white rounded-2xl shadow-xl border border-[#f3f4f6] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] flex items-center justify-center text-[#0d9488]">
                        <Icons.Users />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1a1d23]">2,847</p>
                        <p className="text-xs text-[#6b7280]">Pasien Bulan Ini</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#059669] font-semibold">+12%</span>
                      <span className="text-[#9ca3af]">dari bulan lalu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Rating Card */}
              <div className="absolute bottom-12 -left-8 animate-float-more-delayed">
                <div className="relative">
                  <div className="w-44 bg-white rounded-2xl shadow-xl border border-[#f3f4f6] p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-[#f59e0b]"><Icons.Star /></span>
                      ))}
                    </div>
                    <p className="font-semibold text-[#1a1d23] mb-1">4.9/5 Rating</p>
                    <p className="text-xs text-[#6b7280]">dari 1,200+ review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="relative py-24 bg-gradient-to-b from-white to-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488]/5 rounded-full mb-6">
              <span className="text-[#0d9488]"><Icons.Sparkle /></span>
              <span className="text-sm font-semibold text-[#0d9488]">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1d23] mb-6 leading-tight">
              Semua yang Anda
              <br />
              <span className="text-[#0d9488]">Butuhkan</span>
            </h2>
            <p className="text-lg text-[#6b7280]">
              Solusi lengkap untuk pengalaman healthcare yang seamless dan bebas stres
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Search */}
            <div className="group relative bg-white rounded-3xl p-8 border border-[#f3f4f6] hover:border-[#0d9488]/20 hover:shadow-2xl hover:shadow-[#0d9488]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ccfbf1]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ccfbf1] to-[#99f6e4] flex items-center justify-center text-[#0d9488] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Search />
                </div>
                <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Cari Dokter</h3>
                <p className="text-[#6b7280] leading-relaxed mb-6">
                  Temukan dokter spesialis yang tepat berdasarkan kebutuhan kesehatan Anda
                </p>
                <div className="flex items-center gap-2 text-[#0d9488] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Selengkapnya</span>
                  <Icons.ArrowUpRight />
                </div>
              </div>
            </div>

            {/* Feature 2 - Calendar */}
            <div className="group relative bg-white rounded-3xl p-8 border border-[#f3f4f6] hover:border-[#0d9488]/20 hover:shadow-2xl hover:shadow-[#0d9488]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#dbeafe]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] flex items-center justify-center text-[#2563eb] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Calendar />
                </div>
                <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Reservasi Online</h3>
                <p className="text-[#6b7280] leading-relaxed mb-6">
                  Pilih jadwal yang tersedia dan buat reservasi dalam hitungan detik
                </p>
                <div className="flex items-center gap-2 text-[#2563eb] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Selengkapnya</span>
                  <Icons.ArrowUpRight />
                </div>
              </div>
            </div>

            {/* Feature 3 - Ticket */}
            <div className="group relative bg-white rounded-3xl p-8 border border-[#f3f4f6] hover:border-[#0d9488]/20 hover:shadow-2xl hover:shadow-[#0d9488]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fef3c7]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center text-[#d97706] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Ticket />
                </div>
                <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Tiket Digital</h3>
                <p className="text-[#6b7280] leading-relaxed mb-6">
                  Dapatkan tiket digital dengan QR code untuk verifikasi yang mudah
                </p>
                <div className="flex items-center gap-2 text-[#d97706] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Selengkapnya</span>
                  <Icons.ArrowUpRight />
                </div>
              </div>
            </div>

            {/* Feature 4 - Activity */}
            <div className="group relative bg-white rounded-3xl p-8 border border-[#f3f4f6] hover:border-[#0d9488]/20 hover:shadow-2xl hover:shadow-[#0d9488]/5 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fce7f3]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8] flex items-center justify-center text-[#db2777] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Activity />
                </div>
                <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Cek Status</h3>
                <p className="text-[#6b7280] leading-relaxed mb-6">
                  Pantau status reservasi dan posisi antrean Anda secara real-time
                </p>
                <div className="flex items-center gap-2 text-[#db2777] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Selengkapnya</span>
                  <Icons.ArrowUpRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-[#0d9488] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">100+</p>
              <p className="text-[#ccfbf1] text-lg">Dokter Spesialis</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">5K+</p>
              <p className="text-[#ccfbf1] text-lg">Pasien Terlayani</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">15+</p>
              <p className="text-[#ccfbf1] text-lg">Spesialisasi</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">24/7</p>
              <p className="text-[#ccfbf1] text-lg">Layanan Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="relative py-24 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Main Circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] opacity-10" />
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] opacity-20" />
                <div className="absolute inset-24 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] opacity-30" />

                {/* Center Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white">
                    <Icons.Hospital />
                  </div>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-orbit">
                  <Icons.Users />
                </div>
                <div className="absolute bottom-8 right-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-orbit-delayed">
                  <Icons.Calendar />
                </div>
                <div className="absolute bottom-8 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-orbit-more-delayed">
                  <Icons.Ticket />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488]/5 rounded-full mb-6">
                <span className="text-[#0d9488]"><Icons.Heart /></span>
                <span className="text-sm font-semibold text-[#0d9488]">Tentang Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1d23] mb-6 leading-tight">
                Mengubah Cara
                <br />
                <span className="text-[#0d9488]">Healthcare Bekerja</span>
              </h2>
              <p className="text-lg text-[#6b7280] leading-relaxed mb-8">
                MediCare adalah platform reservasi dokter online yang dirancang untuk
                membuat pengalaman healthcare Anda lebih mudah, cepat, dan efisien.
                Kami percaya bahwa setiap orang berhak mendapatkan akses ke layanan kesehatan yang berkualitas.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Pendaftaran online tanpa antre',
                  'Pemilihan dokter dan jadwal fleksibel',
                  'Notifikasi pengingat otomatis',
                  'Riwayat kesehatan digital',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                      <Icons.Check />
                    </div>
                    <span className="text-[#374151] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-[#0d9488] text-white font-semibold rounded-full hover:bg-[#0f766e] transition-all duration-300 hover:shadow-lg hover:shadow-[#0d9488]/20">
                <span>Bergabung Sekarang</span>
                <Icons.ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d9488] via-[#0f766e] to-[#115e59]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 3px 3px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Siap untuk Perubahan?
          </h2>
          <p className="text-xl text-[#ccfbf1] mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan reservasi dokter online
          </p>

          <Link href="/register" className="group inline-flex items-center gap-4 bg-white text-[#0d9488] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#f9fafb] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span>Daftar Gratis Sekarang</span>
            <div className="w-10 h-10 rounded-full bg-[#0d9488] flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
              <Icons.ArrowRight />
            </div>
          </Link>

          <p className="text-[#99f6e4] text-sm mt-8 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            ✨ Tidak ada biaya pendaftaran. Gratis selamanya.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Location */}
            <div className="group p-8 bg-[#fafbfc] rounded-3xl hover:bg-[#ccfbf1]/20 transition-colors duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#ccfbf1] flex items-center justify-center text-[#0d9488] mb-6 group-hover:scale-110 transition-transform">
                <Icons.Location />
              </div>
              <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Lokasi</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Jl. Rumah Sakit Sehat No. 1<br />
                Jakarta Selatan 12345<br />
                Indonesia
              </p>
            </div>

            {/* Contact */}
            <div className="group p-8 bg-[#fafbfc] rounded-3xl hover:bg-[#dbeafe]/20 transition-colors duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#dbeafe] flex items-center justify-center text-[#2563eb] mb-6 group-hover:scale-110 transition-transform">
                <Icons.Phone />
              </div>
              <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Kontak</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Telp: (021) 1234-5678<br />
                WhatsApp: 0812-3456-7890<br />
                Email: info@medicare.id
              </p>
            </div>

            {/* Hours */}
            <div className="group p-8 bg-[#fafbfc] rounded-3xl hover:bg-[#fef3c7]/20 transition-colors duration-500">
              <div className="w-16 h-16 rounded-2xl bg-[#fef3c7] flex items-center justify-center text-[#d97706] mb-6 group-hover:scale-110 transition-transform">
                <Icons.Clock />
              </div>
              <h3 className="text-xl font-bold text-[#1a1d23] mb-3">Jam Operasional</h3>
              <p className="text-[#6b7280] leading-relaxed">
                Senin - Jumat: 07:00 - 21:00<br />
                Sabtu: 07:00 - 14:00<br />
                Minggu: Tutup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1d23] text-[#9ca3af] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white">
                  <Icons.Hospital />
                </div>
                <span className="font-bold text-2xl text-white">MediCare</span>
              </Link>
              <p className="text-[#9ca3af] leading-relaxed max-w-md mb-6">
                Platform reservasi dokter online yang membuat healthcare lebih mudah dan acessível untuk semua orang.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#374151] flex items-center justify-center hover:bg-[#4b5563] transition-colors cursor-pointer">
                  <Icons.Shield />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#374151] flex items-center justify-center hover:bg-[#4b5563] transition-colors cursor-pointer">
                  <Icons.Heart />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#374451] flex items-center justify-center hover:bg-[#4b5563] transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Layanan</h4>
              <ul className="space-y-3">
                <li><Link href="/doctors" className="hover:text-[#0d9488] transition-colors">Cari Dokter</Link></li>
                <li><Link href="/register" className="hover:text-[#0d9488] transition-colors">Daftar Sekarang</Link></li>
                <li><Link href="/login" className="hover:text-[#0d9488] transition-colors">Masuk</Link></li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-3">
                <li><a href="#tentang" className="hover:text-[#0d9488] transition-colors">Tentang</a></li>
                <li><a href="#fitur" className="hover:text-[#0d9488] transition-colors">Fitur</a></li>
                <li><a href="#kontak" className="hover:text-[#0d9488] transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#374451] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2026 MediCare - RSUD Sehat Selalu. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Dibuat dengan</span>
              <span className="text-[#db2777]"><Icons.Heart /></span>
              <span>di Indonesia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}