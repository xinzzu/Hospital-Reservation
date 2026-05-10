package handlers

import (
	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/services"

	"github.com/gofiber/fiber/v2"
)

type AdminHandler struct {
	adminService *services.AdminService
}

func NewAdminHandler(adminService *services.AdminService) *AdminHandler {
	return &AdminHandler{adminService: adminService}
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

func (h *AdminHandler) RegisterRoutes(app *fiber.App, jwtMiddleware *middleware.JWTMiddleware) {
	admin := app.Group("/api/admin")
	admin.Use(jwtMiddleware.Authenticate())
	admin.Use(jwtMiddleware.RequireAdmin())

	admin.Get("/stats", h.GetStats)
	admin.Get("/reservations", h.GetReservations)
	admin.Get("/doctors", h.GetDoctors)
}