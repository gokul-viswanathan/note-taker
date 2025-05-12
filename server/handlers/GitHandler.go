package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	gh "github.com/gokul-viswanathan/note-taker/server/github_action"
)

func GetFiles(c *gin.Context) {
	output, err := gh.FileNames()

	if err != nil {
		log.Fatal("Error occured during get files", err)
	}
	c.IndentedJSON(http.StatusOK, output)
}

func CreateFiles(c *gin.Context) {
	username := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("token")
	path := c.Query("path")

	resp := gh.CreateFiles(username, repo, token, path)
	c.IndentedJSON(http.StatusOK, resp)
}
