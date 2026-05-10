package repository

import (
	"database/sql"
	"fmt"
	"hospital-reservation/internal/models"
	"time"
)

type ReservationRepository struct {
	db *sql.DB
}

func NewReservationRepository(db *sql.DB) *ReservationRepository {
	return &ReservationRepository{db: db}
}

func (r *ReservationRepository) Create(res *models.Reservation) error {
	query := `
		INSERT INTO reservations (patient_id, doctor_id, schedule_id, reservation_date, queue_number, queue_code, status, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(query,
		res.PatientID, res.DoctorID, res.ScheduleID, res.ReservationDate,
		res.QueueNumber, res.QueueCode, models.StatusWaiting, res.Notes,
	).Scan(&res.ID, &res.CreatedAt, &res.UpdatedAt)
}

func (r *ReservationRepository) GetNextQueueNumber(doctorID int, date string) (int, error) {
	var maxNum sql.NullInt64
	query := `SELECT MAX(queue_number) FROM reservations WHERE doctor_id = $1 AND reservation_date = $2`
	err := r.db.QueryRow(query, doctorID, date).Scan(&maxNum)
	if err != nil {
		return 1, nil
	}
	if !maxNum.Valid {
		return 1, nil
	}
	return int(maxNum.Int64) + 1, nil
}

func (r *ReservationRepository) FindByPatientID(patientID int) ([]models.ReservationWithDetails, error) {
	query := `
		SELECT r.id, r.patient_id, r.doctor_id, r.schedule_id, r.reservation_date, 
			   r.queue_number, r.queue_code, r.status, r.notes, r.created_at, r.updated_at,
			   d.name, d.specialization, d.room, s.start_time::text, s.end_time::text
		FROM reservations r
		JOIN doctors d ON r.doctor_id = d.id
		JOIN schedules s ON r.schedule_id = s.id
		WHERE r.patient_id = $1
		ORDER BY r.reservation_date DESC, r.queue_number ASC
	`
	rows, err := r.db.Query(query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservations []models.ReservationWithDetails
	for rows.Next() {
		var res models.ReservationWithDetails
		err := rows.Scan(
			&res.ID, &res.PatientID, &res.DoctorID, &res.ScheduleID, &res.ReservationDate,
			&res.QueueNumber, &res.QueueCode, &res.Status, &res.Notes, &res.CreatedAt, &res.UpdatedAt,
			&res.DoctorName, &res.DoctorSpec, &res.DoctorRoom, &res.ScheduleStartTime, &res.ScheduleEndTime,
		)
		if err != nil {
			return nil, err
		}
		reservations = append(reservations, res)
	}
	return reservations, nil
}

func (r *ReservationRepository) FindByCode(code string) (*models.ReservationWithDetails, error) {
	res := &models.ReservationWithDetails{}
	query := `
		SELECT r.id, r.patient_id, r.doctor_id, r.schedule_id, r.reservation_date, 
			   r.queue_number, r.queue_code, r.status, r.notes, r.created_at, r.updated_at,
			   d.name, d.specialization, d.room, s.start_time::text, s.end_time::text
		FROM reservations r
		JOIN doctors d ON r.doctor_id = d.id
		JOIN schedules s ON r.schedule_id = s.id
		WHERE r.queue_code = $1
	`
	err := r.db.QueryRow(query, code).Scan(
		&res.ID, &res.PatientID, &res.DoctorID, &res.ScheduleID, &res.ReservationDate,
		&res.QueueNumber, &res.QueueCode, &res.Status, &res.Notes, &res.CreatedAt, &res.UpdatedAt,
		&res.DoctorName, &res.DoctorSpec, &res.DoctorRoom, &res.ScheduleStartTime, &res.ScheduleEndTime,
	)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (r *ReservationRepository) UpdateStatus(code string, status string) error {
	query := `UPDATE reservations SET status = $1, updated_at = $2 WHERE queue_code = $3`
	result, err := r.db.Exec(query, status, time.Now(), code)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("reservation not found")
	}
	return nil
}

func (r *ReservationRepository) CountByScheduleAndDate(scheduleID int, date string) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM reservations WHERE schedule_id = $1 AND reservation_date = $2 AND status != 'batal'`
	err := r.db.QueryRow(query, scheduleID, date).Scan(&count)
	return count, err
}

func GenerateQueueCode(doctorID int, date time.Time, queueNumber int) string {
	doctorCode := fmt.Sprintf("DR%02d", doctorID)
	dateStr := date.Format("020106") // DDMMYY
	queueStr := fmt.Sprintf("%03d", queueNumber)
	return fmt.Sprintf("%s-%s-%s", doctorCode, dateStr, queueStr)
}
