package cache

import (
	"context"
	"time"
)

// CacheService defines the interface for cache operations
type CacheService interface {
	// Get retrieves a value from cache by key
	Get(ctx context.Context, key string) (string, error)

	// Set stores a value in cache with TTL
	Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error

	// Delete removes one or more keys from cache
	Delete(ctx context.Context, keys ...string) error

	// DeletePattern removes all keys matching a pattern (e.g., "doctors:search:*")
	DeletePattern(ctx context.Context, pattern string) error

	// Exists checks if a key exists in cache
	Exists(ctx context.Context, key string) (bool, error)

	// Enabled returns whether caching is enabled
	Enabled() bool
}
