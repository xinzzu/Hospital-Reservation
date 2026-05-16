package handlers

import (
	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/services"

	"github.com/gofiber/fiber/v2"
)

type FHIRHandler struct {
	fhirService *services.FHIRService
}

func NewFHIRHandler(fhirService *services.FHIRService) *FHIRHandler {
	return &FHIRHandler{fhirService: fhirService}
}

func (h *FHIRHandler) RegisterRoutes(app *fiber.App, jwtMiddleware *middleware.JWTMiddleware) {
	fhir := app.Group("/api/fhir", jwtMiddleware.Authenticate())
	fhir.Get("/me", h.GetPatientSummary)
	fhir.Get("/conditions", h.GetConditions)
	fhir.Post("/conditions", h.CreateCondition)
	fhir.Get("/observations", h.GetObservations)
	fhir.Post("/observations", h.CreateObservation)
	fhir.Get("/observations/:category", h.GetObservationsByCategory)
	fhir.Get("/medications", h.GetMedications)
	fhir.Post("/medications", h.CreateMedication)
	fhir.Get("/allergies", h.GetAllergies)
	fhir.Post("/allergies", h.CreateAllergy)
	fhir.Get("/Patient/:id", h.GetPatientByID)
	fhir.Put("/Patient/:id", h.UpdatePatient)
}

// GET /api/fhir/me - Get patient's full health summary
func (h *FHIRHandler) GetPatientSummary(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	summary, err := h.fhirService.GetPatientHealthSummary(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch patient summary",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "collection",
		"entry": []fiber.Map{
			{"resource": summary.Patient},
			{"resource": summary.Conditions},
			{"resource": summary.Observations},
			{"resource": summary.Medications},
			{"resource": summary.Allergies},
		},
	})
}

// Condition endpoints
func (h *FHIRHandler) GetConditions(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	conditions, err := h.fhirService.GetConditions(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch conditions",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "searchset",
		"total":        len(conditions),
		"entry":        conditions,
	})
}

func (h *FHIRHandler) CreateCondition(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.CreateConditionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	condition, err := h.fhirService.CreateCondition(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"resourceType": "Condition",
		"data":         condition,
	})
}

// Observation endpoints
func (h *FHIRHandler) GetObservations(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	category := c.Query("category")

	observations, err := h.fhirService.GetObservations(userID, category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch observations",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "searchset",
		"total":        len(observations),
		"entry":        observations,
	})
}

func (h *FHIRHandler) GetObservationsByCategory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	category := c.Params("category")

	observations, err := h.fhirService.GetObservations(userID, category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch observations",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "searchset",
		"total":        len(observations),
		"entry":        observations,
	})
}

func (h *FHIRHandler) CreateObservation(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.CreateObservationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	observation, err := h.fhirService.CreateObservation(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"resourceType": "Observation",
		"data":         observation,
	})
}

// Medication endpoints
func (h *FHIRHandler) GetMedications(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	medications, err := h.fhirService.GetMedications(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch medications",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "searchset",
		"total":        len(medications),
		"entry":        medications,
	})
}

func (h *FHIRHandler) CreateMedication(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.CreateMedicationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	medication, err := h.fhirService.CreateMedication(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"resourceType": "MedicationRequest",
		"data":         medication,
	})
}

// Allergy endpoints
func (h *FHIRHandler) GetAllergies(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	allergies, err := h.fhirService.GetAllergies(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch allergies",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Bundle",
		"type":         "searchset",
		"total":        len(allergies),
		"entry":        allergies,
	})
}

func (h *FHIRHandler) CreateAllergy(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.CreateAllergyRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	allergy, err := h.fhirService.CreateAllergy(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"resourceType": "AllergyIntolerance",
		"data":         allergy,
	})
}

// Patient resource endpoints (FHIR standard)
func (h *FHIRHandler) GetPatientByID(c *fiber.Ctx) error {
	patientID := c.Params("id")

	patient, err := h.fhirService.GetPatientHealthSummary(0)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"resourceType": "OperationOutcome",
			"issue": []fiber.Map{
				{"severity": "error", "code": "not-found", "diagnostics": "Patient not found"},
			},
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Patient",
		"id":           patientID,
		"data":         patient,
	})
}

func (h *FHIRHandler) UpdatePatient(c *fiber.Ctx) error {
	patientID := c.Params("id")

	var patient models.FHIRPatient
	if err := c.BodyParser(&patient); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	return c.JSON(fiber.Map{
		"resourceType": "Patient",
		"id":           patientID,
		"data":         patient,
	})
}