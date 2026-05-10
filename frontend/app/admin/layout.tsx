'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Sidebar, { MobileSidebarOverlay } from '@/components/admin/Sidebar';

// SVG Icons
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Loading: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!_hasHydrated) return;

    // Skip auth check for login page - let the login page render
    if (pathname === '/admin/login') return;

    // Auth check - redirect to admin login if not authenticated
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [mounted, _hasHydrated, isAuthenticated, pathname, router]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Loading state while hydrating auth store
  if (!mounted || !_hasHydrated) {
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

  // Skip auth gate for login page - let it render
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated, don't render content (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebarOverlay
        collapsed={!mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[240px]'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#f3f4f6]/50">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side - Mobile menu button & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0d9488] transition-all"
                aria-label="Toggle menu"
              >
                <Icons.Menu />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-[#1a1d23]">Admin</span>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0d9488] transition-all"
                aria-label="Notifications"
              >
                <Icons.Bell />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#f9fafb] rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                    <Icons.User />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1a1d23] leading-tight">{user?.name}</p>
                    <p className="text-xs text-[#6b7280] leading-tight capitalize">{user?.role || 'Admin'}</p>
                  </div>
                </div>

                {/* Mobile user avatar */}
                <div className="sm:hidden w-9 h-9 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white">
                  <Icons.User />
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-[#6b7280] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-all"
                  aria-label="Logout"
                  title="Keluar"
                >
                  <Icons.Logout />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
