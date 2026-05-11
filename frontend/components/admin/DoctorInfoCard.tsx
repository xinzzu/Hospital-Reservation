'use client';

import Link from 'next/link';

interface DoctorInfo {
  id: number;
  name: string;
  specialization: string;
  room: string;
  photo_url?: string;
}

interface DoctorInfoCardProps {
  doctor: DoctorInfo;
}

const Icons = {
  Stethoscope: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  Building: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/>
    </svg>
  ),
  ExternalLink: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
};

const gradients = [
  'from-[#0d9488] to-[#14b8a6]',
  'from-[#2563eb] to-[#3b82f6]',
  'from-[#7c3aed] to-[#8b5cf6]',
  'from-[#db2777] to-[#ec4899]',
  'from-[#ea580c] to-[#f97316]',
  'from-[#059669] to-[#10b981]',
];

export default function DoctorInfoCard({ doctor }: DoctorInfoCardProps) {
  const getGradient = (name: string) => gradients[name.charCodeAt(0) % gradients.length];
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a1d23]">Informasi Dokter</h3>
        <Link
          href={`/admin/doctors/${doctor.id}`}
          className="inline-flex items-center gap-1 text-sm text-[#0d9488] hover:text-[#0f766e] transition-colors"
        >
          Lihat Profil
          <Icons.ExternalLink />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getGradient(doctor.name)} flex items-center justify-center text-white text-xl font-bold`}>
          {getInitial(doctor.name)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#1a1d23]">{doctor.name}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-[#0d9488]">
              <Icons.Stethoscope />
              {doctor.specialization}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
              <Icons.Building />
              Ruang {doctor.room}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
