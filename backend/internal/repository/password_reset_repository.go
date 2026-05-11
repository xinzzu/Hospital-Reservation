package repository

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"time"
)

type PasswordResetRepository struct {
	db *sql.DB
}

func NewPasswordResetRepository(db *sql.DB) *PasswordResetRepository {
	return &PasswordResetRepository{db: db}
}

type PasswordReset struct {
	ID        int
	Email     string
	Token     string
	ExpiresAt time.Time
	Used      bool
}

func generateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func (r *PasswordResetRepository) Create(email string) (*PasswordReset, error) {
	token, err := generateToken()
	if err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(15 * time.Minute)

	query := `INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3) RETURNING id`
	var id int
	err = r.db.QueryRow(query, email, token, expiresAt).Scan(&id)
	if err != nil {
		return nil, err
	}

	return &PasswordReset{
		ID:        id,
		Email:     email,
		Token:     token,
		ExpiresAt: expiresAt,
		Used:      false,
	}, nil
}

func (r *PasswordResetRepository) GetByToken(token string) (*PasswordReset, error) {
	query := `SELECT id, email, token, expires_at, used FROM password_resets WHERE token = $1`
	var reset PasswordReset
	err := r.db.QueryRow(query, token).Scan(&reset.ID, &reset.Email, &reset.Token, &reset.ExpiresAt, &reset.Used)
	if err != nil {
		return nil, err
	}
	return &reset, nil
}

func (r *PasswordResetRepository) MarkUsed(token string) error {
	query := `UPDATE password_resets SET used = TRUE WHERE token = $1`
	_, err := r.db.Exec(query, token)
	return err
}

func (r *PasswordResetRepository) DeleteExpired() error {
	query := `DELETE FROM password_resets WHERE expires_at < NOW() OR used = TRUE`
	_, err := r.db.Exec(query)
	return err
}
