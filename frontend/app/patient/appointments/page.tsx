'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reservationsAPI } from '@/lib/api';

interface ReservationWithDetails {
  id: number;
  patient_id: number;
  doctor_id: number;
  schedule_id: number;
  reservation_date: string;
  queue_number: number;
  queue_code: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  doctor_name: string;
  doctor_specialization: string;
  doctor_room: string;
  schedule_start_time: string;
  schedule_end_time: string;
  patient_name?: string;
  patient_phone?: string;
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await reservationsAPI.getMyReservations();
        setAppointments(response.data.reservations || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Gagal memuat jadwal kunjungan. Pastikan Anda sudah login.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'dipanggil':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      case 'batal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'menunggu':
        return 'Menunggu';
      case 'dipanggil':
        return 'Dipanggil';
      case 'selesai':
        return 'Selesai';
      case 'batal':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-';
    return timeStr.substring(0, 5);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Kunjungan</h1>
          <p className="mt-1 text-sm text-gray-600">Riwayat dan jadwal kunjungan Anda</p>
        </div>
        <Link
          href="/doctors"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Reservasi
        </Link>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        {[
          { value: 'all', label: 'Semua' },
          { value: 'menunggu', label: 'Menunggu' },
          { value: 'dipanggil', label: 'Dipanggil' },
          { value: 'selesai', label: 'Selesai' },
          { value: 'batal', label: 'Dibatalkan' },
        ].map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'Semua Kunjungan' : `Kunjungan ${getStatusLabel(filter)}`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredAppointments.length})
            </span>
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        apt.status === 'selesai' ? 'bg-green-500' :
                        apt.status === 'dipanggil' ? 'bg-blue-500' :
                        apt.status === 'menunggu' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Dr. {apt.doctor_name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {apt.doctor_specialization}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {apt.doctor_room}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(apt.reservation_date)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(apt.schedule_start_time)} - {formatTime(apt.schedule_end_time)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        No. Antrian: <span className="font-semibold text-gray-900 ml-1">{apt.queue_number}</span>
                      </span>
                    </div>
                    {apt.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Catatan:</span> {apt.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {apt.queue_code}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                {filter === 'all'
                  ? 'Belum ada jadwal kunjungan'
                  : `Tidak ada kunjungan dengan status "${getStatusLabel(filter)}"`}
              </p>
              <Link
                href="/doctors"
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
              >
                Buat reservasi baru →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
