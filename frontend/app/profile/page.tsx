'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  User: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  Loading: () => (
    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
};

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.data.profile);
        setEditName(response.data.profile.name);
        setEditPhone(response.data.profile.phone || '');
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setEditError('Nama wajib diisi');
      return;
    }
    setEditError('');

    setSaving(true);
    try {
      await userAPI.updateProfile({ name: editName.trim(), phone: editPhone.trim() });
      setToast({ message: 'Profil berhasil diperbarui', type: 'success' });
      setEditMode(false);
      const response = await userAPI.getProfile();
      setProfile(response.data.profile);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword) {
      setPasswordError('Password lama wajib diisi');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru tidak cocok');
      return;
    }

    try {
      await userAPI.changePassword({ old_password: oldPassword, new_password: newPassword });
      setPasswordSuccess('Password berhasil diubah');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setToast({ message: 'Password berhasil diubah', type: 'success' });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Gagal mengubah password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-4 text-white">
            <Icons.Loading />
          </div>
          <p className="text-[#6b7280] font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <header className="glass sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Icons.ArrowLeft />
              <span className="font-medium text-[#6b7280]">Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d23] mb-8">Pengaturan Profil</h1>

        {/* Profile Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#1a1d23]">Informasi Akun</h2>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="text-[#0d9488] font-medium hover:text-[#0f766e]">
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Nama</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
                {editError && <p className="text-[#dc2626] text-sm mt-1">{editError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                <input type="email" value={profile?.email || ''} disabled className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg bg-[#fafbfc] text-[#6b7280]" />
                <p className="text-[#9ca3af] text-xs mt-1">Email tidak dapat diubah</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Telepon</label>
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" placeholder="08xxxxxxxxxx" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditMode(false)} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl font-medium hover:bg-[#f9fafb]">Batal</button>
                <button onClick={handleSaveProfile} disabled={saving} className="flex-1 bg-[#0d9488] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#0f766e] disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#ccfbf1] flex items-center justify-center text-[#0d9488]">
                  <Icons.User />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af]">Nama</p>
                  <p className="font-medium text-[#1a1d23]">{profile?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#2563eb]">
                  <Icons.Mail />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af]">Email</p>
                  <p className="font-medium text-[#1a1d23]">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#fafbfc] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
                  <Icons.Phone />
                </div>
                <div>
                  <p className="text-xs text-[#9ca3af]">Telepon</p>
                  <p className="font-medium text-[#1a1d23]">{profile?.phone || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Password Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#1a1d23]">Keamanan</h2>
            {!showPasswordForm && (
              <button onClick={() => setShowPasswordForm(true)} className="text-[#0d9488] font-medium hover:text-[#0f766e]">
                Ubah Password
              </button>
            )}
          </div>

          {showPasswordForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Password Lama</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Password Baru</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Konfirmasi Password Baru</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#14b8a6]" />
              </div>
              {passwordError && <p className="text-[#dc2626] text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-[#059669] text-sm flex items-center gap-2"><Icons.CheckCircle />{passwordSuccess}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPasswordForm(false)} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl font-medium hover:bg-[#f9fafb]">Batal</button>
                <button onClick={handleChangePassword} className="flex-1 bg-[#0d9488] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#0f766e]">Simpan</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-[#fafbfc] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-[#fce7f3] flex items-center justify-center text-[#db2777]">
                <Icons.Lock />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#9ca3af]">Password</p>
                <p className="font-medium text-[#1a1d23]">********</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-[#059669] text-white' : 'bg-[#dc2626] text-white'
        }`}>
          {toast.type === 'success' && <Icons.CheckCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
