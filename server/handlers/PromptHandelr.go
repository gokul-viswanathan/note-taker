package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gokul-viswanathan/note-taker/server/aiServices"
)

func PromptHandler(c *gin.Context) {
	data := c.Query("context")
	prompt := c.Query("question")

	fmt.Println("the prompt hander is called")

	aiCallOutput := aiServices.AiCall(data, prompt)

	c.IndentedJSON(http.StatusOK, aiCallOutput)
}
