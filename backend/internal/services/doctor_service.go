package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"hospital-reservation/internal/cache"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"strconv"
)

type DoctorService struct {
	doctorRepo *repository.DoctorRepository
	cache      cache.CacheService
}

func NewDoctorService(doctorRepo *repository.DoctorRepository, cacheService cache.CacheService) *DoctorService {
	return &DoctorService{
		doctorRepo: doctorRepo,
		cache:      cacheService,
	}
}

func (s *DoctorService) GetAllDoctors() ([]models.Doctor, error) {
	ctx := context.Background()
	cacheKey := "doctors:list:all:v1"

	// Try cache first
	if s.cache.Enabled() {
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil {
			var doctors []models.Doctor
			if err := json.Unmarshal([]byte(cached), &doctors); err == nil {
				return doctors, nil
			}
		}
	}

	// Cache miss - fetch from DB
	doctors, err := s.doctorRepo.FindAll()
	if err != nil {
		return nil, err
	}

	// Store in cache (1 hour TTL)
	if s.cache.Enabled() {
		data, _ := json.Marshal(doctors)
		s.cache.Set(ctx, cacheKey, string(data), 1*time.Hour)
	}

	return doctors, nil
}

func (s *DoctorService) GetDoctorByID(id int) (*models.DoctorWithSchedules, error) {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("doctors:detail:%d:v1", id)

	// Try cache first
	if s.cache.Enabled() {
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil {
			var doctorWithSchedules models.DoctorWithSchedules
			if err := json.Unmarshal([]byte(cached), &doctorWithSchedules); err == nil {
				return &doctorWithSchedules, nil
			}
		}
	}

	// Cache miss - fetch from DB
	doctor, err := s.doctorRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("doctor not found")
		}
		return nil, err
	}

	schedules, err := s.doctorRepo.GetSchedules(id)
	if err != nil {
		return nil, err
	}

	result := &models.DoctorWithSchedules{
		Doctor:    *doctor,
		Schedules: schedules,
	}

	// Store in cache (1 hour TTL)
	if s.cache.Enabled() {
		data, _ := json.Marshal(result)
		s.cache.Set(ctx, cacheKey, string(data), 1*time.Hour)
	}

	return result, nil
}

func (s *DoctorService) SearchDoctors(query string) ([]models.Doctor, error) {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("doctors:search:%s:v1", query)

	// Try cache first
	if s.cache.Enabled() {
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil {
			var doctors []models.Doctor
			if err := json.Unmarshal([]byte(cached), &doctors); err == nil {
				return doctors, nil
			}
		}
	}

	// Cache miss - fetch from DB
	doctors, err := s.doctorRepo.Search(query)
	if err != nil {
		return nil, err
	}

	// Store in cache (15 minutes TTL for search results)
	if s.cache.Enabled() {
		data, _ := json.Marshal(doctors)
		s.cache.Set(ctx, cacheKey, string(data), 15*time.Minute)
	}

	return doctors, nil
}

func (s *DoctorService) GetAvailableSchedules(doctorID int, dateStr string) (*models.Schedule, error) {
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	dayOfWeek := int(date.Weekday())
	// Convert Sunday (0) to 6, Monday (1) to 0, etc.
	if dayOfWeek == 0 {
		dayOfWeek = 6
	} else {
		dayOfWeek = dayOfWeek - 1
	}

	schedules, err := s.doctorRepo.GetSchedules(doctorID)
	if err != nil {
		return nil, err
	}

	for _, schedule := range schedules {
		if schedule.DayOfWeek == dayOfWeek && schedule.IsActive {
			return &schedule, nil
		}
	}

	return nil, errors.New("no schedule available for this date")
}

func (s *DoctorService) GetSpecializations() ([]string, error) {
	ctx := context.Background()
	cacheKey := "specializations:list:v1"

	// Try cache first
	if s.cache.Enabled() {
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil {
			var specs []string
			if err := json.Unmarshal([]byte(cached), &specs); err == nil {
				return specs, nil
			}
		}
	}

	// Cache miss - fetch from DB
	doctors, err := s.doctorRepo.FindAll()
	if err != nil {
		return nil, err
	}

	specMap := make(map[string]bool)
	var specs []string
	for _, doctor := range doctors {
		if !specMap[doctor.Specialization] {
			specMap[doctor.Specialization] = true
			specs = append(specs, doctor.Specialization)
		}
	}

	// Store in cache (24 hours TTL)
	if s.cache.Enabled() {
		data, _ := json.Marshal(specs)
		s.cache.Set(ctx, cacheKey, string(data), 24*time.Hour)
	}

	return specs, nil
}

