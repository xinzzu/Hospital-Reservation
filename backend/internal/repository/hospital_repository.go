package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
)

type HospitalRepository struct {
	db *sql.DB
}

func NewHospitalRepository(db *sql.DB) *HospitalRepository {
	return &HospitalRepository{db: db}
}

func (r *HospitalRepository) GetInfo() (*models.HospitalInfo, error) {
	info := &models.HospitalInfo{}
	query := `SELECT id, name, address, phone, emergency_phone, email, about, facilities, operating_hours FROM hospital_info LIMIT 1`
	
	var facilities sql.NullString
	var operatingHours sql.NullString
	
	err := r.db.QueryRow(query).Scan(
		&info.ID, &info.Name, &info.Address, &info.Phone,
		&info.EmergencyPhone, &info.Email, &info.About, &facilities, &operatingHours,
	)
	if err != nil {
		return nil, err
	}
	
	return info, nil
}
