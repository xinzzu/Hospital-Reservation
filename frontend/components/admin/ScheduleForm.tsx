'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ScheduleFormData {
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

interface Schedule {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

interface ScheduleFormProps {
  schedule?: Schedule | null;
  onSubmit: (data: ScheduleFormData) => void;
  onClose: () => void;
  loading?: boolean;
}

const DAYS = [
  { value: 0, label: 'Senin' },
  { value: 1, label: 'Selasa' },
  { value: 2, label: 'Rabu' },
  { value: 3, label: 'Kamis' },
  { value: 4, label: 'Jumat' },
  { value: 5, label: 'Sabtu' },
  { value: 6, label: 'Minggu' },
];

export default function ScheduleForm({ schedule, onSubmit, onClose, loading }: ScheduleFormProps) {
  const [mounted, setMounted] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [maxPatients, setMaxPatients] = useState(20);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (schedule) {
      setDayOfWeek(schedule.day_of_week);
      setStartTime(schedule.start_time);
      setEndTime(schedule.end_time);
      setMaxPatients(schedule.max_patients);
      setIsActive(schedule.is_active);
    }
  }, [schedule]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!startTime) newErrors.startTime = 'Waktu mulai wajib diisi';
    if (!endTime) newErrors.endTime = 'Waktu selesai wajib diisi';
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
    }
    if (maxPatients < 1) newErrors.maxPatients = 'Minimal 1 pasien';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        max_patients: maxPatients,
        is_active: isActive,
      });
    }
  };

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[#1a1d23]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a1d23]">
            {schedule?.id ? 'Edit Jadwal' : 'Tambah Jadwal'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Hari</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Waktu Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] ${
                  errors.startTime ? 'border-[#dc2626]' : 'border-[#e5e7eb]'
                }`}
              />
              {errors.startTime && <p className="text-[#dc2626] text-xs mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Waktu Selesai</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] ${
                  errors.endTime ? 'border-[#dc2626]' : 'border-[#e5e7eb]'
                }`}
              />
              {errors.endTime && <p className="text-[#dc2626] text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Maksimal Pasien</label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxPatients}
              onChange={(e) => setMaxPatients(Number(e.target.value))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] ${
                errors.maxPatients ? 'border-[#dc2626]' : 'border-[#e5e7eb]'
              }`}
            />
            {errors.maxPatients && <p className="text-[#dc2626] text-xs mt-1">{errors.maxPatients}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#0d9488] border-[#e5e7eb] rounded focus:ring-[#14b8a6]"
            />
            <label htmlFor="isActive" className="text-sm text-[#374151]">Jadwal aktif</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl font-medium hover:bg-[#f9fafb]">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#0d9488] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#0f766e] disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
