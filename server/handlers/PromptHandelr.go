// Package handlers provides HTTP handler functions for LLM.
package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gokul-viswanathan/note-taker/server/aiservices"
)

func PromptHandler(c *gin.Context) {
	data := c.Query("context")
	prompt := c.Query("question")

	fmt.Println("the prompt hander is called")

	aiCallOutput := aiservices.OpenAiCall(data, prompt)

	c.JSON(http.StatusOK, aiCallOutput)
}
