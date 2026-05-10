# 🏥 Hospital Queue Reservation System

Sistem reservasi antrean rumah sakit berbasis web yang memungkinkan pasien untuk mencari dokter, membuat reservasi, dan mendapatkan tiket digital dengan QR code.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Fitur Utama

- ✅ **Register & Login** dengan JWT authentication
- ✅ **Dashboard Pasien** dengan info rumah sakit
- ✅ **Pencarian Dokter** berdasarkan nama/spesialisasi
- ✅ **Detail Dokter** dengan jadwal praktik
- ✅ **Reservasi Online** dengan validasi jadwal
- ✅ **Tiket Digital** dengan QR code
- ✅ **Monitoring Status** reservasi real-time
- ✅ **Admin Dashboard** untuk staff rumah sakit
- ✅ **Admin Dashboard** untuk staff rumah sakit

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Zustand |
| Backend | Go (Fiber framework) |
| Database | PostgreSQL 15 |
| Container | Docker + Docker Compose |
| Auth | JWT |

## 📁 Struktur Direktori

```
hospital-reservation/
├── backend/                     # Golang Fiber Backend
│   ├── cmd/server/              # Entry point
│   ├── internal/
│   │   ├── config/              # Configuration
│   │   ├── database/           # Database connection
│   │   ├── handlers/           # HTTP handlers
│   │   ├── middleware/         # JWT middleware
│   │   ├── models/             # Data models
│   │   ├── repository/         # Database queries
│   │   └── services/          # Business logic
│   ├── migrations/             # SQL migrations
│   ├── scripts/                 # Utility scripts
│   └── Dockerfile
│
├── frontend/                    # Next.js Frontend
│   ├── app/                     # App Router pages
│   ├── components/             # React components
│   ├── store/                  # Zustand stores
│   ├── lib/                    # API utilities
│   └── Dockerfile
│
├── docs/                       # Documentation
├── docker-compose.yml          # Docker Compose
├── README.md                   # This file
└── .env.example               # Environment template
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- ATAU
- [Go 1.21+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15](https://www.postgresql.org/)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd hospital-reservation

# Start all services
docker-compose up -d

# Or use the run script (Windows)
run.bat
```

### Option 2: Manual Setup

#### Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE hospital_db;"
psql -U postgres -d hospital_db -f backend/scripts/init_db.sql
```

#### Backend

```bash
cd backend
go mod download
go run cmd/server/main.go
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/health |
| API Docs | http://localhost:8080/docs (future) |

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register pasien baru |
| POST | `/api/auth/login` | Login, return JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Hospital

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/info` | Get info umum rumah sakit |

### Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List semua dokter (+ query: ?search=&specialization=) |
| GET | `/api/doctors/:id` | Detail dokter + jadwal |
| GET | `/api/doctors/:id/schedules` | Jadwal dokter per tanggal |
| GET | `/api/doctors/specializations` | List spesialisasi |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Buat reservasi baru |
| GET | `/api/reservations/me` | Riwayat reservasi pasien |
| GET | `/api/reservations/:code` | Cek tiket by queue_code |
| PATCH | `/api/reservations/:code/status` | Update status (admin) |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/reservations` | List semua reservasi (filterable) |
| GET | `/api/admin/doctors` | List semua dokter |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/reservations` | List semua reservasi (filterable) |
| GET | `/api/admin/doctors` | List semua dokter |


## 📋 Queue Code Format

Format: `[KODE-DOKTER][TANGGAL][NOMOR]`

**Contoh:** `DR01-100524-007`

- `DR01` — Kode dokter (2 digit)
- `100524` — Tanggal reservasi (DDMMYY)
- `007` — Nomor antrean (3 digit)

## 👤 Default Test Accounts

### Admin Account
| Email | Password | Role |
|-------|----------|------|
| admin@medicare.co.id | admin123 | Administrator |

**Akses:** http://localhost:3000/admin/login

### Doctor Accounts
| Email | Password | Role |
|-------|----------|------|
| sarah@hospital.com | doctor123 | Dokter |
| ahmad@hospital.com | doctor123 | Dokter |
| lisa@hospital.com | doctor123 | Dokter |

### Patient Account
> 💡 Pasien dapat mendaftar langsung melalui UI pada halaman `/register`

## 🗄️ Database Schema

### Tables

- **users** - Data pasien dan dokter
- **doctors** - Profil dokter
- **schedules** - Jadwal praktik dokter
- **reservations** - Data reservasi dengan queue code
- **hospital_info** - Informasi rumah sakit

### ER Diagram Concept

```
users (1) ──────────< (N) reservations
  │                       │
  │                       │
  │                       ▼
  │                   doctors (1)
  │                       │
  │                       │
  └───> doctors ─────────┘
         │
         │
         └──< schedules
```

## 🔧 Development

### Backend (Go)

```bash
cd backend

# Run
go run cmd/server/main.go

# Build
go build -o server ./cmd/server

# Test
go test ./...
```

### Frontend (Next.js)

```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Database Commands

```bash
# Connect to PostgreSQL
psql -U hospital_user -d hospital_db

# Run migrations
psql -U hospital_user -d hospital_db -f backend/migrations/001_init.sql
psql -U hospital_user -d hospital_db -f backend/migrations/002_seed.sql
```

## 🐛 Troubleshooting

### Docker Issues

```bash
# Check Docker status
docker info

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down -v
docker-compose up --build -d
```

### Common Issues

1. **Port already in use**: Change port mapping in docker-compose.yml
2. **Database connection failed**: Ensure PostgreSQL is running and credentials are correct
3. **Frontend can't connect to API**: Check NEXT_PUBLIC_API_URL environment variable

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ for Hospital Queue Reservation System
