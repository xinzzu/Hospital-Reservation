'use client';

import { useEffect, useState } from 'react';
import { fhirAPI, type FHIRMedicationRequest } from '@/lib/api';

export default function PrescriptionsPage() {
  const [medications, setMedications] = useState<FHIRMedicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fhirAPI.getMedications();
        setMedications(response.data.entry || []);
      } catch (err) {
        console.error('Failed to fetch medications:', err);
        setError('Gagal memuat resep. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'on-hold':
        return 'Ditunda';
      case 'cancelled':
        return 'Dibatalkan';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resep Obat</h1>
        <p className="mt-1 text-sm text-gray-600">Riwayat resep dan pengobatan</p>
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Resep</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {medications.length > 0 ? (
            medications.map((med) => (
              <div key={med.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {med.medicationDisplay || med.medicationCode || 'Obat Tidak Dikenal'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(med.status)}`}>
                        {getStatusLabel(med.status)}
                      </span>
                    </div>
                    {med.medicationCode && (
                      <p className="mt-1 text-sm text-gray-500">
                        Kode: {med.medicationCode}
                        {med.medicationSystem && <span> • {med.medicationSystem}</span>}
                      </p>
                    )}
                    <div className="mt-3 space-y-2">
                      {med.dosageText && (
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm text-gray-700">{med.dosageText}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {med.dosageRoute && (
                          <p>Cara pakai: <span className="font-medium">{med.dosageRoute}</span></p>
                        )}
                        {med.dosageFrequency > 0 && (
                          <p>Frekuensi: <span className="font-medium">{med.dosageFrequency}x{med.dosagePeriod > 0 ? ` per ${med.dosagePeriod} ${med.dosagePeriodUnit}` : ''}</span></p>
                        )}
                        {med.dispenseQuantity > 0 && (
                          <p>Jumlah: <span className="font-medium">{med.dispenseQuantity} {med.dispenseUnit || 'unit'}</span></p>
                        )}
                      </div>
                    </div>
                    {med.note && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Catatan:</span> {med.note}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      {med.authoredOn ? formatDate(med.authoredOn) : formatDate(med.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Belum ada resep obat</p>
              <p className="mt-1 text-xs text-gray-400">Resep akan muncul setelah konsultasi dokter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}