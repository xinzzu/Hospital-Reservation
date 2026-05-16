package services

import (
	"errors"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
)

type FHIRService struct {
	patientRepo     *repository.FHIRPatientRepository
	conditionRepo   *repository.FHIRConditionRepository
	observationRepo *repository.FHIRObservationRepository
	medicationRepo  *repository.FHIRMedicationRepository
	allergyRepo     *repository.FHIRAllergyRepository
	reservationRepo *repository.ReservationRepository
}

func NewFHIRService(
	patientRepo *repository.FHIRPatientRepository,
	conditionRepo *repository.FHIRConditionRepository,
	observationRepo *repository.FHIRObservationRepository,
	medicationRepo *repository.FHIRMedicationRepository,
	allergyRepo *repository.FHIRAllergyRepository,
	reservationRepo *repository.ReservationRepository,
) *FHIRService {
	return &FHIRService{
		patientRepo:     patientRepo,
		conditionRepo:   conditionRepo,
		observationRepo: observationRepo,
		medicationRepo:  medicationRepo,
		allergyRepo:     allergyRepo,
		reservationRepo: reservationRepo,
	}
}

// Patient operations
func (s *FHIRService) GetOrCreatePatient(userID int) (*models.FHIRPatient, error) {
	return s.patientRepo.GetOrCreateByUserID(userID)
}

func (s *FHIRService) UpdatePatient(userID int, patient *models.FHIRPatient) error {
	existing, err := s.patientRepo.FindByUserID(userID)
	if err != nil {
		return errors.New("patient not found")
	}
	patient.ID = existing.ID
	patient.UserID = userID
	return s.patientRepo.Update(patient)
}

func (s *FHIRService) GetPatientHealthSummary(userID int) (*models.PatientHealthSummary, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}

	conditions, _ := s.conditionRepo.FindByPatientID(patient.ID)
	observations, _ := s.observationRepo.FindByPatientID(patient.ID, "")
	medications, _ := s.medicationRepo.FindByPatientID(patient.ID)
	allergies, _ := s.allergyRepo.FindByPatientID(patient.ID)
	reservations, _ := s.reservationRepo.FindByPatientID(userID)

	recentEncounters := reservations
	if len(recentEncounters) > 5 {
		recentEncounters = recentEncounters[:5]
	}

	return &models.PatientHealthSummary{
		Patient:          *patient,
		Conditions:       conditions,
		Observations:     observations,
		Medications:      medications,
		Allergies:        allergies,
		RecentEncounters: recentEncounters,
	}, nil
}

// Condition operations
func (s *FHIRService) CreateCondition(userID int, req *models.CreateConditionRequest) (*models.FHIRCondition, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	if req.ClinicalStatus == "" {
		req.ClinicalStatus = "active"
	}
	if req.VerificationStatus == "" {
		req.VerificationStatus = "unconfirmed"
	}
	return s.conditionRepo.Create(patient.ID, req)
}

func (s *FHIRService) GetConditions(userID int) ([]models.FHIRCondition, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.conditionRepo.FindByPatientID(patient.ID)
}

// Observation operations
func (s *FHIRService) CreateObservation(userID int, req *models.CreateObservationRequest) (*models.FHIRObservation, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	if req.Status == "" {
		req.Status = "final"
	}
	return s.observationRepo.Create(patient.ID, req)
}

func (s *FHIRService) GetObservations(userID int, category string) ([]models.FHIRObservation, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.observationRepo.FindByPatientID(patient.ID, category)
}

// Medication operations
func (s *FHIRService) CreateMedication(userID int, req *models.CreateMedicationRequest) (*models.FHIRMedicationRequest, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	if req.Status == "" {
		req.Status = "active"
	}
	if req.Intent == "" {
		req.Intent = "order"
	}
	return s.medicationRepo.Create(patient.ID, req, userID)
}

func (s *FHIRService) GetMedications(userID int) ([]models.FHIRMedicationRequest, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.medicationRepo.FindByPatientID(patient.ID)
}

// Allergy operations
func (s *FHIRService) CreateAllergy(userID int, req *models.CreateAllergyRequest) (*models.FHIRAllergyIntolerance, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	if req.ClinicalStatus == "" {
		req.ClinicalStatus = "active"
	}
	return s.allergyRepo.Create(patient.ID, req)
}

func (s *FHIRService) GetAllergies(userID int) ([]models.FHIRAllergyIntolerance, error) {
	patient, err := s.patientRepo.GetOrCreateByUserID(userID)
	if err != nil {
		return nil, err
	}
	return s.allergyRepo.FindByPatientID(patient.ID)
}