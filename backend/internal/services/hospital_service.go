package services

import (
	"context"
	"encoding/json"
	"time"

	"hospital-reservation/internal/cache"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
)

type HospitalService struct {
	hospitalRepo *repository.HospitalRepository
	cache         cache.CacheService
}

func NewHospitalService(hospitalRepo *repository.HospitalRepository, cacheService cache.CacheService) *HospitalService {
	return &HospitalService{
		hospitalRepo: hospitalRepo,
		cache:        cacheService,
	}
}

func (s *HospitalService) GetInfo() (*models.HospitalInfo, error) {
	ctx := context.Background()
	cacheKey := "hospital:info:v1"

	// Try cache first
	if s.cache.Enabled() {
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil {
			var info models.HospitalInfo
			if err := json.Unmarshal([]byte(cached), &info); err == nil {
				return &info, nil
			}
		}
	}

	// Cache miss - fetch from DB
	info, err := s.hospitalRepo.GetInfo()
	if err != nil {
		return nil, err
	}

	// Store in cache (24 hours TTL)
	if s.cache.Enabled() {
		data, _ := json.Marshal(info)
		s.cache.Set(ctx, cacheKey, string(data), 24*time.Hour)
	}

	return info, nil
}
