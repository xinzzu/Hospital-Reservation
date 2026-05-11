# Hospital Queue Reservation System

A full-stack web application for hospital queue management that allows patients to search for doctors, make reservations, and receive digital tickets with QR codes. Built with a modern tech stack featuring Go Fiber for the backend and Next.js 14 for the frontend.

---

## Project Overview

**Problem:** Traditional hospital queue systems rely on physical tickets and manual management, leading to long waiting times, overcrowding, and poor patient experience.

**Solution:** A digital queue reservation system that enables patients to book appointments online, receive real-time queue updates, and manage their healthcare visits efficiently.

---

## Features

### Patient Features
- **User Authentication** — JWT-based registration and login system
- **Doctor Search** — Search doctors by name or specialization
- **Doctor Profiles** — View doctor details including schedules and availability
- **Online Reservation** — Book appointments with real-time schedule validation
- **Digital Tickets** — QR code-based digital tickets for easy check-in
- **Queue Monitoring** — Real-time reservation status tracking (waiting, called, completed, cancelled)

### Admin Features
- **Dashboard** — Comprehensive statistics (total reservations, daily visits, queue status)
- **Reservation Management** — View and filter all reservations by status, date, or doctor
- **Doctor Management** — Manage doctor profiles and view specialist information
- **Queue Control** — Update patient queue status (call next, complete, cancel)

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | React-based web application |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State Management** | Zustand | Lightweight state management |
| **Backend** | Go 1.21 (Fiber) | High-performance HTTP framework |
| **Database** | PostgreSQL 15 | Relational database |
| **Authentication** | JWT | Stateless authentication |
| **Containerization** | Docker + Docker Compose | Application deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│         Patient Portal & Admin Dashboard                 │
│              localhost:3000                               │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API (JSON)
                      │ JWT Authentication
┌─────────────────────▼───────────────────────────────────┐
│                   Backend (Go Fiber)                     │
│         Handlers → Services → Repositories               │
│              localhost:8080                               │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
┌─────────────────────▼───────────────────────────────────┐
│                 PostgreSQL 15                           │
│    users | doctors | schedules | reservations           │
└─────────────────────────────────────────────────────────┘
```

### Backend Structure
```
backend/
├── cmd/server/           # Application entry point
├── internal/
│   ├── config/           # Configuration management
│   ├── database/         # Database connection
│   ├── handlers/         # HTTP request handlers
│   ├── middleware/       # JWT authentication
│   ├── models/           # Data models
│   ├── repository/       # Database queries
│   └── services/         # Business logic
├── migrations/           # Database migrations
└── scripts/              # Utility scripts
```

### Frontend Structure
```
frontend/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   ├── admin/           # Admin dashboard pages
│   └── ...
├── components/          # React components
│   ├── admin/           # Admin-specific components
│   └── ui/              # Shared UI components
├── lib/                 # API utilities
└── store/               # Zustand stores
```

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | Patient and doctor user accounts |
| `doctors` | Doctor profiles with specialization |
| `schedules` | Doctor practice schedules by day |
| `reservations` | Patient reservations with queue codes |
| `hospital_info` | Hospital information and facilities |

### Key Relationships
- Users can have multiple reservations
- Doctors have multiple schedules
- Reservations link patients to doctors through schedules

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Patient registration |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Hospital
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/info` | Get hospital information |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List doctors (search, specialization filter) |
| GET | `/api/doctors/:id` | Doctor details with schedules |
| GET | `/api/doctors/:id/schedules` | Doctor schedules by date |
| GET | `/api/doctors/specializations` | List all specializations |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create new reservation |
| GET | `/api/reservations/me` | Patient's reservation history |
| GET | `/api/reservations/:code` | Get ticket by queue code |
| PATCH | `/api/reservations/:code/status` | Update reservation status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/reservations` | All reservations (filterable) |
| GET | `/api/admin/doctors` | All doctors list |

---

## Key Implementation Details

### Queue Code System
Format: `[DOCTOR_CODE]-[DATE]-[NUMBER]`

Example: `DR01-100524-007`
- `DR01` — Doctor code (2 digits)
- `100524` — Reservation date (DDMMYY)
- `007` — Queue number (3 digits)

### Reservation Status Flow
```
Menunggu (Waiting) → Dipanggil (Called) → Selesai (Completed)
       ↓
    Batal (Cancelled)
```

### Security
- JWT tokens with configurable expiration
- Password hashing with bcrypt
- Role-based access control (patient, doctor, admin)
- Protected admin routes requiring admin role

---

## Getting Started

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Go 1.21+, Node.js 18+, PostgreSQL 15

### Quick Start with Docker
```bash
# Clone and start
docker-compose up -d

# Access application
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medicare.co.id | admin123 |
| Doctor | sarah@hospital.com | doctor123 |

---

## Project Highlights

### What I Built
- Complete full-stack hospital queue management system
- Responsive admin dashboard with real-time statistics
- QR code-based digital ticket system
- Role-based authentication with JWT
- RESTful API with clean architecture (handlers → services → repositories)

### Technical Skills Demonstrated
- **Backend:** Go, Fiber framework, PostgreSQL, SQL queries
- **Frontend:** React, Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Architecture:** Clean architecture, layered separation
- **DevOps:** Docker, Docker Compose, environment configuration

---

## License

MIT License
