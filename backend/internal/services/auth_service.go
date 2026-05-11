package services

import (
	"errors"
	"hospital-reservation/internal/config"
	"hospital-reservation/internal/models"
	"hospital-reservation/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo            *repository.UserRepository
	passwordResetRepo   *repository.PasswordResetRepository
	jwtSecret          string
}

func NewAuthService(userRepo *repository.UserRepository, passwordResetRepo *repository.PasswordResetRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo:          userRepo,
		passwordResetRepo: passwordResetRepo,
		jwtSecret:         cfg.JWTSecret,
	}
}

type PasswordResetResponse struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"` // Remove in production
}

func (s *AuthService) Register(req *models.RegisterRequest) (*models.User, error) {
	// Check if user exists
	_, err := s.userRepo.FindByEmail(req.Email)
	if err == nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Phone:        req.Phone,
		Role:         "pasien",
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(req *models.LoginRequest) (*models.LoginResponse, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) GetProfile(userID int) (*models.User, error) {
	return s.userRepo.FindByID(userID)
}

func (s *AuthService) generateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) ForgotPassword(email string) (*PasswordResetResponse, error) {
	_, err := s.userRepo.FindByEmail(email)
	// Return success anyway to prevent email enumeration
	if err != nil {
		return &PasswordResetResponse{
			Message: "If the email exists, a reset link has been sent",
		}, nil
	}

	reset, err := s.passwordResetRepo.Create(email)
	if err != nil {
		return nil, err
	}

	// In production, send email here
	// For now, return the token (for testing purposes)
	return &PasswordResetResponse{
		Message: "If the email exists, a reset link has been sent",
		Token:   reset.Token, // Remove this in production
	}, nil
}

func (s *AuthService) ResetPassword(token, newPassword string) error {
	if len(newPassword) < 6 {
		return errors.New("password must be at least 6 characters")
	}

	reset, err := s.passwordResetRepo.GetByToken(token)
	if err != nil {
		return errors.New("invalid or expired token")
	}

	if reset.Used {
		return errors.New("token has already been used")
	}

	if time.Now().After(reset.ExpiresAt) {
		return errors.New("token has expired")
	}

	user, err := s.userRepo.FindByEmail(reset.Email)
	if err != nil {
		return errors.New("user not found")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	if err := s.userRepo.UpdatePassword(user.ID, string(hashedPassword)); err != nil {
		return errors.New("failed to update password")
	}

	if err := s.passwordResetRepo.MarkUsed(token); err != nil {
		return errors.New("failed to mark token as used")
	}

	return nil
}
