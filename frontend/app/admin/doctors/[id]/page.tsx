'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminAPI, doctorsAPI } from '@/lib/api';
import ScheduleForm, { ScheduleFormData } from '@/components/admin/ScheduleForm';

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
  Edit: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  Plus: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  CheckCircle: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  AlertCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

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

const DAYS = ['Senin', 'Selin', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const gradients = [
  'from-[#0d9488] to-[#14b8a6]',
  'from-[#2563eb] to-[#3b82f6]',
  'from-[#7c3aed] to-[#8b5cf6]',
  'from-[#db2777] to-[#ec4899]',
  'from-[#ea580c] to-[#f97316]',
  'from-[#059669] to-[#10b981]',
];

export default function AdminDoctorDetailPage() {
  const params = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpec, setEditSpec] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDoctor = async () => {
    try {
      const response = await doctorsAPI.getById(Number(params.id));
      setDoctor(response.data.doctor);
      setSchedules(response.data.schedules || []);
      setEditName(response.data.doctor.name);
      setEditSpec(response.data.doctor.specialization);
      setEditRoom(response.data.doctor.room || '');
      setEditBio(response.data.doctor.bio || '');
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dokter');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDoctor();
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const handleSaveDoctor = async () => {
    setSaving(true);
    try {
      await adminAPI.updateDoctor(doctor!.id, {
        name: editName,
        specialization: editSpec,
        room: editRoom,
        bio: editBio,
      });
      showToast('Dokter berhasil diperbarui', 'success');
      setEditMode(false);
      await fetchDoctor();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal memperbarui dokter', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (data: ScheduleFormData) => {
    setScheduleSaving(true);
    try {
      if (editingSchedule?.id) {
        await adminAPI.updateSchedule(editingSchedule.id, data);
        showToast('Jadwal berhasil diperbarui', 'success');
      } else {
        await adminAPI.createSchedule(doctor!.id, data);
        showToast('Jadwal berhasil ditambahkan', 'success');
      }
      setShowScheduleModal(false);
      await fetchDoctor();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal menyimpan jadwal', 'error');
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      await adminAPI.deleteSchedule(scheduleId);
      showToast('Jadwal berhasil dihapus', 'success');
      await fetchDoctor();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal menghapus jadwal', 'error');
    }
  };

  const getGradient = (name: string) => gradients[name.charCodeAt(0) % gradients.length];
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

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
          <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4 text-[#dc2626]">
            <Icons.AlertCircle />
          </div>
          <p className="text-[#dc2626] mb-4">{error || 'Dokter tidak ditemukan'}</p>
          <Link href="/admin/doctors" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg">
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">Detail Dokter</h1>
      </div>

      {/* Doctor Card */}
      <div className="card p-6 mb-6">
        {editMode ? (
          <div className="space-y-4">
            <h3 className="font-bold text-[#1a1d23]">Edit Dokter</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Nama</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Spesialisasi</label>
                <input type="text" value={editSpec} onChange={(e) => setEditSpec(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Ruang</label>
                <input type="text" value={editRoom} onChange={(e) => setEditRoom(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Bio</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditMode(false)} className="flex-1 px-4 py-2.5 border border-[#e5e7eb] rounded-lg font-medium hover:bg-[#f9fafb]">Batal</button>
              <button onClick={handleSaveDoctor} disabled={saving} className="flex-1 px-4 py-2.5 bg-[#0d9488] text-white rounded-lg font-medium hover:bg-[#0f766e] disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getGradient(doctor.name)} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-3xl font-bold">{getInitial(doctor.name)}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a1d23] mb-1">{doctor.name}</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0fdfa] rounded-full mb-3">
                      <span className="w-4 h-4 text-[#0d9488]"><Icons.Stethoscope /></span>
                      <span className="text-sm font-medium text-[#0d9488]">{doctor.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6b7280]">
                      <span className="w-5 h-5"><Icons.Building /></span>
                      <span>Ruang {doctor.room}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditMode(true)} className="p-2 text-[#6b7280] hover:text-[#0d9488] hover:bg-[#ccfbf1] rounded-lg transition-colors">
                    <Icons.Edit />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#f3f4f6]">
              <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wide mb-2">Bio</h3>
              <p className="text-[#374151] leading-relaxed">{doctor.bio || 'Tidak ada bio tersedia.'}</p>
            </div>
          </>
        )}
      </div>

      {/* Schedule Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1a1d23]">Jadwal Praktik</h3>
          <button onClick={handleAddSchedule} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d9488] text-white text-sm rounded-lg hover:bg-[#0f766e] transition-colors">
            <Icons.Plus />
            Tambah Jadwal
          </button>
        </div>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-[#6b7280]">
            <p>Belum ada jadwal praktik</p>
            <button onClick={handleAddSchedule} className="mt-2 text-[#0d9488] hover:text-[#0f766e]">
              + Tambah jadwal pertama
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-[#fafbfc] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${schedule.is_active ? 'bg-[#ccfbf1] text-[#0d9488]' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>
                    <Icons.Stethoscope />
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1d23]">{DAY_NAMES[schedule.day_of_week]}</p>
                    <p className="text-sm text-[#0d9488]">{schedule.start_time} - {schedule.end_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!schedule.is_active && <span className="text-xs text-[#9ca3af]">Nonaktif</span>}
                  <button onClick={() => handleEditSchedule(schedule)} className="p-2 text-[#6b7280] hover:text-[#0d9488] hover:bg-[#ccfbf1] rounded-lg">
                    <Icons.Edit />
                  </button>
                  <button onClick={() => handleDeleteSchedule(schedule.id)} className="p-2 text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg">
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleForm
          schedule={editingSchedule}
          onSubmit={handleSaveSchedule}
          onClose={() => setShowScheduleModal(false)}
          loading={scheduleSaving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-[#059669] text-white' : 'bg-[#dc2626] text-white'
        }`}>
          {toast.type === 'success' ? <Icons.CheckCircle /> : <Icons.AlertCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
