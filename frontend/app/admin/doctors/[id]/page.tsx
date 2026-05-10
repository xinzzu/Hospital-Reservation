'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';

// SVG Icons
const Icons = {
  Hospital: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Building: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/>
    </svg>
  ),
  Loading: ({ className = 'w-6 h-6 animate-spin' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  Stethoscope: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
};

interface Doctor {
  id: number;
  user_id: number;
  name: string;
  specialization: string;
  room: string;
  bio: string;
  photo_url: string;
  created_at: string;
}

// Gradient colors for avatar
const gradients = [
  'from-[#0d9488] to-[#14b8a6]',
  'from-[#2563eb] to-[#3b82f6]',
  'from-[#7c3aed] to-[#8b5cf6]',
  'from-[#db2777] to-[#ec4899]',
  'from-[#ea580c] to-[#f97316]',
  'from-[#059669] to-[#10b981]',
];

export default function AdminDoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminAPI.getDoctors();
        const doctors = response.data.doctors;
        const foundDoctor = doctors.find((d: Doctor) => d.id === Number(params.id));

        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError('Dokter tidak ditemukan');
        }
      } catch (err: any) {
        console.error('Failed to fetch doctor:', err);
        setError(err.message || 'Gagal memuat data dokter');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [params.id]);

  // Get avatar gradient based on name
  const getGradient = (name: string) => {
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Get initial letter
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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

  if (error || !doctor) {
    return (
      <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <div className="card p-8 text-center">
          <p className="text-[#dc2626] mb-4">{error || 'Dokter tidak ditemukan'}</p>
          <Link href="/admin/doctors" className="btn-primary">
            Kembali ke Daftar Dokter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/doctors" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors mb-4">
          <Icons.ArrowLeft />
          <span>Kembali ke Daftar Dokter</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Detail Dokter
        </h1>
      </div>

      {/* Doctor Card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getGradient(doctor.name)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-3xl font-bold">
              {getInitial(doctor.name)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#1a1d23] mb-1">
              {doctor.name}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0fdfa] rounded-full mb-3">
              <span className="w-4 h-4 text-[#0d9488]"><Icons.Stethoscope /></span>
              <span className="text-sm font-medium text-[#0d9488]">
                {doctor.specialization}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#6b7280] mb-4 justify-center md:justify-start">
              <span className="w-5 h-5"><Icons.Building /></span>
              <span>Ruang {doctor.room}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-[#f3f4f6]">
          <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
            Bio
          </h3>
          <p className="text-[#374151] leading-relaxed">
            {doctor.bio || 'Tidak ada bio tersedia.'}
          </p>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link href="/admin/doctors" className="text-[#6b7280] hover:text-[#0d9488] transition-colors">
          ← Kembali ke Daftar Dokter
        </Link>
      </div>
    </div>
  );
}
