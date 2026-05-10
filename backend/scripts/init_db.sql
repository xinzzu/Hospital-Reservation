-- Hospital Reservation System - Database Setup
-- Run this script to initialize the database

-- Create database (run as postgres superuser)
-- CREATE DATABASE hospital_db;

-- Connect to hospital_db before running the rest

-- Create tables
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reservations_patient ON reservations(patient_id);
CREATE INDEX IF NOT EXISTS idx_reservations_doctor ON reservations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(queue_code);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor ON schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);

-- Insert hospital info
INSERT INTO hospital_info (name, address, phone, emergency_phone, email, about, facilities, operating_hours)
VALUES (
    'RSUD Sehat Selalu',
    'Jl. Rumah Sakit No. 1, Jakarta Selatan 12345',
    '(021) 1234-5678',
    '(021) 1234-9999',
    'info@rsudsehat.co.id',
    'RSUD Sehat Selalu adalah rumah sakit umum daerah yang berkomitmen memberikan pelayanan kesehatan berkualitas tinggi.',
    ARRAY['IGD 24 Jam', 'Rawat Inap', 'Rawat Jalan', 'Laboratorium', 'Radiologi'],
    '{"senin_jumat": "07:00-21:00", "sabtu": "07:00-14:00"}'
);

-- Insert sample doctors (password: doctor123)
INSERT INTO users (name, email, password_hash, phone, role)
VALUES 
    ('Dr. Sarah SpOG', 'sarah@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567890', 'dokter'),
    ('Dr. Ahmad Kardio', 'ahmad@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567891', 'dokter'),
    ('Dr. Lisa Anak', 'lisa@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567892', 'dokter');

INSERT INTO doctors (user_id, name, specialization, room, bio, photo_url)
VALUES 
    (1, 'Dr. Sarah SpOG', 'Spesialis Kandungan', 'Ruang 201', 'Spesialis Kandungan & Kebidanan', 'https://randomuser.me/api/portraits/women/1.jpg'),
    (2, 'Dr. Ahmad Kardio', 'Spesialis Jantung', 'Ruang 301', 'Spesialis Jantung & Pembuluh Darah', 'https://randomuser.me/api/portraits/men/2.jpg'),
    (3, 'Dr. Lisa Anak', 'Spesialis Anak', 'Ruang 102', 'Spesialis Kesehatan Anak', 'https://randomuser.me/api/portraits/women/3.jpg');

-- Insert schedules
INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, max_patients, is_active)
VALUES 
    (1, 1, '09:00', '12:00', 20, true),  -- Senin
    (1, 3, '09:00', '12:00', 20, true),  -- Rabu
    (1, 5, '09:00', '12:00', 20, true),  -- Jumat
    (2, 2, '08:00', '11:00', 15, true),   -- Selasa
    (2, 4, '08:00', '11:00', 15, true),   -- Kamis
    (3, 1, '08:00', '12:00', 25, true),   -- Senin
    (3, 3, '08:00', '12:00', 25, true);  -- Rabu

SELECT 'Database initialized successfully!' as status;
