package services

import (
	"errors"
	"hospital-reservation/internal/repository"
)

type PatientService struct {
	repo *repository.PatientRepository
}

func NewPatientService(repo *repository.PatientRepository) *PatientService {
	return &PatientService{repo: repo}
}

type PatientListResponse struct {
	Patients   []PatientResponse `json:"patients"`
	Page       int              `json:"page"`
	Limit      int              `json:"limit"`
	Total      int              `json:"total"`
	TotalPages int              `json:"total_pages"`
}

type PatientResponse struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
}

func (s *PatientService) GetAll(page, limit int, search, status string) ([]PatientResponse, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	offset := (page - 1) * limit

	patients, err := s.repo.GetAll(limit, offset, search, status)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.Count(search, status)
	if err != nil {
		return nil, 0, err
	}

	response := make([]PatientResponse, len(patients))
	for i, p := range patients {
		response[i] = PatientResponse{
			ID:        p.ID,
			Name:      p.Name,
			Email:     p.Email,
			Phone:     p.Phone,
			IsActive:  p.IsActive,
			CreatedAt: p.CreatedAt.Format("2006-01-02 15:04:05"),
		}
	}

	return response, total, nil
}

func (s *PatientService) GetByID(id int) (*PatientResponse, error) {
	patient, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return &PatientResponse{
		ID:        patient.ID,
		Name:      patient.Name,
		Email:     patient.Email,
		Phone:     patient.Phone,
		IsActive:  patient.IsActive,
		CreatedAt: patient.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *PatientService) Update(id int, name, phone string) error {
	if name == "" {
		return errors.New("name is required")
	}
	if len(name) < 2 {
		return errors.New("name must be at least 2 characters")
	}
	if phone != "" && len(phone) < 10 {
		return errors.New("phone number must be at least 10 digits")
	}
	return s.repo.Update(id, name, phone)
}

func (s *PatientService) Deactivate(id int) error {
	return s.repo.Deactivate(id)
}
