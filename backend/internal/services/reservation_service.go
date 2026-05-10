package services

import (
	"errors"
	"fmt"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"time"
)

type ReservationService struct {
	reservationRepo *repository.ReservationRepository
	doctorRepo      *repository.DoctorRepository
}

func NewReservationService(reservationRepo *repository.ReservationRepository, doctorRepo *repository.DoctorRepository) *ReservationService {
	return &ReservationService{
		reservationRepo: reservationRepo,
		doctorRepo:      doctorRepo,
	}
}

func (s *ReservationService) CreateReservation(patientID int, req *models.CreateReservationRequest) (*models.ReservationWithDetails, error) {
	// Validate date format
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	// Check if date is in the past
	if date.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, errors.New("cannot make reservation for past dates")
	}

	// Get schedule
	schedule, err := s.doctorRepo.GetScheduleByID(req.ScheduleID)
	if err != nil {
		return nil, errors.New("schedule not found")
	}

	if schedule.DoctorID != req.DoctorID {
		return nil, errors.New("schedule does not belong to the selected doctor")
	}

	// Check if schedule is active
	if !schedule.IsActive {
		return nil, errors.New("schedule is not active")
	}

	// Check day of week
	dayOfWeek := int(date.Weekday())
	if dayOfWeek == 0 {
		dayOfWeek = 6
	} else {
		dayOfWeek = dayOfWeek - 1
	}

	if schedule.DayOfWeek != dayOfWeek {
		return nil, errors.New("selected date does not match the schedule day")
	}

	// Check max patients
	currentCount, err := s.reservationRepo.CountByScheduleAndDate(req.ScheduleID, req.Date)
	if err != nil {
		return nil, err
	}

	if currentCount >= schedule.MaxPatients {
		return nil, errors.New("schedule is fully booked")
	}

	// Get next queue number
	queueNumber, err := s.reservationRepo.GetNextQueueNumber(req.DoctorID, req.Date)
	if err != nil {
		return nil, err
	}

	// Generate queue code
	queueCode := repository.GenerateQueueCode(req.DoctorID, date, queueNumber)

	// Create reservation
	reservation := &models.Reservation{
		PatientID:        patientID,
		DoctorID:         req.DoctorID,
		ScheduleID:       req.ScheduleID,
		ReservationDate:  req.Date,
		QueueNumber:      queueNumber,
		QueueCode:        queueCode,
		Status:           "menunggu",
		Notes:            req.Notes,
	}

	if err := s.reservationRepo.Create(reservation); err != nil {
		return nil, err
	}

	// Get full reservation details
	fullReservation, err := s.reservationRepo.FindByCode(queueCode)
	if err != nil {
		return nil, err
	}

	return fullReservation, nil
}

func (s *ReservationService) GetPatientReservations(patientID int) ([]models.ReservationWithDetails, error) {
	return s.reservationRepo.FindByPatientID(patientID)
}

func (s *ReservationService) GetReservationByCode(code string) (*models.ReservationWithDetails, error) {
	reservation, err := s.reservationRepo.FindByCode(code)
	if err != nil {
		return nil, fmt.Errorf("reservation not found")
	}
	return reservation, nil
}

func (s *ReservationService) UpdateStatus(code string, status string) error {
	validStatuses := map[string]bool{
		"menunggu": true,
		"dipanggil": true,
		"selesai":  true,
		"batal":    true,
	}

	if !validStatuses[status] {
		return errors.New("invalid status")
	}

	return s.reservationRepo.UpdateStatus(code, status)
}
