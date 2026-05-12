'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { adminAPI, reservationsAPI } from '@/lib/api';
import ReservationTable from '@/components/admin/ReservationTable';
import { useToast } from '@/components/admin/ToastProvider';

// SVG Icons
const Icons = {
  Search: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Filter: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  X: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronLeft: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  RefreshCw: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0115-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 01-15 6.7L3 16" />
    </svg>
  ),
  AlertCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Calendar: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

// Types
interface ReservationWithDetails {
  id: number;
  queue_code: string;
  status: string;
  reservation_date: string;
  doctor_name: string;
  doctor_specialization: string;
  patient_name?: string;
  patient_phone?: string;
}

interface FilterState {
  search: string;
  status: string;
  date: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Status options
const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'dipanggil', label: 'Dipanggil' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'batal', label: 'Batal' },
];

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
        <span className="text-[#dc2626]"><Icons.AlertCircle /></span>
      </div>
      <h3 className="text-lg font-semibold text-[#1a1d23] mb-2">
        Gagal memuat data
      </h3>
      <p className="text-[#6b7280] mb-4">
        {message || 'Terjadi kesalahan saat mengambil data reservasi.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors font-medium"
      >
        <Icons.RefreshCw />
        Coba Lagi
      </button>
    </div>
  );
}

export default function AdminReservationsPage() {
  const { showToast } = useToast();

  // State
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    date: '',
  });

  // Pagination
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  // Fetch reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number | undefined> = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const response = await adminAPI.getReservations(params);
      const apiResponse = response.data as {
        data: ReservationWithDetails[];
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
      setReservations(apiResponse.data);
      setPagination((prev) => ({
        ...prev,
        total: apiResponse.total,
        total_pages: apiResponse.total_pages,
      }));
    } catch (err: any) {
      console.error('Failed to fetch reservations:', err);
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data reservasi');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status, filters.date]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReservations();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      date: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchReservations();
  };

  // Handle status change
  const handleStatusChange = async (code: string, newStatus: string) => {
    const reservation = reservations.find((r) => r.queue_code === code);
    if (!reservation || reservation.status === newStatus) return;

    setUpdatingCode(code);

    try {
      await reservationsAPI.updateStatus(code, newStatus);
      showToast(`Status reservasi ${code} berhasil diperbarui`, 'success');

      setReservations((prev) =>
        prev.map((r) => (r.queue_code === code ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast(err.response?.data?.message || 'Gagal memperbarui status reservasi', 'error');
    } finally {
      setUpdatingCode(null);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const { page, total_pages } = pagination;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total_pages <= maxVisible) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(total_pages);
      } else if (page >= total_pages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total_pages - 3; i <= total_pages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
        pages.push(total_pages);
      }
    }

    return pages;
  };

  // Calculate showing range
  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23]">
          Kelola Reservasi
        </h1>
        <p className="text-[#6b7280] mt-1">
          Daftar semua reservasi pasien
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#6b7280] mb-1.5">
              Cari Reservasi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ca3af]">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Nama pasien atau kode antrian..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-[#6b7280] mb-1.5">
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ca3af]">
                <Icons.Filter />
              </div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div className="w-full sm:w-44">
            <label className="block text-sm font-medium text-[#6b7280] mb-1.5">
              Tanggal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ca3af]">
                <Icons.Calendar />
              </div>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2.5 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Icons.Filter />
              Terapkan
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 border border-[#e5e7eb] text-[#6b7280] rounded-lg hover:bg-[#f9fafb] transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Icons.X />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {error && !reservations.length ? (
        <ErrorState message={error} onRetry={fetchReservations} />
      ) : (
        <>
          <ReservationTable
            reservations={reservations}
            onStatusChange={handleStatusChange}
            loading={loading}
          />

          {/* Pagination */}
          {!error && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Showing info */}
              <p className="text-sm text-[#6b7280]">
                Menampilkan <span className="font-medium text-[#1a1d23]">{showingFrom}</span>-<span className="font-medium text-[#1a1d23]">{showingTo}</span> dari <span className="font-medium text-[#1a1d23]">{pagination.total}</span> data
              </p>

              {/* Pagination controls */}
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icons.ChevronLeft />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, index) =>
                    p === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-2 text-[#9ca3af]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-colors ${
                          pagination.page === p
                            ? 'bg-[#0d9488] text-white'
                            : 'border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.total_pages}
                  className="p-2 rounded-lg border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}