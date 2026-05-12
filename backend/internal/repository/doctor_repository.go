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
	query := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at
		FROM doctors
		WHERE is_active = true
		ORDER BY name
		LIMIT 100`
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
	query := `SELECT id, user_id, name, specialization, room, bio, photo_url, created_at
		FROM doctors
		WHERE id = $1 AND is_active = true`
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
		WHERE is_active = true
		  AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialization) LIKE LOWER($1))
		ORDER BY name
		LIMIT 100`
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
		FROM schedules
		WHERE doctor_id = $1 AND is_active = true
		ORDER BY day_of_week, start_time`
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

func (r *DoctorRepository) Update(id int, name, specialization, room, bio string) error {
	query := `UPDATE doctors SET name = $1, specialization = $2, room = $3, bio = $4 WHERE id = $5`
	_, err := r.db.Exec(query, name, specialization, room, bio, id)
	return err
}

func (r *DoctorRepository) Delete(id int) error {
	query := `UPDATE doctors SET is_active = FALSE WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *DoctorRepository) Create(name, specialization, room, bio, photoURL string, userID int) (*models.Doctor, error) {
	query := `INSERT INTO doctors (name, specialization, room, bio, photo_url, user_id)
			  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, name, specialization, room, bio, photo_url, created_at`
	var doctor models.Doctor
	err := r.db.QueryRow(query, name, specialization, room, bio, photoURL, userID).Scan(
		&doctor.ID, &doctor.UserID, &doctor.Name, &doctor.Specialization,
		&doctor.Room, &doctor.Bio, &doctor.PhotoURL, &doctor.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &doctor, nil
}

func (r *DoctorRepository) AddSchedule(doctorID int, dayOfWeek int, startTime, endTime string, maxPatients int) (*models.Schedule, error) {
	query := `INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, max_patients)
			  VALUES ($1, $2, $3, $4, $5) RETURNING id, doctor_id, day_of_week, start_time::text, end_time::text, max_patients, is_active`
	var schedule models.Schedule
	err := r.db.QueryRow(query, doctorID, dayOfWeek, startTime, endTime, maxPatients).Scan(
		&schedule.ID, &schedule.DoctorID, &schedule.DayOfWeek,
		&schedule.StartTime, &schedule.EndTime, &schedule.MaxPatients, &schedule.IsActive)
	if err != nil {
		return nil, err
	}
	return &schedule, nil
}

func (r *DoctorRepository) UpdateSchedule(scheduleID int, dayOfWeek int, startTime, endTime string, maxPatients int, isActive bool) error {
	query := `UPDATE schedules SET day_of_week = $1, start_time = $2, end_time = $3, max_patients = $4, is_active = $5 WHERE id = $6`
	_, err := r.db.Exec(query, dayOfWeek, startTime, endTime, maxPatients, isActive, scheduleID)
	return err
}

func (r *DoctorRepository) DeleteSchedule(scheduleID int) error {
	query := `DELETE FROM schedules WHERE id = $1`
	_, err := r.db.Exec(query, scheduleID)
	return err
}
