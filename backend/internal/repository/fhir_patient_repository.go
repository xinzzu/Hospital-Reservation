package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
)

type FHIRPatientRepository struct {
	db *sql.DB
}

func NewFHIRPatientRepository(db *sql.DB) *FHIRPatientRepository {
	return &FHIRPatientRepository{db: db}
}

func (r *FHIRPatientRepository) FindByUserID(userID int) (*models.FHIRPatient, error) {
	patient := &models.FHIRPatient{}
	query := `
		SELECT id, user_id, COALESCE(nik, ''), COALESCE(blood_type, ''),
			   COALESCE(emergency_contact_name, ''), COALESCE(emergency_contact_phone, ''),
			   created_at, updated_at
		FROM fhir_patients
		WHERE user_id = $1
	`
	err := r.db.QueryRow(query, userID).Scan(
		&patient.ID, &patient.UserID, &patient.NIK, &patient.BloodType,
		&patient.EmergencyContactName, &patient.EmergencyContactPhone,
		&patient.CreatedAt, &patient.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return patient, nil
}

func (r *FHIRPatientRepository) Create(patient *models.FHIRPatient) error {
	query := `
		INSERT INTO fhir_patients (user_id, nik, blood_type, emergency_contact_name, emergency_contact_phone)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(query,
		patient.UserID, patient.NIK, patient.BloodType,
		patient.EmergencyContactName, patient.EmergencyContactPhone,
	).Scan(&patient.ID, &patient.CreatedAt, &patient.UpdatedAt)
}

func (r *FHIRPatientRepository) Update(patient *models.FHIRPatient) error {
	query := `
		UPDATE fhir_patients
		SET nik = $2, blood_type = $3, emergency_contact_name = $4, emergency_contact_phone = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.Exec(query, patient.ID, patient.NIK, patient.BloodType,
		patient.EmergencyContactName, patient.EmergencyContactPhone)
	return err
}

func (r *FHIRPatientRepository) GetOrCreateByUserID(userID int) (*models.FHIRPatient, error) {
	patient, err := r.FindByUserID(userID)
	if err == sql.ErrNoRows {
		patient = &models.FHIRPatient{UserID: userID}
		err = r.Create(patient)
	}
	return patient, err
}