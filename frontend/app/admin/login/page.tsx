'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <path d="M1 1l22 22"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
};

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        setError('Anda tidak memiliki akses ke panel admin');
        setLoading(false);
        return;
      }

      setAuth(user, token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-[#fafbfc]">
        <div className="w-full max-w-md animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
              <Icons.Hospital />
            </div>
            <span className="font-bold text-xl text-[#1a1d23] tracking-tight">MediCare</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d9488]/10 text-[#0d9488] rounded-full text-sm font-semibold mb-4">
              <Icons.Shield />
              <span>Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a1d23] mb-2">Masuk Administrator</h1>
            <p className="text-[#6b7280]">Gunakan kredensial admin untuk mengakses panel</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-[#fee2e2] border border-[#fecaca] rounded-xl flex items-start gap-3 animate-scale-in">
              <div className="w-8 h-8 rounded-lg bg-[#fecaca] flex items-center justify-center text-[#dc2626] flex-shrink-0">
                <Icons.AlertCircle />
              </div>
              <p className="font-medium text-[#dc2626]">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <label htmlFor="email" className="label">Email Admin</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                  <Icons.User />
                </div>
                <input
                  type="email"
                  id="email"
                  className="input-field pl-12"
                  placeholder="admin@medicare.co.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                  <Icons.Lock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field pl-12 pr-12"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full mt-6 animate-slide-up opacity-0"
              disabled={loading}
              style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
            >
              {loading ? (
                <>
                  <Icons.Loading />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Panel Admin</span>
                  <Icons.ArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <p className="text-center mt-8 animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <Link href="/" className="inline-flex items-center text-[#9ca3af] hover:text-[#0d9488] transition-colors text-sm">
              ← Kembali ke Beranda
            </Link>
          </p>

          {/* User Login Link */}
          <p className="text-center mt-4 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Link href="/login" className="inline-flex items-center text-[#9ca3af] hover:text-[#0d9488] transition-colors text-sm gap-2">
              <Icons.User />
              Login sebagai Pasien
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Admin Panel Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0d9488] to-[#0f766e] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-32 right-20 w-48 h-48 border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="text-center max-w-md">
            {/* Logo Icon */}
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
              <Icons.Settings />
            </div>

            <h2 className="text-2xl font-bold mb-3">Panel Administrator</h2>
            <p className="text-[#ccfbf1] leading-relaxed mb-8">
              Kelola reservasi, pantau antrean, dan lihat statistik rumah sakit secara real-time.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icons.User />
                </div>
                <div>
                  <p className="font-semibold">Kelola Reservasi</p>
                  <p className="text-sm text-[#ccfbf1]">Atur status dan data reservasi pasien</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icons.Shield />
                </div>
                <div>
                  <p className="font-semibold">Kelola Dokter</p>
                  <p className="text-sm text-[#ccfbf1]">Lihat dan kelola data dokter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
