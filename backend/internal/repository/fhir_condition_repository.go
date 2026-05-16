package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
	"time"
)

type FHIRConditionRepository struct {
	db *sql.DB
}

func NewFHIRConditionRepository(db *sql.DB) *FHIRConditionRepository {
	return &FHIRConditionRepository{db: db}
}

func (r *FHIRConditionRepository) Create(patientID int, req *models.CreateConditionRequest) (*models.FHIRCondition, error) {
	condition := &models.FHIRCondition{
		PatientID:          patientID,
		ClinicalStatus:     req.ClinicalStatus,
		VerificationStatus: req.VerificationStatus,
		Category:           req.Category,
		Severity:           req.Severity,
		CodeSystem:         req.CodeSystem,
		CodeCode:           req.CodeCode,
		CodeDisplay:        req.CodeDisplay,
		Note:               req.Note,
	}

	if req.OnsetDate != "" {
		t, err := time.Parse("2006-01-02", req.OnsetDate)
		if err == nil {
			condition.OnsetDate = &t
		}
	}

	query := `
		INSERT INTO fhir_conditions
		(patient_id, clinical_status, verification_status, category, severity,
		 code_system, code_code, code_display, onset_date, note)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, fhir_id, created_at, updated_at
	`
	err := r.db.QueryRow(query,
		condition.PatientID, condition.ClinicalStatus, condition.VerificationStatus,
		condition.Category, condition.Severity, condition.CodeSystem,
		condition.CodeCode, condition.CodeDisplay, condition.OnsetDate, condition.Note,
	).Scan(&condition.ID, &condition.FHIRID, &condition.CreatedAt, &condition.UpdatedAt)

	return condition, err
}

func (r *FHIRConditionRepository) FindByPatientID(patientID int) ([]models.FHIRCondition, error) {
	query := `
		SELECT id, patient_id, clinical_status, verification_status, category, severity,
			   COALESCE(code_system, ''), COALESCE(code_code, ''), COALESCE(code_display, ''),
			   onset_date, abatement_date, recorder_id, COALESCE(note, ''), fhir_id, created_at, updated_at
		FROM fhir_conditions
		WHERE patient_id = $1
		ORDER BY onset_date DESC NULLS LAST, created_at DESC
	`
	rows, err := r.db.Query(query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conditions []models.FHIRCondition
	for rows.Next() {
		var c models.FHIRCondition
		var onsetDate, abatementDate sql.NullTime
		var recorderID sql.NullInt64
		err := rows.Scan(
			&c.ID, &c.PatientID, &c.ClinicalStatus, &c.VerificationStatus,
			&c.Category, &c.Severity, &c.CodeSystem, &c.CodeCode, &c.CodeDisplay,
			&onsetDate, &abatementDate, &recorderID, &c.Note, &c.FHIRID, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		if onsetDate.Valid {
			c.OnsetDate = &onsetDate.Time
		}
		if abatementDate.Valid {
			c.AbatementDate = &abatementDate.Time
		}
		if recorderID.Valid {
			c.RecorderID = int(recorderID.Int64)
		}
		conditions = append(conditions, c)
	}
	return conditions, nil
}

func (r *FHIRConditionRepository) FindByID(id int) (*models.FHIRCondition, error) {
	condition := &models.FHIRCondition{}
	query := `
		SELECT id, patient_id, clinical_status, verification_status, category, severity,
			   COALESCE(code_system, ''), COALESCE(code_code, ''), COALESCE(code_display, ''),
			   onset_date, abatement_date, recorder_id, COALESCE(note, ''), fhir_id, created_at, updated_at
		FROM fhir_conditions WHERE id = $1
	`
	err := r.db.QueryRow(query, id).Scan(
		&condition.ID, &condition.PatientID, &condition.ClinicalStatus, &condition.VerificationStatus,
		&condition.Category, &condition.Severity, &condition.CodeSystem,
		&condition.CodeCode, &condition.CodeDisplay,
		&condition.OnsetDate, &condition.AbatementDate, &condition.RecorderID, &condition.Note,
		&condition.FHIRID, &condition.CreatedAt, &condition.UpdatedAt,
	)
	return condition, err
}

func (r *FHIRConditionRepository) Update(id int, req *models.CreateConditionRequest, recorderID int) error {
	var onsetDate interface{} = nil
	if req.OnsetDate != "" {
		t, err := time.Parse("2006-01-02", req.OnsetDate)
		if err == nil {
			onsetDate = t
		}
	}

	query := `
		UPDATE fhir_conditions
		SET clinical_status = $2, verification_status = $3, category = $4, severity = $5,
			code_system = $6, code_code = $7, code_display = $8, onset_date = $9,
			note = $10, recorder_id = $11, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.Exec(query, id, req.ClinicalStatus, req.VerificationStatus,
		req.Category, req.Severity, req.CodeSystem, req.CodeCode, req.CodeDisplay,
		onsetDate, req.Note, recorderID,
	)
	return err
}

func (r *FHIRConditionRepository) Delete(id int) error {
	_, err := r.db.Exec("DELETE FROM fhir_conditions WHERE id = $1", id)
	return err
}