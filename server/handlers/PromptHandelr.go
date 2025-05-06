package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PromptHandler(c *gin.Context) {
	data := c.Query("context")
	fmt.Println("the id is", data)
	prompt := c.Query("question")
	fmt.Println("the prompt is ", prompt)
	c.IndentedJSON(http.StatusOK, "Gokul")
}
