'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PatientTable from '@/components/admin/PatientTable';
import PatientForm from '@/components/admin/PatientForm';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/components/admin/ToastProvider';

const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2v6h-6"/>
      <path d="M3 12a9 9 0 0115-6.7L21 8"/>
      <path d="M3 22v-6h6"/>
      <path d="M21 12a9 9 0 01-15 6.7L3 16"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPatientsPage() {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ search: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const response = await adminAPI.getPatients(params);
      const data = response.data;
      setPatients(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        total_pages: data.total_pages,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data pasien');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Yakin ingin menonaktifkan pasien ini?')) return;
    try {
      await adminAPI.deactivatePatient(id);
      showToast('Pasien berhasil dinonaktifkan', 'success');
      fetchPatients();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal menonaktifkan pasien', 'error');
    }
  };

  const handleSubmitEdit = async (data: { name: string; phone: string }) => {
    if (!selectedPatient) return;
    try {
      await adminAPI.updatePatient(selectedPatient.id, data);
      showToast('Data pasien berhasil diperbarui', 'success');
      setShowEditModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gagal memperbarui pasien', 'error');
    }
  };

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">Kelola Pasien</h1>
          </div>
          <p className="text-[#6b7280]">Daftar semua pasien terdaftar</p>
        </div>
        <button onClick={fetchPatients} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors">
          <Icons.RefreshCw />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#6b7280] mb-1.5">Cari</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ca3af]">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Nama atau email..."
                value={filters.search}
                onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] text-sm"
              />
            </div>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-[#6b7280] mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4 text-[#dc2626]">
            <Icons.AlertCircle />
          </div>
          <p className="text-[#dc2626]">{error}</p>
          <button onClick={fetchPatients} className="mt-4 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e]">Coba Lagi</button>
        </div>
      ) : (
        <>
          <PatientTable
            patients={patients}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            loading={loading}
          />

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">
              Halaman {pagination.page} dari {pagination.total_pages || 1}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-50"
              >
                <Icons.ChevronLeft />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.total_pages}
                className="p-2 rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-50"
              >
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPatient && (
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleSubmitEdit}
          onClose={() => { setShowEditModal(false); setSelectedPatient(null); }}
        />
      )}
    </div>
  );
}
