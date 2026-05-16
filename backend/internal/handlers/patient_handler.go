package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"hospital-reservation/internal/services"
)

type PatientHandler struct {
	service *services.PatientService
	// EHR dependencies (exported for wiring from admin handler)
	FHIRService *services.FHIRService
	MedRepo     *repository.FHIRMedicationRepository
	AllergyRepo *repository.FHIRAllergyRepository
}

func NewPatientHandler(
	service *services.PatientService,
	fhirService *services.FHIRService,
	medRepo *repository.FHIRMedicationRepository,
	allergyRepo *repository.FHIRAllergyRepository,
) *PatientHandler {
	return &PatientHandler{
		service:     service,
		FHIRService: fhirService,
		MedRepo:     medRepo,
		AllergyRepo: allergyRepo,
	}
}

// GetAll returns all patients with pagination
func (h *PatientHandler) GetAll(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	search := c.Query("search", "")
	status := c.Query("status", "")

	patients, total, err := h.service.GetAll(page, limit, search, status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch patients",
			"error":   err.Error(),
		})
	}

	totalPages := 0
	if total > 0 {
		totalPages = (total + limit - 1) / limit
	}

	return c.JSON(fiber.Map{
		"data":        patients,
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": totalPages,
	})
}

// GetByID returns a single patient
func (h *PatientHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	return c.JSON(fiber.Map{
		"patient": patient,
	})
}

// Update updates patient info
func (h *PatientHandler) Update(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	var body struct {
		Name  string `json:"name"`
		Phone string `json:"phone"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	if err := h.service.Update(id, body.Name, body.Phone); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Patient updated successfully",
	})
}

// Deactivate deactivates a patient account
func (h *PatientHandler) Deactivate(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	if err := h.service.Deactivate(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to deactivate patient",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Patient deactivated successfully",
	})
}

// GetPatientEHR returns full EHR for a patient
func (h *PatientHandler) GetPatientEHR(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	// Get patient info
	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	// PatientResponse.ID is the user_id
	userID := patient.ID
	summary, err := h.FHIRService.GetPatientHealthSummary(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch patient EHR",
		})
	}

	return c.JSON(fiber.Map{
		"data": summary,
	})
}

// CreateCondition creates a new condition for a patient
func (h *PatientHandler) CreateCondition(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	var req models.CreateConditionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// PatientResponse.ID is the user_id
	condition, err := h.FHIRService.CreateCondition(patient.ID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Condition created",
		"data":    condition,
	})
}

// CreateObservation creates a new observation for a patient
func (h *PatientHandler) CreateObservation(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	var req models.CreateObservationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// PatientResponse.ID is the user_id
	observation, err := h.FHIRService.CreateObservation(patient.ID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Observation created",
		"data":    observation,
	})
}

// CreateMedication creates a new medication for a patient
func (h *PatientHandler) CreateMedication(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	var req models.CreateMedicationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// PatientResponse.ID is the user_id
	medication, err := h.FHIRService.CreateMedication(patient.ID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Medication created",
		"data":    medication,
	})
}

// CreateAllergy creates a new allergy for a patient
func (h *PatientHandler) CreateAllergy(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid patient ID",
		})
	}

	patient, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Patient not found",
		})
	}

	var req models.CreateAllergyRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// PatientResponse.ID is the user_id
	allergy, err := h.FHIRService.CreateAllergy(patient.ID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Allergy created",
		"data":    allergy,
	})
}

// UpdateMedicationStatus updates medication status
func (h *PatientHandler) UpdateMedicationStatus(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid medication ID",
		})
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	if err := h.MedRepo.UpdateStatus(id, body.Status); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Medication status updated",
	})
}

// UpdateAllergyStatus updates allergy status
func (h *PatientHandler) UpdateAllergyStatus(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid allergy ID",
		})
	}

	var body struct {
		ClinicalStatus string `json:"clinicalStatus"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// Verify allergy exists
	if _, err := h.AllergyRepo.FindByID(id); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Allergy not found",
		})
	}

	req := &models.CreateAllergyRequest{
		ClinicalStatus: body.ClinicalStatus,
	}

	if err := h.AllergyRepo.Update(id, req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Allergy status updated",
	})
}
