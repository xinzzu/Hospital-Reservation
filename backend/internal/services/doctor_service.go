package services

import (
	"database/sql"
	"errors"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"strconv"
	"time"
)

type DoctorService struct {
	doctorRepo *repository.DoctorRepository
}

func NewDoctorService(doctorRepo *repository.DoctorRepository) *DoctorService {
	return &DoctorService{doctorRepo: doctorRepo}
}

func (s *DoctorService) GetAllDoctors() ([]models.Doctor, error) {
	return s.doctorRepo.FindAll()
}

func (s *DoctorService) GetDoctorByID(id int) (*models.DoctorWithSchedules, error) {
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

	return &models.DoctorWithSchedules{
		Doctor:    *doctor,
		Schedules: schedules,
	}, nil
}

func (s *DoctorService) SearchDoctors(query string) ([]models.Doctor, error) {
	return s.doctorRepo.Search(query)
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
	return s.doctorRepo.Update(id, name, specialization, room, bio)
}

func (s *DoctorService) DeleteDoctor(id int) error {
	return s.doctorRepo.Delete(id)
}

func (s *DoctorService) AddSchedule(doctorID int, dayOfWeek int, startTime, endTime string, maxPatients int) (*models.Schedule, error) {
	if dayOfWeek < 0 || dayOfWeek > 6 {
		return nil, errors.New("day_of_week must be between 0 and 6")
	}
	return s.doctorRepo.AddSchedule(doctorID, dayOfWeek, startTime, endTime, maxPatients)
}

func (s *DoctorService) UpdateSchedule(scheduleID int, dayOfWeek int, startTime, endTime string, maxPatients int, isActive bool) error {
	return s.doctorRepo.UpdateSchedule(scheduleID, dayOfWeek, startTime, endTime, maxPatients, isActive)
}

func (s *DoctorService) DeleteSchedule(scheduleID int) error {
	return s.doctorRepo.DeleteSchedule(scheduleID)
}
