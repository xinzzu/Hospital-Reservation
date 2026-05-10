package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
)

type DoctorRepository struct {
	db *sql.DB
}

func NewDoctorRepository(db *sql.DB) *DoctorRepository {
	return &DoctorRepository{db: db}
}

func (r *DoctorRepository) FindAll() ([]models.Doctor, error) {
	query := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at FROM doctors ORDER BY name`
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

func (r *DoctorRepository) FindByID(id int) (*models.Doctor, error) {
	doctor := &models.Doctor{}
	query := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at FROM doctors WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&doctor.ID, &doctor.UserID, &doctor.Name, &doctor.Specialization,
		&doctor.Room, &doctor.Bio, &doctor.PhotoURL, &doctor.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return doctor, nil
}

func (r *DoctorRepository) Search(query string) ([]models.Doctor, error) {
	sqlQuery := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at 
		FROM doctors 
		WHERE LOWER(name) LIKE LOWER($1) OR LOWER(specialization) LIKE LOWER($1)
		ORDER BY name`
	searchTerm := "%" + query + "%"
	rows, err := r.db.Query(sqlQuery, searchTerm)
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

func (r *DoctorRepository) GetSchedules(doctorID int) ([]models.Schedule, error) {
	query := `SELECT id, doctor_id, day_of_week, start_time::text, end_time::text, max_patients, is_active 
		FROM schedules WHERE doctor_id = $1 AND is_active = true ORDER BY day_of_week, start_time`
	rows, err := r.db.Query(query, doctorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schedules []models.Schedule
	for rows.Next() {
		var s models.Schedule
		err := rows.Scan(&s.ID, &s.DoctorID, &s.DayOfWeek, &s.StartTime, &s.EndTime, &s.MaxPatients, &s.IsActive)
		if err != nil {
			return nil, err
		}
		schedules = append(schedules, s)
	}
	return schedules, nil
}

func (r *DoctorRepository) GetScheduleByID(scheduleID int) (*models.Schedule, error) {
	schedule := &models.Schedule{}
	query := `SELECT id, doctor_id, day_of_week, start_time::text, end_time::text, max_patients, is_active 
		FROM schedules WHERE id = $1`
	err := r.db.QueryRow(query, scheduleID).Scan(
		&schedule.ID, &schedule.DoctorID, &schedule.DayOfWeek,
		&schedule.StartTime, &schedule.EndTime, &schedule.MaxPatients, &schedule.IsActive,
	)
	if err != nil {
		return nil, err
	}
	return schedule, nil
}

func (r *DoctorRepository) GetDoctorCode(doctorID int) (string, error) {
	code := ""
	query := `SELECT CONCAT('DR', LPAD($1::text, 2, '0'))`
	err := r.db.QueryRow(query, doctorID).Scan(&code)
	return code, err
}
