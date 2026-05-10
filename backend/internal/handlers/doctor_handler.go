package handlers

import (
	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type DoctorHandler struct {
	doctorService *services.DoctorService
}

func NewDoctorHandler(doctorService *services.DoctorService) *DoctorHandler {
	return &DoctorHandler{doctorService: doctorService}
}

func (h *DoctorHandler) GetAllDoctors(c *fiber.Ctx) error {
	specialization := c.Query("specialization")
	search := c.Query("search")

	var doctors interface{}
	var err error

	if search != "" {
		doctors, err = h.doctorService.SearchDoctors(search)
	} else if specialization != "" {
		doctors, err = h.doctorService.SearchDoctors(specialization)
	} else {
		doctors, err = h.doctorService.GetAllDoctors()
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch doctors",
		})
	}

	return c.JSON(fiber.Map{
		"doctors": doctors,
	})
}

func (h *DoctorHandler) GetDoctorByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid doctor ID",
		})
	}

	doctor, err := h.doctorService.GetDoctorByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(doctor)
}

func (h *DoctorHandler) GetDoctorSchedules(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid doctor ID",
		})
	}

	doctorWithSchedules, err := h.doctorService.GetDoctorByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Doctor not found",
		})
	}

	return c.JSON(fiber.Map{
		"schedules": doctorWithSchedules.Schedules,
	})
}

func (h *DoctorHandler) GetSpecializations(c *fiber.Ctx) error {
	specs, err := h.doctorService.GetSpecializations()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch specializations",
		})
	}

	return c.JSON(fiber.Map{
		"specializations": specs,
	})
}

func (h *DoctorHandler) RegisterRoutes(app *fiber.App, jwtMiddleware *middleware.JWTMiddleware) {
	doctors := app.Group("/api/doctors", jwtMiddleware.Authenticate())

	doctors.Get("/", h.GetAllDoctors)
	doctors.Get("/specializations", h.GetSpecializations)
	doctors.Get("/:id", h.GetDoctorByID)
	doctors.Get("/:id/schedules", h.GetDoctorSchedules)
}
