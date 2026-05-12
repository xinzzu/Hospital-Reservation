package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// RedisCache implements CacheService using Redis
type RedisCache struct {
	client  *redis.Client
	enabled bool
}

// NewRedisCache creates a new Redis cache instance
func NewRedisCache(host, port, password string, db int, enabled bool) (*RedisCache, error) {
	if !enabled {
		return &RedisCache{enabled: false}, nil
	}

	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Password: password,
		DB:       db,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	return &RedisCache{
		client:  client,
		enabled: true,
	}, nil
}

// Get retrieves a value from Redis
func (r *RedisCache) Get(ctx context.Context, key string) (string, error) {
	if !r.enabled {
		return "", fmt.Errorf("cache disabled")
	}

	val, err := r.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", fmt.Errorf("key not found")
	}
	if err != nil {
		return "", err
	}

	return val, nil
}

// Set stores a value in Redis with TTL
func (r *RedisCache) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	if !r.enabled {
		return nil
	}

	// Convert value to JSON string if not already a string
	var data string
	switch v := value.(type) {
	case string:
		data = v
	default:
		jsonData, err := json.Marshal(v)
		if err != nil {
			return fmt.Errorf("failed to marshal value: %w", err)
		}
		data = string(jsonData)
	}

	return r.client.Set(ctx, key, data, ttl).Err()
}

// Delete removes one or more keys from Redis
func (r *RedisCache) Delete(ctx context.Context, keys ...string) error {
	if !r.enabled || len(keys) == 0 {
		return nil
	}

	return r.client.Del(ctx, keys...).Err()
}

// DeletePattern removes all keys matching a pattern
func (r *RedisCache) DeletePattern(ctx context.Context, pattern string) error {
	if !r.enabled {
		return nil
	}

	// Use SCAN to find matching keys
	var cursor uint64
	var keys []string

	for {
		var scanKeys []string
		var err error

		scanKeys, cursor, err = r.client.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return fmt.Errorf("failed to scan keys: %w", err)
		}

		keys = append(keys, scanKeys...)

		if cursor == 0 {
			break
		}
	}

	// Delete all matching keys
	if len(keys) > 0 {
		return r.client.Del(ctx, keys...).Err()
	}

	return nil
}

// Exists checks if a key exists in Redis
func (r *RedisCache) Exists(ctx context.Context, key string) (bool, error) {
	if !r.enabled {
		return false, nil
	}

	count, err := r.client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// Enabled returns whether caching is enabled
func (r *RedisCache) Enabled() bool {
	return r.enabled
}

// Close closes the Redis connection
func (r *RedisCache) Close() error {
	if r.client != nil {
		return r.client.Close()
	}
	return nil
}
