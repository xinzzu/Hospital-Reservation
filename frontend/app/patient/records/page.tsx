'use client';

import { useEffect, useState } from 'react';
import { fhirAPI, type FHIRCondition } from '@/lib/api';

export default function MedicalRecordsPage() {
  const [conditions, setConditions] = useState<FHIRCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fhirAPI.getConditions();
        setConditions(response.data.entry || []);
      } catch (err) {
        console.error('Failed to fetch conditions:', err);
        setError('Gagal memuat rekam medis. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'recurrence':
        return 'bg-orange-100 text-orange-800';
      case 'inactive':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'remission':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'severe':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        <h1 className="text-2xl font-bold text-gray-900">Rekam Medis</h1>
        <p className="mt-1 text-sm text-gray-600">Riwayat diagnosis dan kondisi kesehatan</p>
      </div>

      {/* Conditions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Diagnosis & Kondisi</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {conditions.length > 0 ? (
            conditions.map((condition) => (
              <div key={condition.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {condition.codeDisplay || 'Diagnosis Tidak Diketahui'}
                      </h3>
                      {condition.clinicalStatus && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(condition.clinicalStatus)}`}>
                          {condition.clinicalStatus === 'active' ? 'Aktif' :
                           condition.clinicalStatus === 'recurrence' ? 'Kambuh' :
                           condition.clinicalStatus === 'inactive' ? 'Tidak Aktif' :
                           condition.clinicalStatus === 'resolved' ? 'Sembuh' :
                           condition.clinicalStatus}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      {condition.codeCode && (
                        <span>{condition.codeCode}</span>
                      )}
                      {condition.codeSystem && (
                        <>
                          <span>•</span>
                          <span>{condition.codeSystem}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      {condition.severity && (
                        <p className={`${getSeverityColor(condition.severity)}`}>
                          Severity: <span className="font-medium capitalize">{condition.severity}</span>
                        </p>
                      )}
                      {condition.onsetDateTime && (
                        <p className="text-gray-600">
                          Onset: <span className="font-medium">{formatDate(condition.onsetDateTime)}</span>
                        </p>
                      )}
                      {condition.category && (
                        <p className="text-gray-600">
                          Kategori: <span className="font-medium">{condition.category}</span>
                        </p>
                      )}
                    </div>
                    {condition.note && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">{condition.note}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(condition.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Belum ada rekam medis</p>
              <p className="mt-1 text-xs text-gray-400">Rekam medis akan muncul setelah kunjungan dokter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}