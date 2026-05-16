package handlers

import (
	"strconv"

	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"hospital-reservation/internal/services"

	"github.com/gofiber/fiber/v2"
)

type AdminHandler struct {
	adminService   *services.AdminService
	doctorService  *services.DoctorService
	patientHandler *PatientHandler
}

func NewAdminHandler(
	adminService *services.AdminService,
	doctorService *services.DoctorService,
	patientHandler *PatientHandler,
	fhirService *services.FHIRService,
	medRepo *repository.FHIRMedicationRepository,
	allergyRepo *repository.FHIRAllergyRepository,
) *AdminHandler {
	// Update patient handler with EHR dependencies
	patientHandler.FHIRService = fhirService
	patientHandler.MedRepo = medRepo
	patientHandler.AllergyRepo = allergyRepo

	return &AdminHandler{
		adminService:   adminService,
		doctorService:  doctorService,
		patientHandler: patientHandler,
	}
}

func (h *AdminHandler) GetStats(c *fiber.Ctx) error {
	stats, err := h.adminService.GetStats()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch statistics",
		})
	}

	return c.JSON(stats)
}

func (h *AdminHandler) GetReservations(c *fiber.Ctx) error {
	var filter models.AdminReservationFilter
	if err := c.QueryParser(&filter); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid filter parameters",
		})
	}

	result, err := h.adminService.GetReservations(&filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch reservations",
		})
	}

	return c.JSON(result)
}

func (h *AdminHandler) GetReservationDetail(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid reservation ID",
		})
	}

	detail, err := h.adminService.GetReservationDetail(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Reservation not found",
		})
	}

	return c.JSON(detail)
}

func (h *AdminHandler) GetDoctors(c *fiber.Ctx) error {
	doctors, err := h.adminService.GetDoctors()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch doctors",
		})
	}

	return c.JSON(fiber.Map{
		"doctors": doctors,
	})
}

func (h *AdminHandler) UpdateDoctor(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid doctor ID"})
	}

	var req struct {
		Name           string `json:"name"`
		Specialization string `json:"specialization"`
		Room          string `json:"room"`
		Bio           string `json:"bio"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body"})
	}

	if err := h.doctorService.UpdateDoctor(id, req.Name, req.Specialization, req.Room, req.Bio); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Doctor updated successfully"})
}

func (h *AdminHandler) DeleteDoctor(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid doctor ID"})
	}

	if err := h.doctorService.DeleteDoctor(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Doctor deleted successfully"})
}

func (h *AdminHandler) CreateSchedule(c *fiber.Ctx) error {
	doctorID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid doctor ID"})
	}

	var req struct {
		DayOfWeek   int    `json:"day_of_week"`
		StartTime   string `json:"start_time"`
		EndTime     string `json:"end_time"`
		MaxPatients int    `json:"max_patients"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body"})
	}

	schedule, err := h.doctorService.AddSchedule(doctorID, req.DayOfWeek, req.StartTime, req.EndTime, req.MaxPatients)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{"schedule": schedule})
}

func (h *AdminHandler) UpdateSchedule(c *fiber.Ctx) error {
	scheduleID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid schedule ID"})
	}

	var req struct {
		DayOfWeek   int    `json:"day_of_week"`
		StartTime   string `json:"start_time"`
		EndTime     string `json:"end_time"`
		MaxPatients int    `json:"max_patients"`
		IsActive    bool   `json:"is_active"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body"})
	}

	if err := h.doctorService.UpdateSchedule(scheduleID, req.DayOfWeek, req.StartTime, req.EndTime, req.MaxPatients, req.IsActive); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Schedule updated successfully"})
}

func (h *AdminHandler) DeleteSchedule(c *fiber.Ctx) error {
	scheduleID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid schedule ID"})
	}

	if err := h.doctorService.DeleteSchedule(scheduleID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Schedule deleted successfully"})
}

func (h *AdminHandler) RegisterRoutes(app *fiber.App, jwtMiddleware *middleware.JWTMiddleware) {
	admin := app.Group("/api/admin")
	admin.Use(jwtMiddleware.Authenticate())
	admin.Use(jwtMiddleware.RequireAdmin())

	admin.Get("/stats", h.GetStats)
	admin.Get("/reservations", h.GetReservations)
	admin.Get("/reservations/:id", h.GetReservationDetail)
	admin.Get("/doctors", h.GetDoctors)
	admin.Put("/doctors/:id", h.UpdateDoctor)
	admin.Delete("/doctors/:id", h.DeleteDoctor)
	admin.Post("/doctors/:id/schedules", h.CreateSchedule)

	schedules := app.Group("/api/admin/schedules")
	schedules.Use(jwtMiddleware.Authenticate())
	schedules.Use(jwtMiddleware.RequireAdmin())
	schedules.Put("/:id", h.UpdateSchedule)
	schedules.Delete("/:id", h.DeleteSchedule)

	// Patient routes
	admin.Get("/patients", h.patientHandler.GetAll)
	admin.Get("/patients/:id", h.patientHandler.GetByID)
	admin.Put("/patients/:id", h.patientHandler.Update)
	admin.Post("/patients/:id/deactivate", h.patientHandler.Deactivate)

	// EHR Management routes
	admin.Get("/patients/:id/ehr", h.patientHandler.GetPatientEHR)
	admin.Post("/patients/:id/conditions", h.patientHandler.CreateCondition)
	admin.Post("/patients/:id/observations", h.patientHandler.CreateObservation)
	admin.Post("/patients/:id/medications", h.patientHandler.CreateMedication)
	admin.Post("/patients/:id/allergies", h.patientHandler.CreateAllergy)
	admin.Patch("/medications/:id/status", h.patientHandler.UpdateMedicationStatus)
	admin.Patch("/allergies/:id/status", h.patientHandler.UpdateAllergyStatus)
}
