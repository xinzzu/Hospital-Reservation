package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"hospital-reservation/internal/config"
	"hospital-reservation/internal/database"
	"hospital-reservation/internal/handlers"
	"hospital-reservation/internal/middleware"
	"hospital-reservation/internal/repository"
	"hospital-reservation/internal/services"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	log.Println("Connected to database successfully")

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	doctorRepo := repository.NewDoctorRepository(db)
	reservationRepo := repository.NewReservationRepository(db)
	hospitalRepo := repository.NewHospitalRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	doctorService := services.NewDoctorService(doctorRepo)
	reservationService := services.NewReservationService(reservationRepo, doctorRepo)

	// Initialize middleware
	jwtMiddleware := middleware.NewJWTMiddleware(cfg.JWTSecret)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService, jwtMiddleware)
	doctorHandler := handlers.NewDoctorHandler(doctorService)
	reservationHandler := handlers.NewReservationHandler(reservationService)
	hospitalHandler := handlers.NewHospitalHandler(hospitalRepo)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Hospital Reservation API",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"message": "Hospital Reservation API is running",
		})
	})

	// Register routes
	authHandler.RegisterRoutes(app)
	doctorHandler.RegisterRoutes(app, jwtMiddleware)
	reservationHandler.RegisterRoutes(app, jwtMiddleware)
	hospitalHandler.RegisterRoutes(app)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Starting server on %s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
