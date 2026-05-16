package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
)

type FHIRAllergyRepository struct {
	db *sql.DB
}

func NewFHIRAllergyRepository(db *sql.DB) *FHIRAllergyRepository {
	return &FHIRAllergyRepository{db: db}
}

func (r *FHIRAllergyRepository) Create(patientID int, req *models.CreateAllergyRequest) (*models.FHIRAllergyIntolerance, error) {
	allergy := &models.FHIRAllergyIntolerance{
		PatientID:             patientID,
		ClinicalStatus:        req.ClinicalStatus,
		Type:                  req.Type,
		Category:              req.Category,
		Criticality:           req.Criticality,
		SubstanceSystem:       req.SubstanceSystem,
		SubstanceCode:         req.SubstanceCode,
		SubstanceDisplay:      req.SubstanceDisplay,
		ReactionManifestation: req.ReactionManifestation,
		ReactionSeverity:      req.ReactionSeverity,
		Note:                  req.Note,
	}

	query := `
		INSERT INTO fhir_allergies
		(patient_id, clinical_status, type, category, criticality,
		 substance_system, substance_code, substance_display,
		 reaction_manifestation, reaction_severity, note)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, fhir_id, created_at, updated_at
	`
	err := r.db.QueryRow(query,
		allergy.PatientID, allergy.ClinicalStatus, allergy.Type, allergy.Category,
		allergy.Criticality, allergy.SubstanceSystem, allergy.SubstanceCode,
		allergy.SubstanceDisplay, allergy.ReactionManifestation, allergy.ReactionSeverity, allergy.Note,
	).Scan(&allergy.ID, &allergy.FHIRID, &allergy.CreatedAt, &allergy.UpdatedAt)

	return allergy, err
}

func (r *FHIRAllergyRepository) FindByPatientID(patientID int) ([]models.FHIRAllergyIntolerance, error) {
	query := `
		SELECT id, patient_id, clinical_status, COALESCE(type, ''), COALESCE(category, ''),
			   COALESCE(criticality, ''), COALESCE(substance_system, ''), COALESCE(substance_code, ''),
			   COALESCE(substance_display, ''), COALESCE(reaction_manifestation, ''),
			   COALESCE(reaction_severity, ''), COALESCE(note, ''), fhir_id, created_at, updated_at
		FROM fhir_allergies
		WHERE patient_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var allergies []models.FHIRAllergyIntolerance
	for rows.Next() {
		var a models.FHIRAllergyIntolerance
		err := rows.Scan(
			&a.ID, &a.PatientID, &a.ClinicalStatus, &a.Type, &a.Category,
			&a.Criticality, &a.SubstanceSystem, &a.SubstanceCode, &a.SubstanceDisplay,
			&a.ReactionManifestation, &a.ReactionSeverity, &a.Note, &a.FHIRID,
			&a.CreatedAt, &a.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		allergies = append(allergies, a)
	}
	return allergies, nil
}

func (r *FHIRAllergyRepository) Update(id int, req *models.CreateAllergyRequest) error {
	query := `
		UPDATE fhir_allergies
		SET clinical_status = $2, type = $3, category = $4, criticality = $5,
			substance_system = $6, substance_code = $7, substance_display = $8,
			reaction_manifestation = $9, reaction_severity = $10, note = $11,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	_, err := r.db.Exec(query, id, req.ClinicalStatus, req.Type, req.Category,
		req.Criticality, req.SubstanceSystem, req.SubstanceCode, req.SubstanceDisplay,
		req.ReactionManifestation, req.ReactionSeverity, req.Note,
	)
	return err
}