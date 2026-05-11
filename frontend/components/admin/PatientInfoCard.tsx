'use client';

interface PatientInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface PatientInfoCardProps {
  patient: PatientInfo;
}

const Icons = {
  Phone: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Mail: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
};

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="card p-6">
      <h3 className="font-bold text-[#1a1d23] mb-4">Informasi Pasien</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white text-xl font-bold">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[#1a1d23]">{patient.name}</p>
          <p className="text-sm text-[#6b7280]">ID: #{patient.id}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-[#374151]">
          <span className="text-[#9ca3af]"><Icons.Phone /></span>
          <span>{patient.phone || 'Tidak tersedia'}</span>
        </div>
        <div className="flex items-center gap-3 text-[#374151]">
          <span className="text-[#9ca3af]"><Icons.Mail /></span>
          <span>{patient.email}</span>
        </div>
      </div>
    </div>
  );
}
