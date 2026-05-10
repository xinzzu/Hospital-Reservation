@echo off
echo ========================================
echo Hospital Reservation System
echo ========================================
echo.

:: Check if Docker is running
docker info >/dev/null 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running or not installed.
    echo Please start Docker Desktop or install Docker.
    echo.
    echo Alternatively, run the application without Docker:
    echo 1. Install PostgreSQL and run the database script
    echo 2. Run backend: cd backend ^&^& go run cmd/server/main.go
    echo 3. Run frontend: cd frontend ^&^& npm run dev
    pause
    exit /b 1
)

echo Starting all services with Docker Compose...
docker-compose up -d

echo.
echo ========================================
echo Services are starting...
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
echo Health Check: http://localhost:8080/health
echo.
echo To stop: docker-compose down
echo.
pause
