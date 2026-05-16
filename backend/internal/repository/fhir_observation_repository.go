package repository

import (
	"database/sql"
	"hospital-reservation/internal/models"
	"strconv"
	"time"
)

type FHIRObservationRepository struct {
	db *sql.DB
}

func NewFHIRObservationRepository(db *sql.DB) *FHIRObservationRepository {
	return &FHIRObservationRepository{db: db}
}

func (r *FHIRObservationRepository) Create(patientID int, req *models.CreateObservationRequest) (*models.FHIRObservation, error) {
	obs := &models.FHIRObservation{
		PatientID:   patientID,
		Status:      req.Status,
		Category:    req.Category,
		CodeSystem:  req.CodeSystem,
		CodeCode:    req.CodeCode,
		CodeDisplay: req.CodeDisplay,
		ValueType:   req.ValueType,
	}

	if req.ValueType == "Quantity" && req.ValueQuantity != "" {
		if v, err := strconv.ParseFloat(req.ValueQuantity, 64); err == nil {
			obs.ValueQuantity = &v
			obs.ValueQuantityUnit = req.ValueQuantityUnit
		}
	} else if req.ValueType == "string" {
		obs.ValueString = req.ValueString
	}

	if req.EffectiveDate != "" {
		t, err := time.Parse(time.RFC3339, req.EffectiveDate)
		if err == nil {
			obs.EffectiveDate = &t
		}
	}

	obs.Interpretation = req.Interpretation
	if req.ReferenceRangeLow != 0 {
		obs.ReferenceRangeLow = &req.ReferenceRangeLow
	}
	if req.ReferenceRangeHigh != 0 {
		obs.ReferenceRangeHigh = &req.ReferenceRangeHigh
	}
	obs.ReferenceRangeText = req.ReferenceRangeText

	query := `
		INSERT INTO fhir_observations
		(patient_id, status, category, code_system, code_code, code_display, value_type,
		 value_quantity, value_quantity_unit, value_string, effective_date, interpretation,
		 reference_range_low, reference_range_high, reference_range_text)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, fhir_id, created_at, updated_at
	`
	err := r.db.QueryRow(query,
		obs.PatientID, obs.Status, obs.Category, obs.CodeSystem, obs.CodeCode, obs.CodeDisplay,
		obs.ValueType, obs.ValueQuantity, obs.ValueQuantityUnit, obs.ValueString,
		obs.EffectiveDate, obs.Interpretation, obs.ReferenceRangeLow, obs.ReferenceRangeHigh, obs.ReferenceRangeText,
	).Scan(&obs.ID, &obs.FHIRID, &obs.CreatedAt, &obs.UpdatedAt)

	return obs, err
}

func (r *FHIRObservationRepository) FindByPatientID(patientID int, category string) ([]models.FHIRObservation, error) {
	query := `
		SELECT id, patient_id, status, category, COALESCE(code_system, ''), COALESCE(code_code, ''),
			   COALESCE(code_display, ''), value_type, value_quantity, COALESCE(value_quantity_unit, ''),
			   COALESCE(value_string, ''), effective_date, COALESCE(interpretation, ''),
			   COALESCE(reference_range_low, 0), COALESCE(reference_range_high, 0), COALESCE(reference_range_text, ''),
			   COALESCE(component_json, ''), COALESCE(encounter_id, 0), fhir_id, created_at, updated_at
		FROM fhir_observations
		WHERE patient_id = $1
	`
	args := []interface{}{patientID}

	if category != "" {
		query += " AND category = $2"
		args = append(args, category)
	}

	query += " ORDER BY effective_date DESC NULLS LAST, created_at DESC"

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var observations []models.FHIRObservation
	for rows.Next() {
		var o models.FHIRObservation
		var componentJSON sql.NullString
		var encounterID sql.NullInt64
		var effectiveDate sql.NullTime

		err := rows.Scan(
			&o.ID, &o.PatientID, &o.Status, &o.Category, &o.CodeSystem, &o.CodeCode,
			&o.CodeDisplay, &o.ValueType, &o.ValueQuantity, &o.ValueQuantityUnit,
			&o.ValueString, &effectiveDate, &o.Interpretation,
			&o.ReferenceRangeLow, &o.ReferenceRangeHigh, &o.ReferenceRangeText,
			&componentJSON, &encounterID, &o.FHIRID, &o.CreatedAt, &o.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		if effectiveDate.Valid {
			o.EffectiveDate = &effectiveDate.Time
		}
		if componentJSON.Valid {
			o.ComponentJSON = componentJSON.String
		}
		if encounterID.Valid {
			o.EncounterID = int(encounterID.Int64)
		}
		observations = append(observations, o)
	}
	return observations, nil
}

func (r *FHIRObservationRepository) FindByID(id int) (*models.FHIRObservation, error) {
	obs := &models.FHIRObservation{}
	query := `
		SELECT id, patient_id, status, category, COALESCE(code_system, ''), COALESCE(code_code, ''),
			   COALESCE(code_display, ''), value_type, value_quantity, COALESCE(value_quantity_unit, ''),
			   COALESCE(value_string, ''), effective_date, COALESCE(interpretation, ''),
			   COALESCE(reference_range_low, 0), COALESCE(reference_range_high, 0), COALESCE(reference_range_text, ''),
			   COALESCE(component_json, ''), COALESCE(encounter_id, 0), fhir_id, created_at, updated_at
		FROM fhir_observations WHERE id = $1
	`
	var componentJSON sql.NullString
	var encounterID sql.NullInt64
	var effectiveDate sql.NullTime

	err := r.db.QueryRow(query, id).Scan(
		&obs.ID, &obs.PatientID, &obs.Status, &obs.Category, &obs.CodeSystem, &obs.CodeCode,
		&obs.CodeDisplay, &obs.ValueType, &obs.ValueQuantity, &obs.ValueQuantityUnit,
		&obs.ValueString, &effectiveDate, &obs.Interpretation,
		&obs.ReferenceRangeLow, &obs.ReferenceRangeHigh, &obs.ReferenceRangeText,
		&componentJSON, &encounterID, &obs.FHIRID, &obs.CreatedAt, &obs.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	if effectiveDate.Valid {
		obs.EffectiveDate = &effectiveDate.Time
	}
	if componentJSON.Valid {
		obs.ComponentJSON = componentJSON.String
	}
	if encounterID.Valid {
		obs.EncounterID = int(encounterID.Int64)
	}
	return obs, nil
}