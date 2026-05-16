'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fhirAPI, type PatientHealthSummary } from '@/lib/api';

export default function PatientDashboard() {
  const [summary, setSummary] = useState<PatientHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fhirAPI.getPatientSummary();
        setSummary(response.data);
      } catch (err) {
        console.error('Failed to fetch patient summary:', err);
        setError('Gagal memuat data kesehatan. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const conditionCount = summary?.conditions?.length || 0;
  const observationCount = summary?.observations?.length || 0;
  const medicationCount = summary?.medications?.length || 0;
  const allergyCount = summary?.allergies?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Kesehatan</h1>
        <p className="mt-1 text-sm text-gray-600">Ringkasan rekam medis dan aktivitas terbaru</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Diagnosis</p>
              <p className="text-2xl font-semibold text-gray-900">{conditionCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/patient/records" className="text-sm text-blue-600 hover:text-blue-800">
              Lihat detail →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hasil Lab</p>
              <p className="text-2xl font-semibold text-gray-900">{observationCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/patient/lab-results" className="text-sm text-blue-600 hover:text-blue-800">
              Lihat detail →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resep Obat</p>
              <p className="text-2xl font-semibold text-gray-900">{medicationCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/patient/prescriptions" className="text-sm text-blue-600 hover:text-blue-800">
              Lihat detail →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alergi</p>
              <p className="text-2xl font-semibold text-gray-900">{allergyCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/patient/allergies" className="text-sm text-blue-600 hover:text-blue-800">
              Lihat detail →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Kunjungan Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {summary?.recentEncounters && summary.recentEncounters.length > 0 ? (
            summary.recentEncounters.map((encounter) => (
              <div key={encounter.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      encounter.status === 'selesai' ? 'bg-green-500' :
                      encounter.status === 'dipanggil' ? 'bg-blue-500' :
                      encounter.status === 'menunggu' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Dr. {encounter.doctor_name}</p>
                    <p className="text-sm text-gray-500">{encounter.doctor_specialization} • {encounter.reservation_date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    encounter.status === 'selesai' ? 'bg-green-100 text-green-800' :
                    encounter.status === 'dipanggil' ? 'bg-blue-100 text-blue-800' :
                    encounter.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {encounter.status === 'menunggu' ? 'Menunggu' :
                     encounter.status === 'dipanggil' ? 'Dipanggil' :
                     encounter.status === 'selesai' ? 'Selesai' : 'Batal'}
                  </span>
                  <span className="text-sm text-gray-500">#{encounter.queue_number}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Belum ada kunjungan</p>
              <Link href="/doctors" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800">
                Buat reservasi baru →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/doctors"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Buat Reservasi</p>
              <p className="text-xs text-gray-500">Janji dengan dokter</p>
            </div>
          </Link>

          <Link
            href="/patient/appointments"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Jadwal Kunjungan</p>
              <p className="text-xs text-gray-500">Lihat semua janji</p>
            </div>
          </Link>

          <Link
            href="/patient/records"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Rekam Medis</p>
              <p className="text-xs text-gray-500">Riwayat diagnosis</p>
            </div>
          </Link>

          <Link
            href="/patient/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Update Profil</p>
              <p className="text-xs text-gray-500">Data diri & kontak</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
