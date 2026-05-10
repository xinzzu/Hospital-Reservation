package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type JWTMiddleware struct {
	secret string
}

func NewJWTMiddleware(secret string) *JWTMiddleware {
	return &JWTMiddleware{secret: secret}
}

func (m *JWTMiddleware) Authenticate() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing authorization header",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format",
			})
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "invalid signing method")
			}
			return []byte(m.secret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}

		c.Locals("userID", int(claims["user_id"].(float64)))
		c.Locals("email", claims["email"].(string))
		c.Locals("role", claims["role"].(string))

		return c.Next()
	}
}

func (m *JWTMiddleware) OptionalAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Next()
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Next()
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(m.secret), nil
		})

		if err == nil && token.Valid {
			claims, ok := token.Claims.(jwt.MapClaims)
			if ok {
				c.Locals("userID", int(claims["user_id"].(float64)))
				c.Locals("email", claims["email"].(string))
				c.Locals("role", claims["role"].(string))
			}
		}

		return c.Next()
	}
}

// RequireAdmin checks if user has admin role
func (m *JWTMiddleware) RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role := c.Locals("role")
		if role == nil || role.(string) != "admin" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Access denied. Admin privileges required.",
			})
		}
		return c.Next()
	}
}
