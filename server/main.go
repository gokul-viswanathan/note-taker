package main

import (
	// "fmt"
	// "net/http"

	"github.com/gin-gonic/gin"
	"github.com/gokul-viswanathan/note-taker/server/handlers"
)

func main() {
	router := gin.Default()
	router.GET("/airesponse", handlers.PromptHandler)

	router.Run("localhost:8080")
}
