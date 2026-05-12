# 🏥 Hospital Queue Reservation System

A web-based hospital queue reservation system that allows patients to search for doctors, make reservations, and receive digital tickets with QR codes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Key Features

- ✅ **Register & Login** with JWT authentication
- ✅ **Patient Dashboard** with hospital information
- ✅ **Doctor Search** by name/specialization
- ✅ **Doctor Detail** with practice schedule
- ✅ **Online Reservation** with schedule validation
- ✅ **Digital Ticket** with QR code
- ✅ **Status Monitoring** for real-time reservation tracking
- ✅ **Admin Dashboard** for hospital staff
- ✅ **Admin Reservation Detail** with full information

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Zustand |
| Backend | Go (Fiber framework) |
| Database | PostgreSQL 15 |
| Container | Docker + Docker Compose |
| Auth | JWT |

## 📁 Directory Structure

```
hospital-reservation/
├── backend/                     # Golang Fiber Backend
│   ├── cmd/server/              # Entry point
│   ├── internal/
│   │   ├── config/              # Configuration
│   │   ├── database/            # Database connection
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/          # JWT middleware
│   │   ├── models/              # Data models
│   │   ├── repository/          # Database queries
│   │   └── services/            # Business logic
│   ├── migrations/              # SQL migrations
│   ├── scripts/                 # Utility scripts
│   └── Dockerfile
│
├── frontend/                    # Next.js Frontend
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── store/                   # Zustand stores
│   ├── lib/                     # API utilities
│   └── Dockerfile
│
├── docs/                        # Documentation
├── docker-compose.yml            # Docker Compose
├── README.md                    # This file
└── .env.example                 # Environment template
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- OR
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

## 🌐 Application Access

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
| POST | `/api/auth/register` | Register new patient |
| POST | `/api/auth/login` | Login, return JWT token |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Hospital

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/info` | Get hospital general information |

### Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors (+ query: ?search=&specialization=) |
| GET | `/api/doctors/:id` | Doctor detail with schedules |
| GET | `/api/doctors/:id/schedules` | Doctor schedules by date |
| GET | `/api/doctors/specializations` | List all specializations |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create new reservation |
| GET | `/api/reservations/me` | Patient's reservation history |
| GET | `/api/reservations/:code` | Get ticket by queue_code |
| PATCH | `/api/reservations/:code/status` | Update status (admin) |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/reservations` | List all reservations (filterable) |
| GET | `/api/admin/reservations/:id` | Reservation detail |
| GET | `/api/admin/doctors` | List all doctors |
| PUT | `/api/admin/doctors/:id` | Update doctor |
| DELETE | `/api/admin/doctors/:id` | Delete doctor |
| POST | `/api/admin/doctors/:id/schedules` | Add doctor schedule |
| PUT | `/api/admin/schedules/:id` | Update schedule |
| DELETE | `/api/admin/schedules/:id` | Delete schedule |
| GET | `/api/admin/patients` | List all patients |
| GET | `/api/admin/patients/:id` | Patient detail |
| PUT | `/api/admin/patients/:id` | Update patient |
| POST | `/api/admin/patients/:id/deactivate` | Deactivate patient |

## 📋 Queue Code Format

Format: `[DOCTOR-CODE][DATE][NUMBER]`

**Example:** `DR01-100524-007`

- `DR01` — Doctor code (2 digits)
- `100524` — Reservation date (DDMMYY)
- `007` — Queue number (3 digits)

## 👤 Default Test Accounts

### Admin Account
| Email | Password | Role |
|-------|----------|------|
| admin@medicare.co.id | admin123 | Administrator |

**Access:** http://localhost:3000/admin/login

### Doctor Accounts
| Email | Password | Role |
|-------|----------|------|
| sarah@hospital.com | doctor123 | Doctor |
| ahmad@hospital.com | doctor123 | Doctor |
| lisa@hospital.com | doctor123 | Doctor |

### Patient Account
> 💡 Patients can register directly through the UI at `/register`

## 🗄️ Database Schema

### Tables

- **users** - Patient and doctor data
- **doctors** - Doctor profiles
- **schedules** - Doctor practice schedules
- **reservations** - Reservation data with queue code
- **hospital_info** - Hospital information
- **password_resets** - Password reset tokens

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