func (s *DoctorService) GetScheduleByID(scheduleID int) (*models.Schedule, error) {
	return s.doctorRepo.GetScheduleByID(scheduleID)
}

func (s *DoctorService) ValidateSchedule(doctorID int, scheduleID int, dateStr string) error {
	schedule, err := s.GetAvailableSchedules(doctorID, dateStr)
	if err != nil {
		return err
	}

	if schedule.ID != scheduleID {
		return errors.New("schedule mismatch: selected schedule is not available for the given date")
	}

	return nil
}

func (s *DoctorService) GetDoctorCode(doctorID int) (string, error) {
	return s.doctorRepo.GetDoctorCode(doctorID)
}

func (s *DoctorService) GetDayName(day int) string {
	days := []string{"Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"}
	if day >= 0 && day < 7 {
		return days[day]
	}
	return strconv.Itoa(day)
}

// Admin methods
func (s *DoctorService) UpdateDoctor(id int, name, specialization, room, bio string) error {
	err := s.doctorRepo.Update(id, name, specialization, room, bio)
	if err != nil {
		return err
	}

	// Invalidate related caches
	if s.cache.Enabled() {
		ctx := context.Background()
		s.cache.Delete(ctx,
			"doctors:list:all:v1",
			fmt.Sprintf("doctors:detail:%d:v1", id),
			"specializations:list:v1",
		)
		// Invalidate all search results
		s.cache.DeletePattern(ctx, "doctors:search:*:v1")
	}

	return nil
}

func (s *DoctorService) DeleteDoctor(id int) error {
	err := s.doctorRepo.Delete(id)
	if err != nil {
		return err
	}

	// Invalidate related caches
	if s.cache.Enabled() {
		ctx := context.Background()
		s.cache.Delete(ctx,
			"doctors:list:all:v1",
			fmt.Sprintf("doctors:detail:%d:v1", id),
			"specializations:list:v1",
		)
		s.cache.DeletePattern(ctx, "doctors:search:*:v1")
	}

	return nil
}

func (s *DoctorService) AddSchedule(doctorID int, dayOfWeek int, startTime, endTime string, maxPatients int) (*models.Schedule, error) {
	if dayOfWeek < 0 || dayOfWeek > 6 {
		return nil, errors.New("day_of_week must be between 0 and 6")
	}

	schedule, err := s.doctorRepo.AddSchedule(doctorID, dayOfWeek, startTime, endTime, maxPatients)
	if err != nil {
		return nil, err
	}

	// Invalidate related caches
	if s.cache.Enabled() {
		ctx := context.Background()
		s.cache.Delete(ctx, fmt.Sprintf("doctors:detail:%d:v1", doctorID))
	}

	return schedule, nil
}

func (s *DoctorService) UpdateSchedule(scheduleID int, dayOfWeek int, startTime, endTime string, maxPatients int, isActive bool) error {
	err := s.doctorRepo.UpdateSchedule(scheduleID, dayOfWeek, startTime, endTime, maxPatients, isActive)
	if err != nil {
		return err
	}

	// Get schedule to find doctor ID
	schedule, err := s.doctorRepo.GetScheduleByID(scheduleID)
	if err == nil && s.cache.Enabled() {
		ctx := context.Background()
		s.cache.Delete(ctx, fmt.Sprintf("doctors:detail:%d:v1", schedule.DoctorID))
	}

	return nil
}

func (s *DoctorService) DeleteSchedule(scheduleID int) error {
	// Get schedule to find doctor ID before deletion
	schedule, _ := s.doctorRepo.GetScheduleByID(scheduleID)

	err := s.doctorRepo.DeleteSchedule(scheduleID)
	if err != nil {
		return err
	}

	// Invalidate related caches
	if schedule != nil && s.cache.Enabled() {
		ctx := context.Background()
		s.cache.Delete(ctx, fmt.Sprintf("doctors:detail:%d:v1", schedule.DoctorID))
	}

	return nil
}
