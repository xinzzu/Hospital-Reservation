'use client';

import { useEffect, useState } from 'react';
import { fhirAPI, type FHIRObservation } from '@/lib/api';

export default function LabResultsPage() {
  const [observations, setObservations] = useState<FHIRObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fhirAPI.getObservations(selectedCategory || undefined);
        setObservations(response.data || []);
      } catch (err) {
        console.error('Failed to fetch observations:', err);
        setError('Gagal memuat hasil lab. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [selectedCategory]);

  const categories = [
    { value: '', label: 'Semua' },
    { value: 'laboratory', label: 'Laboratorium' },
    { value: 'vital-signs', label: 'Vital Signs' },
    { value: 'imaging', label: 'Imaging' },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case 'N':
        return 'text-green-600 bg-green-50';
      case 'H':
      case 'HH':
        return 'text-red-600 bg-red-50';
      case 'L':
      case 'LL':
        return 'text-blue-600 bg-blue-50';
      case 'A':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getInterpretationLabel = (interpretation: string) => {
    switch (interpretation) {
      case 'N':
        return 'Normal';
      case 'H':
        return 'High';
      case 'HH':
        return 'Critical High';
      case 'L':
        return 'Low';
      case 'LL':
        return 'Critical Low';
      case 'A':
        return 'Abnormal';
      default:
        return interpretation || '-';
    }
  };

  const isOutOfRange = (obs: FHIRObservation) => {
    if (!obs.valueQuantity || !obs.referenceRangeLow && !obs.referenceRangeHigh) return false;
    const val = obs.valueQuantity;
    if (obs.referenceRangeLow && val < obs.referenceRangeLow) return true;
    if (obs.referenceRangeHigh && val > obs.referenceRangeHigh) return true;
    return false;
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
        <h1 className="text-2xl font-bold text-gray-900">Hasil Laboratorium</h1>
        <p className="mt-1 text-sm text-gray-600">Hasil pemeriksaan dan vital signs</p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Observations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Hasil</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {observations.length > 0 ? (
            observations.map((obs) => (
              <div key={obs.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {obs.codeDisplay || obs.codeCode || 'Pemeriksaan'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInterpretationColor(obs.interpretation)}`}>
                        {getInterpretationLabel(obs.interpretation)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                      {obs.codeCode && <span>{obs.codeCode}</span>}
                      {obs.codeSystem && <span>• {obs.codeSystem}</span>}
                    </div>
                    <div className="mt-2 flex items-center space-x-6">
                      <div>
                        <p className="text-xs text-gray-500">Hasil</p>
                        <p className={`text-lg font-semibold ${isOutOfRange(obs) ? 'text-red-600' : 'text-gray-900'}`}>
                          {obs.valueQuantity !== null ? (
                            <>
                              {obs.valueQuantity}
                              {obs.valueQuantityUnit && <span className="text-sm font-normal text-gray-500 ml-1">{obs.valueQuantityUnit}</span>}
                            </>
                          ) : obs.valueString || '-'}
                        </p>
                      </div>
                      {(obs.referenceRangeLow !== null || obs.referenceRangeHigh !== null) && (
                        <div>
                          <p className="text-xs text-gray-500">Nilai Normal</p>
                          <p className="text-sm text-gray-700">
                            {obs.referenceRangeLow || '-'} - {obs.referenceRangeHigh || '-'}
                            {obs.referenceRangeText && <span className="ml-1 text-gray-400">({obs.referenceRangeText})</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(obs.effectiveDateTime)}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{obs.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Belum ada hasil laboratorium</p>
              <p className="mt-1 text-xs text-gray-400">Hasil akan muncul setelah pemeriksaan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}