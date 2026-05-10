package repository

import (
	"database/sql"
	"fmt"
	"hospital-reservation/internal/models"
	"strings"
	"time"
)

type AdminRepository struct {
	db *sql.DB
}

func NewAdminRepository(db *sql.DB) *AdminRepository {
	return &AdminRepository{db: db}
}

func (r *AdminRepository) GetStats() (*models.AdminStats, error) {
	stats := &models.AdminStats{}
	today := time.Now().Format("2006-01-02")

	// Total reservations
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations`).Scan(&stats.TotalReservations)

	// Today's reservations
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations WHERE reservation_date = $1`, today).Scan(&stats.TodayReservations)

	// Status counts using constants
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations WHERE status = $1`, models.StatusWaiting).Scan(&stats.WaitingCount)
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations WHERE status = $1`, models.StatusCalled).Scan(&stats.CalledCount)
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations WHERE status = $1`, models.StatusCompleted).Scan(&stats.CompletedCount)
	r.db.QueryRow(`SELECT COUNT(*) FROM reservations WHERE status = $1`, models.StatusCancelled).Scan(&stats.CancelledCount)

	// Counts
	r.db.QueryRow(`SELECT COUNT(*) FROM doctors WHERE is_active = true`).Scan(&stats.TotalDoctors)
	r.db.QueryRow(`SELECT COUNT(*) FROM users WHERE role = $1`, models.RolePatient).Scan(&stats.TotalPatients)

	// Active = waiting or called
	stats.ActiveReservations = stats.WaitingCount + stats.CalledCount

	return stats, nil
}

func (r *AdminRepository) GetReservations(filter *models.AdminReservationFilter) ([]models.ReservationWithDetails, int, error) {
	// Set defaults
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 20
	}

	// Build query
	var conditions []string
	var args []interface{}
	argCount := 1

	if filter.Status != "" {
		conditions = append(conditions, fmt.Sprintf("r.status = $%d", argCount))
		args = append(args, filter.Status)
		argCount++
	}

	if filter.Date != "" {
		conditions = append(conditions, fmt.Sprintf("r.reservation_date = $%d", argCount))
		args = append(args, filter.Date)
		argCount++
	}

	if filter.DoctorID > 0 {
		conditions = append(conditions, fmt.Sprintf("r.doctor_id = $%d", argCount))
		args = append(args, filter.DoctorID)
		argCount++
	}

	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(d.name ILIKE $%d OR r.queue_code ILIKE $%d)", argCount, argCount))
		args = append(args, "%"+filter.Search+"%")
		argCount++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM reservations r
		JOIN doctors d ON r.doctor_id = d.id %s`, whereClause)
	var total int
	r.db.QueryRow(countQuery, args...).Scan(&total)

	// Get paginated results
	offset := (filter.Page - 1) * filter.Limit
	args = append(args, filter.Limit, offset)

	query := fmt.Sprintf(`
		SELECT r.id, r.patient_id, r.doctor_id, r.schedule_id, r.reservation_date,
			   r.queue_number, r.queue_code, r.status, r.notes, r.created_at, r.updated_at,
			   d.name, d.specialization, d.room, s.start_time::text, s.end_time::text,
			   u.name as patient_name, u.phone as patient_phone
		FROM reservations r
		JOIN doctors d ON r.doctor_id = d.id
		JOIN schedules s ON r.schedule_id = s.id
		JOIN users u ON r.patient_id = u.id
		%s
		ORDER BY r.reservation_date DESC, r.queue_number ASC
		LIMIT $%d OFFSET $%d
	`, whereClause, argCount, argCount+1)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var reservations []models.ReservationWithDetails
	for rows.Next() {
		var res models.ReservationWithDetails
		var patientName, patientPhone sql.NullString
		err := rows.Scan(
			&res.ID, &res.PatientID, &res.DoctorID, &res.ScheduleID, &res.ReservationDate,
			&res.QueueNumber, &res.QueueCode, &res.Status, &res.Notes, &res.CreatedAt, &res.UpdatedAt,
			&res.DoctorName, &res.DoctorSpec, &res.DoctorRoom, &res.ScheduleStartTime, &res.ScheduleEndTime,
			&patientName, &patientPhone,
		)
		if err != nil {
			return nil, 0, err
		}
		if patientName.Valid {
			res.PatientName = patientName.String
		}
		if patientPhone.Valid {
			res.PatientPhone = patientPhone.String
		}
		reservations = append(reservations, res)
	}

	return reservations, total, nil
}

func (r *AdminRepository) GetAllDoctors() ([]models.Doctor, error) {
	query := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at
		FROM doctors ORDER BY name`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var doctors []models.Doctor
	for rows.Next() {
		var d models.Doctor
		err := rows.Scan(&d.ID, &d.UserID, &d.Name, &d.Specialization, &d.Room, &d.Bio, &d.PhotoURL, &d.CreatedAt)
		if err != nil {
			return nil, err
		}
		doctors = append(doctors, d)
	}
	return doctors, nil
}