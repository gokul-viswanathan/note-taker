package main

import (
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/gokul-viswanathan/note-taker/server/handlers"
	"github.com/joho/godotenv"
)

// complete the cors setup
func main() {

	godotenv.Load(".env")
	router := gin.Default()
	router.Use(corsMiddleware())

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Thought Ink server is running"})
	})
	router.GET("/api/v1/airesponse", handlers.PromptHandler)
	router.GET("/api/v1/files", handlers.GetFiles)
	router.GET("/api/v1/filecontent", handlers.GetFileContent)
	router.POST("/api/v1/filecontent", handlers.CreateFiles)
	router.PUT("/api/v1/folder", handlers.CreateFolder)
	router.POST("/api/v1/oauth/callback", handlers.OAuthCallback)
	router.DELETE("/api/v1/deleteFile", handlers.DeleteFile)
	router.DELETE("/api/v1/deleteFolder", handlers.DeleteFolder)

	router.Run("localhost:8080")
}

// CORS middleware function definition
func corsMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
		allowedOrigins := []string{
			"http://localhost:3000",
		}

		origin := c.GetHeader("Origin")
		c.Writer.Header().Set("Vary", "Origin")

		if slices.Contains(allowedOrigins, origin) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS, GET, PUT")
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
