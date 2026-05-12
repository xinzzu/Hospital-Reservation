package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
	Port       string

	// Redis configuration
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int
	RedisEnabled  bool

	// Database connection pool
	DBMaxOpenConns    int
	DBMaxIdleConns    int
	DBConnMaxLifetime time.Duration
	DBConnMaxIdleTime time.Duration

	// Environment
	AppEnv string
}

func LoadConfig() *Config {
	appEnv := getEnv("APP_ENV", "development")

	// Dynamic DB pool config based on environment
	maxOpenConns := 25
	maxIdleConns := 5
	if appEnv == "production" {
		maxOpenConns = 50
		maxIdleConns = 10
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "hospital_user"),
		DBPassword: getEnv("DB_PASSWORD", "hospital_pass"),
		DBName:     getEnv("DB_NAME", "hospital_db"),
		JWTSecret:  getEnv("JWT_SECRET", "supersecretkey2024"),
		Port:       getEnv("PORT", "8080"),

		// Redis
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvInt("REDIS_DB", 0),
		RedisEnabled:  getEnvBool("REDIS_ENABLED", true),

		// DB Pool
		DBMaxOpenConns:    getEnvInt("DB_MAX_OPEN_CONNS", maxOpenConns),
		DBMaxIdleConns:    getEnvInt("DB_MAX_IDLE_CONNS", maxIdleConns),
		DBConnMaxLifetime: getEnvDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute),
		DBConnMaxIdleTime: getEnvDuration("DB_CONN_MAX_IDLE_TIME", 2*time.Minute),

		AppEnv: appEnv,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
