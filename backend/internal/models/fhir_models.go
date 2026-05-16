package models

import "time"

// FHIR Patient Resource
type FHIRPatient struct {
	ID                     int       `json:"id"`
	UserID                 int       `json:"user_id"`
	NIK                    string    `json:"identifier"`
	BloodType              string    `json:"blood_type"`
	EmergencyContactName   string    `json:"emergency_contact_name"`
	EmergencyContactPhone  string    `json:"emergency_contact_phone"`
	CreatedAt              time.Time `json:"created_at"`
	UpdatedAt              time.Time `json:"updated_at"`
}

// FHIR Condition (Diagnosis)
type FHIRCondition struct {
	ID                 int        `json:"id"`
	PatientID          int        `json:"patient_id"`
	ClinicalStatus     string     `json:"clinicalStatus"`
	VerificationStatus string     `json:"verificationStatus"`
	Category           string     `json:"category"`
	Severity           string     `json:"severity"`
	CodeSystem         string     `json:"codeSystem"`
	CodeCode           string     `json:"codeCode"`
	CodeDisplay        string     `json:"codeDisplay"`
	OnsetDate          *time.Time `json:"onsetDateTime"`
	AbatementDate      *time.Time `json:"abatementDateTime"`
	RecorderID         int        `json:"recorderId"`
	Note               string     `json:"note"`
	FHIRID             string     `json:"fhir_id"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// FHIR Observation (Vitals, Lab Results)
type FHIRObservation struct {
	ID                 int        `json:"id"`
	PatientID          int        `json:"patient_id"`
	Status             string     `json:"status"`
	Category           string     `json:"category"`
	CodeSystem         string     `json:"codeSystem"`
	CodeCode           string     `json:"codeCode"`
	CodeDisplay        string     `json:"codeDisplay"`
	ValueType          string     `json:"valueType"`
	ValueQuantity      *float64   `json:"valueQuantity"`
	ValueQuantityUnit  string     `json:"valueQuantityUnit"`
	ValueString        string     `json:"valueString"`
	EffectiveDate      *time.Time `json:"effectiveDateTime"`
	Interpretation     string     `json:"interpretation"`
	ReferenceRangeLow  *float64   `json:"referenceRangeLow"`
	ReferenceRangeHigh *float64   `json:"referenceRangeHigh"`
	ReferenceRangeText string     `json:"referenceRangeText"`
	ComponentJSON      string     `json:"componentJSON"`
	EncounterID        int        `json:"encounterId"`
	FHIRID             string     `json:"fhir_id"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// FHIR MedicationRequest (Prescription)
type FHIRMedicationRequest struct {
	ID                 int        `json:"id"`
	PatientID          int        `json:"patient_id"`
	Status             string     `json:"status"`
	Intent             string     `json:"intent"`
	MedicationSystem   string     `json:"medicationSystem"`
	MedicationCode     string     `json:"medicationCode"`
	MedicationDisplay  string     `json:"medicationDisplay"`
	AuthoredOn         *time.Time `json:"authoredOn"`
	RequesterID        int        `json:"requesterId"`
	DosageText         string     `json:"dosageText"`
	DosageRoute        string     `json:"dosageRoute"`
	DosageFrequency    int        `json:"dosageFrequency"`
	DosagePeriod       int        `json:"dosagePeriod"`
	DosagePeriodUnit   string     `json:"dosagePeriodUnit"`
	DispenseQuantity   int        `json:"dispenseQuantity"`
	DispenseUnit       string     `json:"dispenseUnit"`
	Note               string     `json:"note"`
	FHIRID             string     `json:"fhir_id"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// FHIR AllergyIntolerance
type FHIRAllergyIntolerance struct {
	ID                     int       `json:"id"`
	PatientID              int       `json:"patient_id"`
	ClinicalStatus         string    `json:"clinicalStatus"`
	Type                   string    `json:"type"`
	Category               string    `json:"category"`
	Criticality            string    `json:"criticality"`
	SubstanceSystem        string    `json:"substanceSystem"`
	SubstanceCode          string    `json:"substanceCode"`
	SubstanceDisplay       string    `json:"substanceDisplay"`
	ReactionManifestation  string    `json:"reactionManifestation"`
	ReactionSeverity       string    `json:"reactionSeverity"`
	Note                   string    `json:"note"`
	FHIRID                 string    `json:"fhir_id"`
	CreatedAt              time.Time `json:"created_at"`
	UpdatedAt              time.Time `json:"updated_at"`
}

// FHIR Audit Log
type FHIRAuditLog struct {
	ID             int       `json:"id"`
	ResourceType   string    `json:"resourceType"`
	ResourceID     string    `json:"resourceId"`
	Operation      string    `json:"operation"`
	PerformedBy    int       `json:"performedBy"`
	PerformedAt    time.Time `json:"performedAt"`
	RequestDetails string    `json:"requestDetails"`
	ResponseStatus int       `json:"responseStatus"`
}

// Request/Response DTOs
type CreateConditionRequest struct {
	ClinicalStatus     string `json:"clinicalStatus"`
	VerificationStatus string `json:"verificationStatus"`
	Category           string `json:"category"`
	Severity           string `json:"severity"`
	CodeSystem         string `json:"codeSystem"`
	CodeCode           string `json:"codeCode"`
	CodeDisplay        string `json:"codeDisplay"`
	OnsetDate          string `json:"onsetDate"`
	Note               string `json:"note"`
}

type CreateObservationRequest struct {
	Status              string  `json:"status"`
	Category            string  `json:"category"`
	CodeSystem          string  `json:"codeSystem"`
	CodeCode            string  `json:"codeCode"`
	CodeDisplay         string  `json:"codeDisplay"`
	ValueType           string  `json:"valueType"`
	ValueQuantity       string  `json:"valueQuantity"`
	ValueQuantityUnit   string  `json:"valueQuantityUnit"`
	ValueString         string  `json:"valueString"`
	EffectiveDate       string  `json:"effectiveDate"`
	Interpretation      string  `json:"interpretation"`
	ReferenceRangeLow   float64 `json:"referenceRangeLow"`
	ReferenceRangeHigh  float64 `json:"referenceRangeHigh"`
	ReferenceRangeText  string  `json:"referenceRangeText"`
}

type CreateMedicationRequest struct {
	Status            string `json:"status"`
	Intent            string `json:"intent"`
	MedicationSystem  string `json:"medicationSystem"`
	MedicationCode    string `json:"medicationCode"`
	MedicationDisplay string `json:"medicationDisplay"`
	DosageText        string `json:"dosageText"`
	DosageRoute       string `json:"dosageRoute"`
	DosageFrequency   int    `json:"dosageFrequency"`
	DosagePeriod      int    `json:"dosagePeriod"`
	DosagePeriodUnit  string `json:"dosagePeriodUnit"`
	Note              string `json:"note"`
}

type CreateAllergyRequest struct {
	ClinicalStatus        string `json:"clinicalStatus"`
	Type                 string `json:"type"`
	Category             string `json:"category"`
	Criticality          string `json:"criticality"`
	SubstanceSystem      string `json:"substanceSystem"`
	SubstanceCode        string `json:"substanceCode"`
	SubstanceDisplay     string `json:"substanceDisplay"`
	ReactionManifestation string `json:"reactionManifestation"`
	ReactionSeverity     string `json:"reactionSeverity"`
	Note                 string `json:"note"`
}

type PatientHealthSummary struct {
	Patient           FHIRPatient                `json:"patient"`
	Conditions        []FHIRCondition           `json:"conditions"`
	Observations      []FHIRObservation          `json:"observations"`
	Medications       []FHIRMedicationRequest    `json:"medications"`
	Allergies         []FHIRAllergyIntolerance   `json:"allergies"`
	RecentEncounters  []ReservationWithDetails  `json:"recentEncounters"`
}
