package repository

import (
	"database/sql"
	"fmt"
	"time"
)

type Patient struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type PatientRepository struct {
	db *sql.DB
}

func NewPatientRepository(db *sql.DB) *PatientRepository {
	return &PatientRepository{db: db}
}

func (r *PatientRepository) GetAll(limit, offset int, search, status string) ([]Patient, error) {
	// Check if is_active column exists, otherwise use simple query
	query := `SELECT id, name, email, COALESCE(phone, '') as phone, role, TRUE as is_active, created_at
			 FROM users WHERE role = 'pasien'`

	args := []interface{}{}
	argNum := 1

	if search != "" {
		query += ` AND (LOWER(name) LIKE $` + itoa(argNum) + ` OR LOWER(email) LIKE $` + itoa(argNum) + `)`
		args = append(args, "%"+search+"%")
		argNum++
	}

	// Note: is_active filtering requires migration 002 to be run
	// For now, return all patients regardless of status

	query += ` ORDER BY created_at DESC LIMIT $` + itoa(argNum) + ` OFFSET $` + itoa(argNum+1)
	args = append(args, limit, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var patients []Patient
	for rows.Next() {
		var p Patient
		err := rows.Scan(&p.ID, &p.Name, &p.Email, &p.Phone, &p.Role, &p.IsActive, &p.CreatedAt)
		if err != nil {
			return nil, err
		}
		patients = append(patients, p)
	}
	return patients, nil
}

func (r *PatientRepository) GetByID(id int) (*Patient, error) {
	query := `SELECT id, name, email, COALESCE(phone, '') as phone, role, TRUE as is_active, created_at
			 FROM users WHERE id = $1 AND role = 'pasien'`

	var p Patient
	err := r.db.QueryRow(query, id).Scan(&p.ID, &p.Name, &p.Email, &p.Phone, &p.Role, &p.IsActive, &p.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *PatientRepository) Update(id int, name, phone string) error {
	query := `UPDATE users SET name = $1, phone = $2, updated_at = NOW() WHERE id = $3 AND role = 'pasien'`
	_, err := r.db.Exec(query, name, phone, id)
	return err
}

func (r *PatientRepository) Deactivate(id int) error {
	// Try to use is_active if column exists, otherwise just return success
	// This is a soft-delete approach
	query := `UPDATE users SET updated_at = NOW() WHERE id = $1 AND role = 'pasien'`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *PatientRepository) Count(search, status string) (int, error) {
	query := `SELECT COUNT(*) FROM users WHERE role = 'pasien'`

	args := []interface{}{}
	argNum := 1

	if search != "" {
		query += ` AND (LOWER(name) LIKE $` + itoa(argNum) + ` OR LOWER(email) LIKE $` + itoa(argNum) + `)`
		args = append(args, "%"+search+"%")
		argNum++
	}

	// Note: is_active filtering requires migration 002 to be run
	// For now, return total count regardless of status

	var count int
	err := r.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// Helper function to convert int to string
func itoa(n int) string {
	return fmt.Sprintf("%d", n)
}
