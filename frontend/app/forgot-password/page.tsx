'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

const Icons = {
  Hospital: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
      <path d="M9 22V12h6v10M12 9v6"/>
    </svg>
  ),
  Mail: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  Loading: () => (
    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      // Get token from response for testing (remove in production)
      if (response.data?.token) {
        setResetToken(response.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-xl text-[#1a1d23]">MediCare</span>
            </Link>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-6 text-[#059669]">
              <Icons.CheckCircle />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1d23] mb-2">Email Terkirim!</h1>
            <p className="text-[#6b7280] mb-6">
              Kami telah mengirim link reset password ke email <strong>{email}</strong>. Silakan check inbox Anda.
            </p>
            <p className="text-[#9ca3af] text-sm mb-6">
              Link akan expire dalam 15 menit.
            </p>

            {/* Dev only: Show reset link */}
            {resetToken && (
              <div className="mt-4 p-4 bg-[#fef3c7] rounded-xl text-left">
                <p className="text-xs text-[#92400e] mb-2 font-medium">Dev Mode - Reset Token:</p>
                <code className="text-xs break-all">{resetToken}</code>
                <p className="text-xs text-[#92400e] mt-2">
                  Demo URL: <Link href={`/reset-password?token=${resetToken}`} className="text-[#0d9488] underline">/reset-password?token={resetToken.substring(0, 20)}...</Link>
                </p>
              </div>
            )}

            <Link href="/login" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#0d9488] text-white rounded-xl font-medium hover:bg-[#0f766e] transition-colors">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
              <Icons.Hospital />
            </div>
            <span className="font-bold text-xl text-[#1a1d23]">MediCare</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1d23] mb-2">Lupa Password?</h1>
          <p className="text-[#6b7280]">
            Masukkan email Anda untuk menerima link reset password.
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af]">
                  <Icons.Mail />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              {error && <p className="text-[#dc2626] text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0d9488] text-white rounded-xl font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icons.Loading />
                  <span>Mengirim...</span>
                </>
              ) : (
                'Kirim Link Reset'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6b7280]">
              Ingat password Anda?{' '}
              <Link href="/login" className="text-[#0d9488] font-medium hover:text-[#0f766e]">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
