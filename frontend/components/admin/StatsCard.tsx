'use client';

import React from 'react';

// ============================================
// Default Icons for StatsCard
// ============================================
export const DefaultIcons = {
  Calendar: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Users: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Clock: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  CheckCircle: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  Stethoscope: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  TrendingUp: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18"/>
      <path d="M17 6h6v6"/>
    </svg>
  ),
  TrendingDown: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 18l-9.5-9.5-5 5L1 6"/>
      <path d="M17 18h6v-6"/>
    </svg>
  ),
  Activity: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
};

// ============================================
// Type Definitions
// ============================================
export type ColorVariant = 'teal' | 'blue' | 'amber' | 'emerald' | 'red';

export interface TrendData {
  value: number;
  isPositive: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: ColorVariant;
  trend?: TrendData;
}

// ============================================
// Color Styles Configuration
// ============================================
const colorStyles: Record<ColorVariant, { gradient: string; text: string; bg: string }> = {
  teal: {
    gradient: 'from-[#ccfbf1] to-[#99f6e4]',
    text: 'text-[#0d9488]',
    bg: 'bg-[#ccfbf1]',
  },
  blue: {
    gradient: 'from-[#dbeafe] to-[#bfdbfe]',
    text: 'text-[#2563eb]',
    bg: 'bg-[#dbeafe]',
  },
  amber: {
    gradient: 'from-[#fef3c7] to-[#fde68a]',
    text: 'text-[#d97706]',
    bg: 'bg-[#fef3c7]',
  },
  emerald: {
    gradient: 'from-[#d1fae5] to-[#a7f3d0]',
    text: 'text-[#059669]',
    bg: 'bg-[#d1fae5]',
  },
  red: {
    gradient: 'from-[#fee2e2] to-[#fecaca]',
    text: 'text-[#dc2626]',
    bg: 'bg-[#fee2e2]',
  },
};

// ============================================
// Trend Indicator Component
// ============================================
interface TrendIndicatorProps {
  trend: TrendData;
}

function TrendIndicator({ trend }: TrendIndicatorProps) {
  const { value, isPositive } = trend;
  const Icon = isPositive ? DefaultIcons.TrendingUp : DefaultIcons.TrendingDown;
  const colorClass = isPositive ? 'text-[#059669]' : 'text-[#dc2626]';
  const bgClass = isPositive ? 'bg-[#d1fae5]' : 'bg-[#fee2e2]';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bgClass}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className={`text-xs font-semibold ${colorClass}`}>
        {isPositive ? '+' : '-'}{value}%
      </span>
    </div>
  );
}

// ============================================
// StatsCard Component
// ============================================
export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'teal',
  trend,
}: StatsCardProps) {
  const styles = colorStyles[color];
  const IconComponent = icon;

  return (
    <div className="card p-5 flex flex-col h-full">
      {/* Icon Box */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center mb-4 flex-shrink-0`}
      >
        {IconComponent ? (
          <div className={styles.text}>{IconComponent}</div>
        ) : (
          <DefaultIcons.Calendar className="w-6 h-6" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Value */}
        <div className="text-2xl md:text-3xl font-bold text-[#1a1d23] mb-1 tracking-tight">
          {value}
        </div>

        {/* Title */}
        <div className="text-sm font-medium text-[#6b7280] mb-1">
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="text-xs text-[#9ca3af] mb-auto">
            {subtitle}
          </div>
        )}

        {/* Trend */}
        {trend && (
          <div className="mt-3 flex items-center">
            <TrendIndicator trend={trend} />
          </div>
        )}
      </div>
    </div>
  );
}
