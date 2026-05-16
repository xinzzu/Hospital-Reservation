'use client';

import { useEffect, useState } from 'react';
import { fhirAPI, type FHIRAllergyIntolerance } from '@/lib/api';

export default function AllergiesPage() {
  const [allergies, setAllergies] = useState<FHIRAllergyIntolerance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await fhirAPI.getAllergies();
        setAllergies(response.data.entry || []);
      } catch (err) {
        console.error('Failed to fetch allergies:', err);
        setError('Gagal memuat data alergi. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllergies();
  }, []);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'high':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'low':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Data Alergi</h1>
        <p className="mt-1 text-sm text-gray-600">Riwayat alergi dan intoleransi</p>
      </div>

      {/* Allergies List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Alergi</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {allergies.length > 0 ? (
            allergies.map((allergy) => (
              <div key={allergy.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {allergy.substanceDisplay || allergy.substanceCode || 'Alergi Tidak Dikenal'}
                      </h3>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {allergy.clinicalStatus && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(allergy.clinicalStatus)}`}>
                          {allergy.clinicalStatus === 'active' ? 'Aktif' :
                           allergy.clinicalStatus === 'inactive' ? 'Tidak Aktif' :
                           allergy.clinicalStatus}
                        </span>
                      )}
                      {allergy.criticality && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCriticalityColor(allergy.criticality)}`}>
                          Resiko: {allergy.criticality === 'high' ? 'Tinggi' : allergy.criticality === 'low' ? 'Rendah' : '-'}
                        </span>
                      )}
                      {allergy.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {allergy.category}
                        </span>
                      )}
                      {allergy.type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                          {allergy.type}
                        </span>
                      )}
                    </div>
                    {allergy.reactionManifestation && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-100">
                        <p className="text-sm font-medium text-red-800">Reaksi:</p>
                        <p className="text-sm text-red-700">{allergy.reactionManifestation}</p>
                        {allergy.reactionSeverity && (
                          <p className="mt-1 text-xs text-red-600">
                            Severity: <span className="font-medium capitalize">{allergy.reactionSeverity}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {allergy.note && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">{allergy.note}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">{formatDate(allergy.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Tidak ada data alergi</p>
              <p className="mt-1 text-xs text-gray-400">Pastikan untuk mencatat alergi Anda ke dokter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}