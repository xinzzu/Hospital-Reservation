'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface PatientFormProps {
  patient?: Patient | null;
  onSubmit: (data: { name: string; phone: string }) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function PatientForm({ patient, onSubmit, onClose, loading }: PatientFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setPhone(patient.phone || '');
    } else {
      setName('');
      setPhone('');
    }
  }, [patient]);

  const validate = useCallback(() => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (name.length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }
    if (phone && phone.length < 10) {
      newErrors.phone = 'Nomor telepon minimal 10 digit';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name: name.trim(), phone: phone.trim() });
    }
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(26, 29, 35, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '448px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          zIndex: 10000,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a1d23]">
            {patient ? 'Edit Pasien' : 'Tambah Pasien'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent ${
                errors.name ? 'border-[#dc2626]' : 'border-[#e5e7eb]'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && <p className="text-[#dc2626] text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={patient?.email || ''}
              disabled
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg bg-[#fafbfc] text-[#6b7280]"
            />
            <p className="text-[#9ca3af] text-xs mt-1">Email tidak dapat diubah</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent ${
                errors.phone ? 'border-[#dc2626]' : 'border-[#e5e7eb]'
              }`}
              placeholder="08xxxxxxxxxx"
            />
            {errors.phone && <p className="text-[#dc2626] text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl font-medium hover:bg-[#f9fafb] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0d9488] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-50"
            >
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
