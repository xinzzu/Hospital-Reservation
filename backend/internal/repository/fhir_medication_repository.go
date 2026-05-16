package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
	"time"
)

type FHIRMedicationRepository struct {
	db *sql.DB
}

func NewFHIRMedicationRepository(db *sql.DB) *FHIRMedicationRepository {
	return &FHIRMedicationRepository{db: db}
}

func (r *FHIRMedicationRepository) Create(patientID int, req *models.CreateMedicationRequest, requesterID int) (*models.FHIRMedicationRequest, error) {
	med := &models.FHIRMedicationRequest{
		PatientID:          patientID,
		Status:             req.Status,
		Intent:             req.Intent,
		MedicationSystem:   req.MedicationSystem,
		MedicationCode:     req.MedicationCode,
		MedicationDisplay:  req.MedicationDisplay,
		RequesterID:        requesterID,
		DosageText:         req.DosageText,
		DosageRoute:        req.DosageRoute,
		DosageFrequency:    req.DosageFrequency,
		DosagePeriod:       req.DosagePeriod,
		DosagePeriodUnit:   req.DosagePeriodUnit,
		Note:               req.Note,
	}

	now := time.Now()
	med.AuthoredOn = &now

	query := `
		INSERT INTO fhir_medication_requests
		(patient_id, status, intent, medication_system, medication_code, medication_display,
		 authored_on, requester_id, dosage_text, dosage_route, dosage_frequency,
		 dosage_period, dosage_period_unit, note)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, fhir_id, created_at, updated_at
	`
	err := r.db.QueryRow(query,
		med.PatientID, med.Status, med.Intent, med.MedicationSystem, med.MedicationCode,
		med.MedicationDisplay, med.AuthoredOn, med.RequesterID, med.DosageText, med.DosageRoute,
		med.DosageFrequency, med.DosagePeriod, med.DosagePeriodUnit, med.Note,
	).Scan(&med.ID, &med.FHIRID, &med.CreatedAt, &med.UpdatedAt)

	return med, err
}

func (r *FHIRMedicationRepository) FindByPatientID(patientID int) ([]models.FHIRMedicationRequest, error) {
	query := `
		SELECT id, patient_id, status, COALESCE(intent, ''), COALESCE(medication_system, ''),
			   COALESCE(medication_code, ''), COALESCE(medication_display, ''), authored_on,
			   requester_id, COALESCE(dosage_text, ''), COALESCE(dosage_route, ''),
			   dosage_frequency, dosage_period, COALESCE(dosage_period_unit, ''),
			   COALESCE(dispense_quantity, 0), COALESCE(dispense_unit, ''), COALESCE(note, ''),
			   fhir_id, created_at, updated_at
		FROM fhir_medication_requests
		WHERE patient_id = $1
		ORDER BY authored_on DESC NULLS LAST, created_at DESC
	`
	rows, err := r.db.Query(query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var medications []models.FHIRMedicationRequest
	for rows.Next() {
		var m models.FHIRMedicationRequest
		err := rows.Scan(
			&m.ID, &m.PatientID, &m.Status, &m.Intent, &m.MedicationSystem,
			&m.MedicationCode, &m.MedicationDisplay, &m.AuthoredOn, &m.RequesterID,
			&m.DosageText, &m.DosageRoute, &m.DosageFrequency, &m.DosagePeriod,
			&m.DosagePeriodUnit, &m.DispenseQuantity, &m.DispenseUnit, &m.Note,
			&m.FHIRID, &m.CreatedAt, &m.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		medications = append(medications, m)
	}
	return medications, nil
}

func (r *FHIRMedicationRepository) FindByID(id int) (*models.FHIRMedicationRequest, error) {
	med := &models.FHIRMedicationRequest{}
	query := `
		SELECT id, patient_id, status, COALESCE(intent, ''), COALESCE(medication_system, ''),
			   COALESCE(medication_code, ''), COALESCE(medication_display, ''), authored_on,
			   requester_id, COALESCE(dosage_text, ''), COALESCE(dosage_route, ''),
			   dosage_frequency, dosage_period, COALESCE(dosage_period_unit, ''),
			   COALESCE(dispense_quantity, 0), COALESCE(dispense_unit, ''), COALESCE(note, ''),
			   fhir_id, created_at, updated_at
		FROM fhir_medication_requests WHERE id = $1
	`
	err := r.db.QueryRow(query, id).Scan(
		&med.ID, &med.PatientID, &med.Status, &med.Intent, &med.MedicationSystem,
		&med.MedicationCode, &med.MedicationDisplay, &med.AuthoredOn, &med.RequesterID,
		&med.DosageText, &med.DosageRoute, &med.DosageFrequency, &med.DosagePeriod,
		&med.DosagePeriodUnit, &med.DispenseQuantity, &med.DispenseUnit, &med.Note,
		&med.FHIRID, &med.CreatedAt, &med.UpdatedAt,
	)
	return med, err
}

func (r *FHIRMedicationRepository) UpdateStatus(id int, status string) error {
	query := `UPDATE fhir_medication_requests SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`
	_, err := r.db.Exec(query, id, status)
	return err
}