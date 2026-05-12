-- Migration: 003_performance_indexes.sql
-- Performance Optimization: Add missing indexes for faster queries
-- Date: 2026-05-12

-- Doctors table indexes
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization_active ON doctors(specialization, is_active);

-- Schedules table indexes
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_active ON schedules(doctor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_schedules_day_active ON schedules(day_of_week, is_active);

-- Reservations table indexes
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date_status ON reservations(reservation_date, status);
CREATE INDEX IF NOT EXISTS idx_reservations_doctor_date ON reservations(doctor_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_patient_date ON reservations(patient_id, reservation_date);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email_role ON users(email, role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reservations_lookup ON reservations(doctor_id, reservation_date, status);

-- Analyze tables to update statistics
ANALYZE doctors;
ANALYZE schedules;
ANALYZE reservations;
ANALYZE users;
