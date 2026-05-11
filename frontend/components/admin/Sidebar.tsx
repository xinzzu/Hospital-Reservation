'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// SVG Icons
const Icons = {
  Hospital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Icons.Dashboard />,
  },
  {
    name: 'Reservasi',
    href: '/admin/reservations',
    icon: <Icons.Calendar />,
  },
  {
    name: 'Dokter',
    href: '/admin/doctors',
    icon: <Icons.Stethoscope />,
  },
  {
    name: 'Kelola Pasien',
    href: '/admin/patients',
    icon: <Icons.User />,
  },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-[#e5e7eb] z-40 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[80px]' : 'w-[240px]'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#e5e7eb]">
          {!collapsed ? (
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-md shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-[#1a1d23] tracking-tight">Admin</span>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="mx-auto">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-md shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
            </Link>
          )}
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0d9488] transition-all ${
              collapsed ? 'hidden' : 'block'
            }`}
            aria-label="Collapse sidebar"
          >
            <Icons.ArrowLeft />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-[#14b8a6]/10 to-[#0d9488]/10 text-[#0d9488]'
                        : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`flex-shrink-0 ${active ? 'text-[#0d9488]' : 'text-[#9ca3af] group-hover:text-[#6b7280]'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-[#14b8a6]/10 text-[#0d9488] rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && (
                      <span
                        className={`absolute left-[72px] px-3 py-1.5 bg-[#1a1d23] text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 ${
                          active ? 'bg-[#0d9488]' : ''
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User Info */}
        <div className="border-t border-[#e5e7eb] p-3 space-y-2">
          {/* User Info */}
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f9fafb] ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white flex-shrink-0">
              <Icons.User />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a1d23] truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-[#6b7280] truncate capitalize">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// Mobile sidebar overlay component
export function MobileSidebarOverlay({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  if (collapsed) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        onClick={onToggle}
      />

      {/* Mobile Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#e5e7eb] z-40 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#e5e7eb]">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white shadow-md shadow-[#0d9488]/20">
                <Icons.Hospital />
              </div>
              <span className="font-bold text-[#1a1d23] tracking-tight">Admin Panel</span>
            </Link>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0d9488] transition-all"
              aria-label="Close sidebar"
            >
              <Icons.ArrowLeft />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onToggle}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-[#14b8a6]/10 to-[#0d9488]/10 text-[#0d9488]'
                          : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]'
                      }`}
                    >
                      <span className={`flex-shrink-0 ${active ? 'text-[#0d9488]' : 'text-[#9ca3af]'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-[#14b8a6]/10 text-[#0d9488] rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-[#e5e7eb] p-3 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151] transition-all"
            >
              <span className="flex-shrink-0 text-[#9ca3af]">
                <Icons.ArrowLeft />
              </span>
              <span className="font-medium text-sm">Kembali ke Portal</span>
            </Link>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f9fafb]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white flex-shrink-0">
                <Icons.User />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a1d23] truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-[#6b7280] truncate capitalize">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
