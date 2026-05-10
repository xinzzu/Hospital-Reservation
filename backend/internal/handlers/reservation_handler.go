package handlers

import (
	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/services"

	"github.com/gofiber/fiber/v2"
)

type ReservationHandler struct {
	reservationService *services.ReservationService
}

func NewReservationHandler(reservationService *services.ReservationService) *ReservationHandler {
	return &ReservationHandler{reservationService: reservationService}
}

func (h *ReservationHandler) CreateReservation(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.CreateReservationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.DoctorID == 0 || req.ScheduleID == 0 || req.Date == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Doctor ID, schedule ID, and date are required",
		})
	}

	reservation, err := h.reservationService.CreateReservation(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":     "Reservation created successfully",
		"reservation": reservation,
	})
}

func (h *ReservationHandler) GetMyReservations(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	reservations, err := h.reservationService.GetPatientReservations(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch reservations",
		})
	}

	return c.JSON(fiber.Map{
		"reservations": reservations,
	})
}

func (h *ReservationHandler) GetReservationByCode(c *fiber.Ctx) error {
	code := c.Params("code")

	reservation, err := h.reservationService.GetReservationByCode(code)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(reservation)
}

func (h *ReservationHandler) UpdateStatus(c *fiber.Ctx) error {
	code := c.Params("code")

	var req models.UpdateStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.reservationService.UpdateStatus(code, req.Status); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Status updated successfully",
	})
}

func (h *ReservationHandler) RegisterRoutes(app *fiber.App, jwtMiddleware *middleware.JWTMiddleware) {
	// Protected routes
	reservations := app.Group("/api/reservations", jwtMiddleware.Authenticate())
	reservations.Post("/", h.CreateReservation)
	reservations.Get("/me", h.GetMyReservations)
	reservations.Patch("/:code/status", h.UpdateStatus)

	// Public routes
	app.Get("/api/reservations/:code", h.GetReservationByCode)
}
