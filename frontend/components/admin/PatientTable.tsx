'use client';

import { useState } from 'react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDeactivate: (id: number) => void;
  loading?: boolean;
}

const Icons = {
  Edit: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Ban: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

export default function PatientTable({ patients, onEdit, onDeactivate, loading }: PatientTableProps) {
  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-[#f3f4f6] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[#6b7280]">Tidak ada pasien ditemukan</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#fafbfc] border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-sm font-semibold text-[#374151]">Nama</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-[#374151]">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-[#374151]">Telepon</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-[#374151]">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-[#374151]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b border-[#f3f4f6] hover:bg-[#fafbfc] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                      <Icons.User />
                    </div>
                    <span className="font-medium text-[#1a1d23]">{patient.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6b7280]">{patient.email}</td>
                <td className="px-4 py-3 text-[#6b7280]">{patient.phone || '-'}</td>
                <td className="px-4 py-3">
                  {patient.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#d1fae5] text-[#059669]">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f3f4f6] text-[#6b7280]">
                      Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(patient)}
                      className="p-2 text-[#6b7280] hover:text-[#0d9488] hover:bg-[#ccfbf1] rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Icons.Edit />
                    </button>
                    {patient.is_active && (
                      <button
                        onClick={() => onDeactivate(patient.id)}
                        className="p-2 text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-colors"
                        title="Nonaktifkan"
                      >
                        <Icons.Ban />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
