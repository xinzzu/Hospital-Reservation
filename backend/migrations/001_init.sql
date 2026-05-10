-- Hospital Reservation System Database Schema
-- Version: 1.0

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'pasien',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    room VARCHAR(50),
    bio TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_patients INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(doctor_id, day_of_week, start_time)
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctors(id),
    schedule_id INTEGER REFERENCES schedules(id),
    reservation_date DATE NOT NULL,
    queue_number INTEGER NOT NULL,
    queue_code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'menunggu',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital Info table
CREATE TABLE IF NOT EXISTS hospital_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT 'RSUD Sehat Selalu',
    address TEXT,
    phone VARCHAR(20),
    emergency_phone VARCHAR(20),
    email VARCHAR(255),
    about TEXT,
    facilities TEXT[],
    operating_hours JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_patient ON reservations(patient_id);
CREATE INDEX IF NOT EXISTS idx_reservations_doctor ON reservations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(queue_code);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor ON schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
