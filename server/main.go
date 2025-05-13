package main

import (
	// "fmt"
	// "net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gokul-viswanathan/note-taker/server/handlers"
)

// complete the cors setup
func main() {
	router := gin.Default()
	router.Use(corsMiddleware())

	router.GET("/api/v1/airesponse", handlers.PromptHandler)
	router.GET("/api/v1/files", handlers.GetFiles)
	router.GET("/api/v1/fileContent", handlers.GetFileContent)
	router.POST("/api/v1/filecontent", handlers.CreateFiles)

	router.Run("localhost:8080")
}

// CORS middleware function definition
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		originsString := "https://example.com,https://test.com,http://192.168.1.44:3000,http://localhost:3000"
		allowedOrigins := strings.Split(originsString, ",")

		for i, origin := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(origin)
		}

		isOriginAllowed := func(origin string, allowedOrigins []string) bool {
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					return true
				}
			}
			return false
		}

		origin := c.Request.Header.Get("Origin")
		c.Writer.Header().Set("Vary", "Origin")

		if isOriginAllowed(origin, allowedOrigins) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// CORS config
// config := cors.Config{
// 	AllowOrigins:     []string{"*"},
// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
// 	AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
// 	ExposeHeaders:    []string{"Content-Length"},
// 	AllowCredentials: true,
// 	MaxAge:           12 * time.Hour,
// }
