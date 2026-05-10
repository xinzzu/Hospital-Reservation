'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { doctorsAPI, reservationsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M6 12a4 4 0 018 0 4 4 0 018 0M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
      <circle cx="8" cy="10" r="2"/>
      <circle cx="16" cy="10" r="2"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Party: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
      <path d="M5.8 11.3 2 22l10.7-3.79M4 3h.01M8 3h.01M12 3h.01M16 3h.01M20 3h.01M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M20 12h.01M6 16h.01M10 16h.01M14 16h.01M18 16h.01"/>
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M2 9a3 3 0 110 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 110-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
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
  name: string;
  specialization: string;
  room: string;
  bio: string;
  photo_url: string;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [reserving, setReserving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchDoctor = async () => {
      try {
        const response = await doctorsAPI.getById(Number(params.id));
        setDoctor(response.data.doctor);
        setSchedules(response.data.schedules || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [isAuthenticated, router, params.id]);

  const getAvailableSchedulesForDate = (dateStr: string) => {
    if (!dateStr) return [];
    const date = new Date(dateStr);
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0) dayOfWeek = 6;
    else dayOfWeek = dayOfWeek - 1;
    return schedules.filter(s => s.day_of_week === dayOfWeek && s.is_active);
  };

  const handleReserve = async () => {
    if (!selectedDate) {
      alert('Silakan pilih tanggal');
      return;
    }
    const availableSchedules = getAvailableSchedulesForDate(selectedDate);
    if (availableSchedules.length === 0) {
      alert('Tidak ada jadwal untuk tanggal ini');
      return;
    }

    setReserving(true);
    try {
      const response = await reservationsAPI.create({
        doctor_id: doctor!.id,
        schedule_id: availableSchedules[0].id,
        date: selectedDate,
        notes: notes,
      });
      setSuccess(response.data.reservation.queue_code);
      setShowModal(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Gagal membuat reservasi');
    } finally {
      setReserving(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

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

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dokter tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/doctors" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-lg text-[#1a1d23] tracking-tight">MediCare</span>
            </Link>
            <Link href="/doctors" className="flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors">
              <Icons.ArrowLeft />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Card */}
        <div className="card p-6 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img src={doctor.photo_url || "/placeholder-doctor.png"} alt={doctor.name} className="w-28 h-28 rounded-2xl object-cover shadow-lg" />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-[#1a1d23] mb-1">{doctor.name}</h1>
              <p className="text-lg text-[#0d9488] font-semibold mb-3">{doctor.specialization}</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] rounded-full text-[#6b7280]">
                <Icons.Location />
                <span>Ruang {doctor.room}</span>
              </span>
              <p className="text-[#6b7280] mt-4 leading-relaxed">{doctor.bio}</p>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="card p-6 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
              <Icons.Calendar />
            </div>
            <h2 className="text-lg font-bold text-[#1a1d23]">Jadwal Praktik</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {schedules.map((schedule, index) => (
              <div key={schedule.id} className="p-4 bg-[#fafbfc] rounded-xl border border-[#f3f4f6] animate-slide-up opacity-0" style={{ animationDelay: `${0.3 + index * 0.05}s`, animationFillMode: 'forwards' }}>
                <p className="font-bold text-[#1a1d23]">{DAY_NAMES[schedule.day_of_week === 6 ? 0 : schedule.day_of_week + 1]}</p>
                <p className="text-[#0d9488] font-medium text-sm">{schedule.start_time} - {schedule.end_time}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-[#9ca3af]">
                  <Icons.Users />
                  <span>Max {schedule.max_patients}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary w-full text-lg animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <Icons.Ticket />
          <span>Buat Reservasi</span>
        </button>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1a1d23]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1d23]">Buat Reservasi</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors">
                <Icons.X />
              </button>
            </div>

            <div className="mb-4">
              <label className="label flex items-center gap-2"><Icons.Calendar /><span>Pilih Tanggal</span></label>
              <input type="date" className="input-field" min={minDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            {selectedDate && getAvailableSchedulesForDate(selectedDate).length > 0 && (
              <div className="mb-4 p-4 bg-[#d1fae5] rounded-xl border border-[#a7f3d0]">
                <div className="flex items-center gap-2 text-[#059669] font-medium mb-1"><Icons.CheckCircle /><span>Jadwal Tersedia</span></div>
                <p className="text-[#059669]">{getAvailableSchedulesForDate(selectedDate)[0].start_time} - {getAvailableSchedulesForDate(selectedDate)[0].end_time}</p>
              </div>
            )}

            {selectedDate && getAvailableSchedulesForDate(selectedDate).length === 0 && (
              <div className="mb-4 p-4 bg-[#fee2e2] rounded-xl border border-[#fecaca]">
                <div className="flex items-center gap-2 text-[#dc2626] font-medium mb-1"><Icons.X /><span>Tidak Ada Jadwal</span></div>
                <p className="text-[#dc2626]">Dokter tidak praktik pada tanggal ini</p>
              </div>
            )}

            <div className="mb-6">
              <label className="label">Catatan (opsional)</label>
              <textarea className="input-field" rows={3} placeholder="Keluhan atau catatan..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl font-medium hover:bg-[#f9fafb] transition-colors">Batal</button>
              <button onClick={handleReserve} disabled={reserving || !selectedDate || getAvailableSchedulesForDate(selectedDate).length === 0} className="flex-1 btn-primary disabled:opacity-50">
                {reserving ? <><Icons.Loading /><span>Memproses...</span></> : <><span>Reservasi</span><Icons.ArrowRight /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-[#1a1d23]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-5 text-white">
              <Icons.Party />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1d23] mb-2">Reservasi Berhasil!</h2>
            <p className="text-[#6b7280] mb-4">Kode reservasi Anda:</p>
            <div className="bg-[#ccfbf1] rounded-xl p-4 mb-6">
              <p className="text-2xl font-mono font-bold text-[#0d9488]">{success}</p>
            </div>
            <Link href={`/ticket/${success}`} className="btn-primary inline-flex items-center gap-2 mb-3"><Icons.Ticket /><span>Lihat Tiket</span></Link>
            <button onClick={() => setSuccess('')} className="block w-full text-[#6b7280] hover:text-[#374151] py-2">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}