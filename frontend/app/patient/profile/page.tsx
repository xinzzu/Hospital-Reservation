'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/lib/api';

export default function PatientProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    };

    try {
      await userAPI.updateProfile(data);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="mt-1 text-sm text-gray-600">Kelola informasi akun dan data diri</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Informasi Akun</h2>
        </div>
        <div className="p-6">
          {message && (
            <div className={`mb-4 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user?.name || ''}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                No. Telepon
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                defaultValue={user?.phone || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Health Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Data Kesehatan</h2>
        </div>
        <div className="p-6">
          <div className="text-sm text-gray-500 mb-4">
            Data kesehatan Anda tersimpan dengan aman dan hanya dapat diakses oleh tenaga medis yang berwenang.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/patient/records"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Rekam Medis</p>
                <p className="text-xs text-gray-500">Lihat riwayat diagnosis</p>
              </div>
            </a>

            <a
              href="/patient/allergies"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Data Alergi</p>
                <p className="text-xs text-gray-500">Kelola informasi alergi</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}