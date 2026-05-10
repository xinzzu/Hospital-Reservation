-- Hospital Reservation System Seed Data
-- Version: 1.0

-- ============================================
-- ADMIN USER (for admin panel access)
-- ============================================
-- Password: admin123 (bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y)
INSERT INTO users (name, email, password_hash, phone, role)
VALUES ('Administrator', 'admin@medicare.co.id', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567800', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- HOSPITAL INFO
-- ============================================

-- Insert hospital info
INSERT INTO hospital_info (name, address, phone, emergency_phone, email, about, facilities, operating_hours)
VALUES (
    'RSUD Sehat Selalu',
    'Jl. Rumah Sakit No. 1, Jakarta Selatan 12345',
    '(021) 1234-5678',
    '(021) 1234-9999',
    'info@rsudsehat.co.id',
    'RSUD Sehat Selalu adalah rumah sakit umum daerah yang berkomitmen memberikan pelayanan kesehatan berkualitas tinggi kepada masyarakat. Dengan fasilitas modern dan tenaga medis profesional, kami siap melayani kebutuhan kesehatan Anda.',
    ARRAY['IGD 24 Jam', 'Rawat Inap', 'Rawat Jalan', 'Laboratorium', 'Radiologi', 'Apotek', 'Parkir Luas', 'Ruang Tunggu Nyaman'],
    '{"senin_jumat": "07:00-21:00", "sabtu": "07:00-14:00", "minggu": "Tutup"}'
);

-- Insert doctors with their user accounts
-- Password for all doctors: doctor123 (bcrypt hash)
INSERT INTO users (name, email, password_hash, phone, role)
VALUES 
    ('Dr. Sarah SpOG', 'sarah@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567890', 'dokter'),
    ('Dr. Ahmad Kardio', 'ahmad@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567891', 'dokter'),
    ('Dr. Lisa Anak', 'lisa@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567892', 'dokter'),
    ('Dr. Budi Bedah', 'budi@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567893', 'dokter'),
    ('Dr. Maya Mata', 'maya@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567894', 'dokter'),
    ('Dr. Rudi Syaraf', 'rudi@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.c9jF.L7aFnY0o7hF7y', '081234567895', 'dokter');

-- Insert doctor profiles
INSERT INTO doctors (user_id, name, specialization, room, bio, photo_url)
VALUES 
    (1, 'Dr. Sarah SpOG', 'Spesialis Kandungan', 'Ruang 201', 'Dr. Sarah adalah spesialis kandungan dan kebidanan dengan pengalaman lebih dari 10 tahun. Beliau lulus dari FKUI dan aktif dalam berbagai seminar nasional.', 'https://randomuser.me/api/portraits/women/1.jpg'),
    (2, 'Dr. Ahmad Kardio', 'Spesialis Jantung', 'Ruang 301', 'Dr. Ahmad adalah spesialis jantung dan pembuluh darah yang berfokus pada penanganan penyakit kardiovaskular. Beliau memiliki sertifikasi internasional.', 'https://randomuser.me/api/portraits/men/2.jpg'),
    (3, 'Dr. Lisa Anak', 'Spesialis Anak', 'Ruang 102', 'Dr. Lisa adalah dokter spesialis anak yang penuh perhatian dan sabar dalam merawat pasien kecil. Beliau aktif dalam komunitas kesehatan anak.', 'https://randomuser.me/api/portraits/women/3.jpg'),
    (4, 'Dr. Budi Bedah', 'Spesialis Bedah', 'Ruang 401', 'Dr. Budi adalah spesialis bedah umum dengan pengalaman melakukan ratusan operasi. Beliau terkenal teliti dan profesional.', 'https://randomuser.me/api/portraits/men/4.jpg'),
    (5, 'Dr. Maya Mata', 'Spesialis Mata', 'Ruang 202', 'Dr. Maya adalah spesialis mata yang ahli dalam penanganan berbagai penyakit mata. Beliau menggunakan teknologi terbaru dalam praktik sehari-hari.', 'https://randomuser.me/api/portraits/women/5.jpg'),
    (6, 'Dr. Rudi Syaraf', 'Spesialis Syaraf', 'Ruang 302', 'Dr. Rudi adalah spesialis syaraf yang berpengalaman dalam menangani penyakit neurologis kompleks. Beliau merupakan alumnus Stanford Medical School.', 'https://randomuser.me/api/portraits/men/6.jpg');

-- Insert schedules
-- Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, max_patients, is_active)
VALUES 
    -- Dr. Sarah SpOG (doctor_id=1)
    (1, 1, '09:00', '12:00', 20, true),  -- Senin
    (1, 1, '13:00', '16:00', 20, true),  -- Senin
    (1, 3, '09:00', '12:00', 20, true),  -- Rabu
    (1, 5, '09:00', '12:00', 20, true),  -- Jumat
    
    -- Dr. Ahmad Kardio (doctor_id=2)
    (2, 2, '08:00', '11:00', 15, true),  -- Selasa
    (2, 2, '13:00', '16:00', 15, true),  -- Selasa
    (2, 4, '08:00', '11:00', 15, true),  -- Kamis
    (2, 6, '08:00', '11:00', 15, true),  -- Sabtu
    
    -- Dr. Lisa Anak (doctor_id=3)
    (3, 1, '08:00', '12:00', 25, true),  -- Senin
    (3, 2, '08:00', '12:00', 25, true),  -- Selasa
    (3, 3, '08:00', '12:00', 25, true),  -- Rabu
    (3, 4, '08:00', '12:00', 25, true),  -- Kamis
    (3, 5, '08:00', '12:00', 25, true),  -- Jumat
    
    -- Dr. Budi Bedah (doctor_id=4)
    (4, 2, '10:00', '14:00', 10, true),  -- Selasa
    (4, 4, '10:00', '14:00', 10, true),  -- Kamis
    (4, 6, '09:00', '13:00', 10, true),  -- Sabtu
    
    -- Dr. Maya Mata (doctor_id=5)
    (5, 1, '09:00', '13:00', 20, true),  -- Senin
    (5, 3, '09:00', '13:00', 20, true),  -- Rabu
    (5, 5, '09:00', '13:00', 20, true),  -- Jumat
    
    -- Dr. Rudi Syaraf (doctor_id=6)
    (6, 2, '09:00', '12:00', 15, true),  -- Selasa
    (6, 4, '09:00', '12:00', 15, true);  -- Kamis
