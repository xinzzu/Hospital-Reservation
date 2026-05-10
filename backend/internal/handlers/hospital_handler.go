package handlers

import (
	"hospital-reservation/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type HospitalHandler struct {
	hospitalRepo *repository.HospitalRepository
}

func NewHospitalHandler(hospitalRepo *repository.HospitalRepository) *HospitalHandler {
	return &HospitalHandler{hospitalRepo: hospitalRepo}
}

func (h *HospitalHandler) GetInfo(c *fiber.Ctx) error {
	info, err := h.hospitalRepo.GetInfo()
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
