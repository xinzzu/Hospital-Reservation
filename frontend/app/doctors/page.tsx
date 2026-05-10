"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doctorsAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M6 12a4 4 0 018 0 4 4 0 018 0M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
      <circle cx="8" cy="10" r="2"/>
      <circle cx="16" cy="10" r="2"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
};

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  room: string;
  bio: string;
  photo_url: string;
}

export default function DoctorsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const response = await doctorsAPI.getAll();
        const doctorsList: Doctor[] = response.data.doctors || [];
        setDoctors(doctorsList);

        const specs: string[] = [];
        const specSet = new Set<string>();
        doctorsList.forEach((d: Doctor) => specSet.add(d.specialization));
        specSet.forEach((spec) => specs.push(spec));
        setSpecializations(specs.sort());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [isAuthenticated, router]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpec === "" || doctor.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-4 text-white">
            <Icons.Loading />
          </div>
          <p className="text-[#6b7280] font-medium">Memuat daftar dokter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-lg shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-lg text-[#1a1d23] tracking-tight">MediCare</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-[#6b7280] hover:text-[#0d9488] transition-colors">
              <Icons.ArrowLeft />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23] mb-2">Cari Dokter</h1>
          <p className="text-[#6b7280]">Temukan dokter spesialis yang Anda butuhkan</p>
        </div>

        {/* Search & Filter Section */}
        <div className="card relative z-30 p-5 mb-6 animate-slide-up opacity-0 overflow-visible" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Cari nama dokter atau spesialisasi..."
                className="input-field pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown - Container with relative positioning */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="btn-secondary inline-flex items-center gap-2 min-w-[200px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <Icons.Stethoscope />
                  {selectedSpec || "Semua Spesialisasi"}
                </span>
                <Icons.ChevronDown />
              </button>

              {/* Dropdown - positioned relative to this container */}
              {showFilter && (
                <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-xl shadow-xl border border-[#e5e7eb] py-2 z-[9999] max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedSpec(""); setSearchTerm(""); setShowFilter(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-[#f3f4f6] transition-colors ${selectedSpec === "" ? "bg-[#ccfbf1] text-[#0d9488] font-medium" : "text-[#374151]"}`}
                  >
                    Semua Spesialisasi
                  </button>
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => { setSelectedSpec(spec); setSearchTerm(""); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#f3f4f6] transition-colors ${selectedSpec === spec ? "bg-[#ccfbf1] text-[#0d9488] font-medium" : "text-[#374151]"}`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedSpec && (
            <div className="mt-4 pt-4 border-t border-[#f3f4f6] flex items-center gap-2">
              <span className="text-sm text-[#9ca3af]">Filter aktif:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ccfbf1] text-[#0d9488] rounded-full text-sm font-medium">
                <Icons.Stethoscope />
                {selectedSpec}
                <button onClick={() => setSelectedSpec("")} className="ml-1 hover:text-[#0f766e]">×</button>
              </span>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <p className="text-[#6b7280]">
            Ditemukan <span className="font-semibold text-[#1a1d23]">{filteredDoctors.length}</span> dokter
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doctor, index) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.id}`}
                className="card card-hover p-5 animate-slide-up opacity-0"
                style={{ animationDelay: `${0.4 + index * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.photo_url || "/placeholder-doctor.png"}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1a1d23] group-hover:text-[#0d9488] transition-colors truncate">{doctor.name}</h3>
                    <p className="text-sm text-[#0d9488] font-medium mb-1">{doctor.specialization}</p>
                    <div className="flex items-center gap-1.5 text-sm text-[#9ca3af]">
                      <Icons.Location />
                      <span>Ruang {doctor.room}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#6b7280] mt-4 line-clamp-2 leading-relaxed">{doctor.bio}</p>

                <div className="mt-4 pt-4 border-t border-[#f3f4f6] flex items-center justify-between">
                  <span className="text-sm text-[#0d9488] font-medium group-hover:text-[#0f766e] transition-colors">Lihat Jadwal</span>
                  <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-[#ccfbf1] group-hover:text-[#0d9488] transition-all">
                    <Icons.ArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-xl bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
              <Icons.Search />
            </div>
            <h3 className="text-lg font-bold text-[#1a1d23] mb-2">Dokter Tidak Ditemukan</h3>
            <p className="text-[#6b7280] mb-6">Coba ubah kata kunci pencarian atau filter spesialisasi</p>
            <button onClick={() => { setSearchTerm(""); setSelectedSpec(""); }} className="btn-secondary">Reset Filter</button>
          </div>
        )}
      </main>
    </div>
  );
}