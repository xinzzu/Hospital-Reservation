package models

import "time"

// Reservation status constants
const (
	StatusWaiting    = "menunggu"
	StatusCalled    = "dipanggil"
	StatusCompleted = "selesai"
	StatusCancelled = "batal"
)

// User roles
const (
	RoleAdmin   = "admin"
	RolePatient = "pasien"
	RoleDoctor  = "dokter"
)

type User struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Phone        string    `json:"phone"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Doctor struct {
	ID             int       `json:"id"`
	UserID         int       `json:"user_id"`
	Name           string    `json:"name"`
	Specialization string    `json:"specialization"`
	Room           string    `json:"room"`
	Bio            string    `json:"bio"`
	PhotoURL       string    `json:"photo_url"`
	CreatedAt      time.Time `json:"created_at"`
}

type Schedule struct {
	ID          int    `json:"id"`
	DoctorID    int    `json:"doctor_id"`
	DayOfWeek   int    `json:"day_of_week"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	MaxPatients int    `json:"max_patients"`
	IsActive    bool   `json:"is_active"`
}

type Reservation struct {
	ID               int       `json:"id"`
	PatientID        int       `json:"patient_id"`
	DoctorID         int       `json:"doctor_id"`
	ScheduleID       int       `json:"schedule_id"`
	ReservationDate string    `json:"reservation_date"`
	QueueNumber      int       `json:"queue_number"`
	QueueCode        string    `json:"queue_code"`
	Status           string    `json:"status"`
	Notes            string    `json:"notes"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type HospitalInfo struct {
	ID              int       `json:"id"`
	Name            string    `json:"name"`
	Address         string    `json:"address"`
	Phone           string    `json:"phone"`
	EmergencyPhone  string    `json:"emergency_phone"`
	Email           string    `json:"email"`
	About           string    `json:"about"`
	Facilities      []string  `json:"facilities"`
	OperatingHours  string    `json:"operating_hours"`
}

// Request/Response DTOs
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateReservationRequest struct {
	DoctorID   int    `json:"doctor_id"`
	ScheduleID int    `json:"schedule_id"`
	Date       string `json:"date"`
	Notes      string `json:"notes"`
}

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

type DoctorWithSchedules struct {
	Doctor    Doctor     `json:"doctor"`
	Schedules []Schedule `json:"schedules"`
}

type ReservationWithDetails struct {
	Reservation
	DoctorName        string `json:"doctor_name"`
	DoctorSpec        string `json:"doctor_specialization"`
	DoctorRoom        string `json:"doctor_room"`
	ScheduleStartTime string `json:"schedule_start_time"`
	ScheduleEndTime   string `json:"schedule_end_time"`
	PatientName       string `json:"patient_name,omitempty"`
	PatientPhone      string `json:"patient_phone,omitempty"`
}

// AdminStats represents dashboard statistics
type AdminStats struct {
	TotalReservations  int `json:"total_reservations"`
	TodayReservations  int `json:"today_reservations"`
	WaitingCount       int `json:"waiting_count"`
	CalledCount        int `json:"called_count"`
	CompletedCount     int `json:"completed_count"`
	CancelledCount     int `json:"cancelled_count"`
	TotalDoctors       int `json:"total_doctors"`
	TotalPatients      int `json:"total_patients"`
	ActiveReservations int `json:"active_reservations"`
}

// AdminReservationFilter for filtering reservations in admin
type AdminReservationFilter struct {
	Status   string `query:"status"`
	Date     string `query:"date"`
	DoctorID int    `query:"doctor_id"`
	Search   string `query:"search"`
	Page     int    `query:"page"`
	Limit    int    `query:"limit"`
}

// PaginatedResponse for admin list endpoints
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	Total      int         `json:"total"`
	TotalPages int         `json:"total_pages"`
}
