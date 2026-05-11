package services

import (
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
)

type AdminService struct {
	adminRepo *repository.AdminRepository
}

func NewAdminService(adminRepo *repository.AdminRepository) *AdminService {
	return &AdminService{adminRepo: adminRepo}
}

func (s *AdminService) GetStats() (*models.AdminStats, error) {
	return s.adminRepo.GetStats()
}

func (s *AdminService) GetReservations(filter *models.AdminReservationFilter) (*models.PaginatedResponse, error) {
	reservations, total, err := s.adminRepo.GetReservations(filter)
	if err != nil {
		return nil, err
	}

	totalPages := (total + filter.Limit - 1) / filter.Limit

	return &models.PaginatedResponse{
		Data:       reservations,
		Page:       filter.Page,
		Limit:      filter.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (s *AdminService) GetDoctors() ([]models.Doctor, error) {
	return s.adminRepo.GetAllDoctors()
}

func (s *AdminService) GetReservationDetail(id int) (*models.ReservationDetail, error) {
	return s.adminRepo.GetReservationDetail(id)
}
