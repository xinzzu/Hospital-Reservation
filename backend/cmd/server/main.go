package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"hospital-reservation/internal/cache"
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

	// Initialize Redis cache
	log.Printf("Attempting to connect to Redis at %s:%s (enabled: %v)", cfg.RedisHost, cfg.RedisPort, cfg.RedisEnabled)
	redisCache, err := cache.NewRedisCache(
		cfg.RedisHost,
		cfg.RedisPort,
		cfg.RedisPassword,
		cfg.RedisDB,
		cfg.RedisEnabled,
	)
	if err != nil {
		log.Printf("Warning: Failed to connect to Redis: %v. Continuing without cache.", err)
		// Create disabled cache instance
		redisCache = &cache.RedisCache{}
	} else if cfg.RedisEnabled {
		log.Println("Connected to Redis successfully")
		defer redisCache.Close()
	} else {
		log.Println("Redis caching is disabled")
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	doctorRepo := repository.NewDoctorRepository(db)
	reservationRepo := repository.NewReservationRepository(db)
	hospitalRepo := repository.NewHospitalRepository(db)
	adminRepo := repository.NewAdminRepository(db)
	patientRepo := repository.NewPatientRepository(db)
	passwordResetRepo := repository.NewPasswordResetRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, passwordResetRepo, cfg)
	doctorService := services.NewDoctorService(doctorRepo, redisCache)
	reservationService := services.NewReservationService(reservationRepo, doctorRepo)
	adminService := services.NewAdminService(adminRepo)
	patientService := services.NewPatientService(patientRepo)
	userService := services.NewUserService(userRepo)
	hospitalService := services.NewHospitalService(hospitalRepo, redisCache)

	// Initialize middleware
	jwtMiddleware := middleware.NewJWTMiddleware(cfg.JWTSecret)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService, jwtMiddleware)
	doctorHandler := handlers.NewDoctorHandler(doctorService)
	reservationHandler := handlers.NewReservationHandler(reservationService)
	hospitalHandler := handlers.NewHospitalHandler(hospitalService)
	patientHandler := handlers.NewPatientHandler(patientService)
	userHandler := handlers.NewUserHandler(userService)
	adminHandler := handlers.NewAdminHandler(adminService, doctorService, patientHandler)

	// FHIR repositories
	fhirPatientRepo := repository.NewFHIRPatientRepository(db)
	fhirConditionRepo := repository.NewFHIRConditionRepository(db)
	fhirObservationRepo := repository.NewFHIRObservationRepository(db)
	fhirMedicationRepo := repository.NewFHIRMedicationRepository(db)
	fhirAllergyRepo := repository.NewFHIRAllergyRepository(db)

	// FHIR service
	fhirService := services.NewFHIRService(
		fhirPatientRepo, fhirConditionRepo, fhirObservationRepo,
		fhirMedicationRepo, fhirAllergyRepo, reservationRepo,
	)

	// FHIR handler
	fhirHandler := handlers.NewFHIRHandler(fhirService)

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
	userHandler.RegisterRoutes(app, jwtMiddleware)
	adminHandler.RegisterRoutes(app, jwtMiddleware)
	fhirHandler.RegisterRoutes(app, jwtMiddleware)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Starting server on %s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
