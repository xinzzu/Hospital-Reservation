package handlers

import (
	"hospital-reservation/internal/services"

	"github.com/gofiber/fiber/v2"
)

type HospitalHandler struct {
	hospitalService *services.HospitalService
}

func NewHospitalHandler(hospitalService *services.HospitalService) *HospitalHandler {
	return &HospitalHandler{hospitalService: hospitalService}
}

func (h *HospitalHandler) GetInfo(c *fiber.Ctx) error {
	info, err := h.hospitalService.GetInfo()
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Hospital info not found",
		})
	}

	return c.JSON(info)
}

func (h *HospitalHandler) RegisterRoutes(app *fiber.App) {
	app.Get("/api/hospital/info", h.GetInfo)
}
